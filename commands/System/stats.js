const Command = require('../../structures/Command.js');
const { version } = require('discord.js');
const bot = require('../../package.json');

const os = require('os');

const moment = require('moment');
require('moment-duration-format');


class Stats extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      description: 'Gives some useful bot statistics',
      usage: 'stats',
      category: 'System',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const uptime = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
    const host = moment.duration(os.uptime() * 1000).format(' D [days], H [hrs], m [mins], s [secs]');
    message.channel.send(`= STATISTICS =
• Users      :: ${this.client.users.size.toLocaleString()}
• Guilds     :: ${this.client.guilds.size.toLocaleString()}
• Channels   :: ${this.client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node.js    :: ${process.version}
• Aetherya   :: ${bot.version}

= UPTIME =
• Client     :: ${uptime}
• Host       :: ${host}

= HOST USAGE =
• CPU Load   :: ${os.loadavg()[2]}%
• RAM Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
`, {code: 'asciidoc'});
  }
}

module.exports = Stats;