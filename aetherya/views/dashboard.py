import json
import subprocess

from flask import Blueprint, request, g, make_response, jsonify, render_template
from datetime import datetime

from aetherya.redis import rdb
from aetherya.models.message import Message, MessageArchive
from aetherya.models.guild import Guild
from aetherya.models.user import User
from aetherya.models.channel import Channel
from aetherya.util.decos import authed

dashboard = Blueprint('dash', __name__)


def pretty_number(i):
    if i > 1000000:
        return '%.2fm' % (i / 1000000.0)
    elif i > 10000:
        return '%.2fk' % (i / 1000.0)
    return str(i)


class ServerSentEvent(object):
    def __init__(self, data):
        self.data = data
        self.event = None
        self.id = None
        self.desc_map = {
            self.data: "data",
            self.event: "event",
            self.id: "id"
        }

    def encode(self):
        if not self.data:
            return ""
        lines = ["%s: %s" % (v, k) for k, v in self.desc_map.iteritems() if k]
        return "%s\n\n" % "\n".join(lines)


@dashboard.route('/api/stats')
def stats():
    stats = json.loads(rdb.get('web:dashboard:stats') or '{}')

    if not stats or 'refresh' in request.args:
        # stats['messages'] = pretty_number(Message.select().count())
        # stats['guilds'] = pretty_number(Guild.select().count())
        # stats['users'] = pretty_number(User.select().count())
        # stats['channels'] = pretty_number(Channel.select().count())
        stats['messages'] = Message.select().count()
        stats['guilds'] = Guild.select().count()
        stats['users'] = User.select().count()
        stats['channels'] = Channel.select().count()

        rdb.setex('web:dashboard:stats', json.dumps(stats), 300)
    
    return jsonify(stats)


@dashboard.route('/api/archive/<aid>.<fmt>')
def archive(aid, fmt):
    try:
        archive = MessageArchive.select().where(
            (MessageArchive.archive_id == aid) &
            (MessageArchive.expires_at > datetime.utcnow())
        ).get()
    except MessageArchive.DoesNotExist:
        return 'Invalid or Expires Archive ID', 404

    mime_type = None
    if fmt == 'json':
        mime_type == 'application/json'
    elif fmt == 'txt':
        mime_type = 'text/plain'
    elif fmt == 'csv':
        mime_type = 'text/csv'

    if fmt == 'html':
        return render_template('archive.html')

    res = make_response(archive.encode(fmt))
    res.headers['Content-Type'] = mime_type
    return res


@dashboard.route('/api/deploy', methods=['POST'])
@authed
def deploy():
    if not g.user.admin:
        return '', 401

    subprocess.Popen(['git', 'pull', 'origin', 'master']).wait()
    rdb.publish('actions', json.dumps({
        'type': 'RESTART',
    }))
    return '', 200

@dashboard.route('/api/bot/shutdown', methods=['POST'])
@authed
def shutdownBot():
    if not g.user.admin:
        return '', 401

    subprocess.Popen(['pm2', 'stop', 'bot']).wait()
    return '', 200

@dashboard.route('/api/bot/restart', methods=['POST'])
@authed
def restartBot():
    if not g.user.admin:
        return '', 401

    subprocess.Popen(['pm2', 'restart', 'bot']).wait()
    return '', 200

@dashboard.route('/api/frontend/shutdown', methods=['POST'])
@authed
def shutdownFrontend():
    if not g.user.admin:
        return '', 401

    subprocess.Popen(['pm2', 'stop', 'frontend']).wait()
    return '', 200

@dashboard.route('/api/frontend/restart', methods=['POST'])
@authed
def restartFrontend():
    if not g.user.admin:
        return '', 401

    subprocess.Popen(['pm2', 'restart', 'frontend']).wait()
    return '', 200

@dashboard.route('/api/ga/add', methods=['POST'])
@authed
def add_ga(user_id):
    if not g.user.admin:
        return '', 401

    subprocess.Popen(['docker-compose', 'exec', 'web', './manage.py', 'add-global-admin', user_id]).wait()
    return '', 200