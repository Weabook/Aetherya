// Declare the bot variable to use to get the version.
const bot = require('../package.json');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    // Wait 1 second to allow for the settings to load.
    await this.client.wait(1000);

    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    // Delete Clyde from the bot's user cache.
    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }

    require('../util/dashboard.js')(this.client);

    // Log the build. For debugging purposes.
    const build = await this.client.build(this.client, '436717873734483978');
    this.client.log('Log', `Built client, on build ${build}.`, 'Built');

    // Log that the bot has logged in.
    this.client.log('Log', `${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers on version ${bot.version}.`, 'Ready!');

    // Filter through the guilds to see if a guild was added while the bot was offline.
    // If so, create the guilds settings.
    this.client.guilds.filter(g => !this.client.settings.has(g.id)).forEach(g => this.client.settings.set(g.id, this.client.config.defaultSettings));

    this.client.guilds.filter(g => !this.client.rolelist.has(g.id)).forEach(g => this.client.rolelist.set(g.id, this.client.config.giveRoles));
    
    this.client.user.setActivity(`for ${this.client.users.size} astronauts`, { url: 'https://www.twitch.tv/aetherya_', type: 'STREAMING'});

    setInterval(() => {
      const toRemind = this.client.reminders.filter(r => r.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      }); 
    }, 60000);

    // setInterval(() => {
    //   const g = this.client.guilds.get('186004000963952640');
    //   const rm = g.presences.filter(p => p.game !== null && p.game.url !== null && p.game.url == 'https://www.twitch.tv/felixinfintum' || p.game.url == 'https://www.twitch.tv/goldmanjh' || p.game.url == 'https://www.twitch.tv/reshayshay' || p.game.url == 'https://www.twitch.tv/ariahane' || p.game.url == 'https://www.twitch.tv/aetherya_' && console.log(p));
    //   // console.log(rm);
    //   // if (rm) {
    //   // console.log('Works 1');
    //   // const m = console.log(rm);
    //   // }
    // }, 1500);
  }
};