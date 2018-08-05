const url = require('url');
const path = require('path');

const Discord = require('discord.js');

const express = require('express');
const app = express();

const moment = require('moment');
require('moment-duration-format');

const passport = require('passport');
const session = require('express-session');
const LevelStore = require('level-session-store')(session);
const Strategy = require('passport-discord').Strategy;

const helmet = require('helmet');

const md = require('marked');

module.exports = (client) => {
  const dataDir = path.resolve(`${process.cwd()}${path.sep}frontend`);
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

  app.use('/public', express.static(path.resolve(`${dataDir}${path.sep}public`)));

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new Strategy({
    clientID: client.appInfo.id,
    clientSecret: client.config.dashboard.oauthSecret,
    callbackURL: client.config.dashboard.callbackURL,
    scope: ['identify', 'guilds']
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  }));

  app.use(session({
    store: new LevelStore('./data/dashboard-session/'),
    secret: client.config.dashboard.sessionSecret,
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(helmet());

  app.locals.domain = client.config.dashboard.domain;

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect('/login');
  }

  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };

  app.get('/login', (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = '/';
    }
    next();
  }, passport.authenticate('discord'));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/callback', passport.authenticate('discord', { failureRedirect: '/autherror' }), (req, res) => {
    if (req.user.id === client.appInfo.owner.id) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect('/');
    }
  });

  app.get('/autherror', (req, res) => {
    renderTemplate(res, req, 'autherror.ejs');
  });

  app.get('/', (req, res) => {
    renderTemplate(res, req, 'index.ejs');
  });

  app.get('/commands', (req, res) => {
    renderTemplate(res, req, 'commands.ejs', {md});
  });

  app.get('/stats', (req, res) => {
    const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
    const members = client.guilds.reduce((p, c) => p + c.memberCount, 0);
    const textChannels = client.channels.filter(c => c.type === 'text').size;
    const voiceChannels = client.channels.filter(c => c.type === 'voice').size;
    const guilds = client.guilds.size;
    renderTemplate(res, req, 'stats.ejs', {
      stats: {
        servers: guilds,
        members: members,
        text: textChannels,
        voice: voiceChannels,
        uptime: duration,
        memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        dVersion: Discord.version,
        nVersion: process.version
      }
    });
  });

  app.get('/dashboard', checkAuth, (req, res) => {
    const perms = Discord.EvaluatedPermissions;
    renderTemplate(res, req, 'dashboard.ejs', {perms});
  });

  app.get('/admin', checkAuth, (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/');
    renderTemplate(res, req, 'admin.ejs');
  });

  app.get('/users/:userID', checkAuth, (req, res) => {
    const perms = Discord.EvaluatedPermissions;
    const user = client.users.get(req.params.userID);
    renderTemplate(res, req, 'users/manage.ejs', {perms});
  });

  app.get('/users/:userID/stats', checkAuth, (req, res) => {
    const user = client.users.get(req.params.userID);
    if (!user) return res.status(404);
    renderTemplate(res, req, 'users/stats.ejs', {user});
  });

  app.get('/dashboard/:guildID', checkAuth, (req, res) => {
    res.redirect(`/dashboard/${req.params.guildID}/manage`);
  });

  app.get('/dashboard/:guildID/leave', checkAuth, (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    guild.leave();
    res.redirect('/dashboard');
  });

  app.get('/dashboard/:guildID/manage', checkAuth, (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
    if (!isManaged && !req.session.isAdmin) res.redirect('/');
    renderTemplate(res, req, 'guild/manage.ejs', {guild});
  });

  app.post('/dashboard/:guildID/manage', checkAuth, (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
    if (!isManaged && !req.session.isAdmin) res.redirect('/');
    client.settings.set(guild.id, req.body);
    res.redirect('/dashboard/'+req.params.guildID+'/manage');
  });

  app.get('/dashboard/:guildID/members', checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    renderTemplate(res, req, 'guild/members.ejs', {
      guild: guild,
      members: guild.members.array()
    });
  });

  app.get('/dashboard/:guildID/commands', checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    renderTemplate(res, req, 'guild/commands.ejs', {guild});
    // res.redirect('/dashboard/'+req.params.guildID+'/commands');
  });

  app.get('/dashboard/:guildID/members/list', checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    if (req.query.fetch) {
      await guild.fetchMembers();
    }
    const totals = guild.members.size;
    const start = parseInt(req.query.start, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 50;
    let members = guild.members;
    
    if (req.query.filter && req.query.filter !== 'null') {
      //if (!req.query.filtervalue) return res.status(400);
      members = members.filter(m=> {
        m = req.query.filterUser ? m.user : m;
        return m['displayName'].toLowerCase().includes(req.query.filter.toLowerCase());
      });
    }
    
    if (req.query.sortby) {
      members = members.sort((a, b) => a[req.query.sortby] > b[req.query.sortby]);
    }
    const memberArray = members.array().slice(start, start+limit);
    
    const returnObject = [];
    for (let i = 0; i < memberArray.length; i++) {
      const m = memberArray[i];
      returnObject.push({
        id: m.id,
        status: m.user.presence.status,
        bot: m.user.bot,
        username: m.user.username,
        displayName: m.displayName,
        tag: m.user.tag,
        discriminator: m.user.discriminator,
        joinedAt: m.joinedTimestamp,
        createdAt: m.user.createdTimestamp,
        highestRole: {
          hexColor: m.highestRole.hexColor
        },
        memberFor: moment.duration(Date.now() - m.joinedAt).format(' D [days], H [hrs], m [mins], s [secs]'),
        roles: m.roles.map(r=>({
          name: r.name,
          id: r.id,
          hexColor: r.hexColor
        }))
      });
    }
    res.json({
      total: totals,
      page: (start/limit)+1,
      pageof: Math.ceil(members.size / limit),
      members: returnObject
    });
  });

  app.get('/dashboard/:guildID/stats', checkAuth, (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
    if (!isManaged && !req.session.isAdmin) res.redirect('/');
    renderTemplate(res, req, 'guild/stats.ejs', {guild});
  });

  app.get('/dashboard/:guildID/reset', checkAuth, async (req, res) => {
    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
    if (!isManaged && !req.session.isAdmin) res.redirect('/');
    client.settings.delete(guild.id);
    res.redirect('/dashboard/'+req.params.guildID);
  });

  app.get('/api/kpop/yezi', (req, res) => {
    if (client.config.apiKeys.includes(req.headers.authorization)) {
      client.util.randomFile('./frontend/assets/kpop/yezi', (err, file) => {
        if (err) {
          res.status(500).json({ code: 500, message: 'Something went wrong. Please try again later.' });
          client.log('INTERNAL ERROR', err, 'API ERROR');
        }
        res.status(200).json({ url: `https://cdn.aetherya.stream/api/kpop/yezi/${file}` });
      });
    } else {
      return res.status(403).send({ message: 'The maze is not for you. In other words, apply for an API key.' });
    }
  });

  app.get('/api/animals/cat', (req, res) => {
    if (client.config.apiKeys.includes(req.headers.authorization)) {
      client.util.randomFile('./frontend/assets/animals/cats', (err, file) => {
        if (err) {
          res.status(500).json({ code: 500, message: 'Something went wrong. Please try again later.' });
          client.log('INTERNAL ERROR', err, 'API ERROR');
        }
        res.status(200).json({ url: `https://cdn.aetherya.stream/api/animals/cat/${file}` });
      });
    } else {
      return res.status(403).send({ message: 'The maze is not for you. In other words, apply for an API key.' });
    }
  });

  app.get('/api/nsfw/boobs', (req, res) => {
    if (client.config.apiKeys.includes(req.headers.authorization)) {
      client.util.randomFile('./frontend/assets/nsfw/boobs', (err, file) => {
        if (err) {
          res.status(500).json({ code: 500, message: 'Something went wrong, please try again later.' });
          client.log('INTERNAL ERROR', err, 'API ERROR');
        }
        res.status(200).json({ url: `https://cdn.aetherya.stream/api/nsfw/boobs/${file}` });
      });
    } else {
      return res.status(403).send({ message: 'The maze is not for you. In other words, apply for an API key.' });
    }
  });
  
  app.get('/api/nsfw/butts', (req, res) => {
    if (client.config.apiKeys.includes(req.headers.authorization)) {
      client.util.randomFile('./frontend/assets/nsfw/butts', (err, file) => {
        if (err) {
          res.status(500).json({ code: 500, message: 'Something went wrong, please try again later.' });
          client.log('INTERNAL ERROR', err, 'API ERROR');
        }
        res.status(200).json({ url: `https://cdn.aetherya.stream/api/nsfw/butts/${file}` });
      });
    } else {
      return res.status(403).send({ message: 'The maze is not for you. In other words, apply for an API key.' });
    }
  });

  app.get('/api/nsfw/lesbian', (req, res) => {
    if (client.config.apiKeys.includes(req.headers.authorization)) {
      client.util.randomFile('./frontend/assets/nsfw/lesbian', (err, file) => {
        if (err) {
          res.status(500).json({ code: 500, message: 'Something went wrong, please try again later.' });
          client.log('INTERNAL ERROR', err, 'API ERROR');
        }
        res.status(200).json({ url: `https://cdn.aetherya.stream/api/nsfw/lesbian/${file}` });
      });
    } else {
      return res.status(403).send({ message: 'The maze is not for you. In other words, apply for an API key.' });
    }
  });

  app.get('/api/nsfw/nude', (req, res) => {
    if (client.config.apiKeys.includes(req.headers.authorization)) {
      client.util.randomFile('./frontend/assets/nsfw/nude', (err, file) => {
        if (err) {
          res.status(500).json({ code: 500, message: 'Something went wrong, please try again later.' });
          client.log('INTERNAL ERROR', err, 'API ERROR');
        }
        res.status(200).json({ url: `https://cdn.aetherya.stream/api/nsfw/nude/${file}` });
      });
    } else {
      return res.status(403).send({ message: 'The maze is not for you. In other words, apply for an API key.' });
    }
  });

  app.get('/api/nsfw/redheads', (req, res) => {
    if (client.config.apiKeys.includes(req.headers.authorization)) {
      client.util.randomFile('./frontend/assets/nsfw/redheads', (err, file) => {
        if (err) {
          res.status(500).json({ code: 500, message: 'Something went wrong, please try again later.' });
          client.log('INTERNAL ERROR', err, 'API ERROR');
        }
        res.status(200).json({ url: `https://cdn.aetherya.stream/api/nsfw/redheads/${file}` });
      });
    } else {
      return res.status(403).send({ message: 'The maze is not for you. In other words, apply for an API key.' });
    }
  });

  client.site = app.listen(client.config.dashboard.port);
};