const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    let str = '';
    const guild = member.guild;
    const settings = this.client.settings.get(guild.id);

    if (settings.joinEnabled !== 'true') return;

    if (!member || !member.id || !member.guild) return;

    const channel = guild.channels.find('name', settings.memberLogs);
    if (!channel) return;
    for (let i = 0; i < member._roles.size; i++) {
      const role = guild.roles.get(member._roles[i]);
      str += role.name;
    }
    
    const fromNow = moment(member.joinedTimestamp).fromNow();

    channel.send(`\`[${moment(new Date()).format('h:mm:ss')}]\` 📤 ${member.user.tag} (${member.user.id}) left\nThey had joined: ${fromNow}`);
  }
};