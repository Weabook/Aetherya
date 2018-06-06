const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const guild = member.guild;
    const settings = this.client.settings.get(guild.id);

    if (settings.joinEnabled !== 'true') return;

    if (!member || !member.id || !member.guild) return;

    const channel = guild.channels.find('name', settings.memberLogs);
    if (!channel) return;
    const fromNow = moment(member.joinedTimestamp).fromNow();
    channel.send(`📤 ${member.user.tag} (${member.user.id}) left, they had joined: ${fromNow}`);
  }
};