import EventEmitter from 'eventemitter3';
import axios from 'axios';

import User from './models/user';

/* Big thanks to Dooley for a lot of this implementation */

class State {
  constructor() {
    this.events = new EventEmitter();
    this.user = null;
    this.ready = false;
    this.stats = null;
    this.name = 'Airplane';
    this.docsLink = 'https://airplane.gg';
    this.supportServer = 'https://discord.gg/Gu7jRdW'

    this._currentGuild = null;
  }

  set showAllGuilds(value) {
    window.localStorage.setItem('state.showAllGuilds', value);
    this.events.emit('showAllGuilds.set', value);
  }

  get showAllGuilds() {
    return JSON.parse(window.localStorage.getItem('state.showAllGuilds') || 'false');
  }

  set currentGuild(guild) {
    this._currentGuild = guild;
    this.events.emit('currentGuild.set', guild);
  }

  get currentGuild() {
    return this._currentGuild;
  }

  init() {
    if (this.ready) return;

    this.getCurrentUser().then((user) => {
      this.ready = true;
      this.events.emit('ready');
      user.getGuilds();
      this.getStats();
    }).catch(() => {
      this.ready = true;
      this.events.emit('ready');
    });
  }

  getGuild(guildID) {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then((user) => {
        user.getGuilds().then((guilds) => {
          if (guildID in guilds) {
            resolve(guilds[guildID]);
          } else {
            reject(null);
          }
        });
      });
    });
  }

  getCurrentUser(refresh = false) {
    // If the user is already set, just fire the callback
    if (this.user && !refresh) {
      return new Promise((resolve) => {
        resolve(this.user);
      });
    }

    return new Promise((resolve, reject) => {
      axios.get('/api/users/@me').then((res) => {
        this.user = new User(res.data);
        this.events.emit('user.set', this.user);
        resolve(this.user);
      }).catch((err) => {
        reject();
      });
    });
  }

  getStats(cb) {
    return new Promise((resolve, reject) => {
      axios.get('/api/stats').then((res) => {
        this.stats = res.data;
        resolve(this.stats);
      }).catch((err) => {
        reject();
      })
    })
  }

  getArchive(archiveID) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/archive/${archiveID}.json`).then((res) => {
        resolve(res.data);
      }).catch((err) => {
        reject();
      });
    });
  }

  deploy() {
    return new Promise((resolve) => {
      axios.post('/api/deploy').then((res) => {
        resolve();
      }).catch((err) => {
        reject();
      });
    });
  }

  logout() {
    return new Promise((resolve) => {
      axios.post('/api/auth/logout').then((res) => {
        this.user = null;
        this.events.emit('user.set', this.user);
        resolve();
      });
    });
  }
};

var debug = function(msg) {
    if ("production" !== process.env.NODE_ENV) console.log(msg);
}

var globalState = new State;

export {
    debug, globalState
}
