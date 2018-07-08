const { Attachment } = require('discord.js');
const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    this.client.user.setActivity(`for ${this.client.users.size} astronauts`, { url: 'https://www.twitch.tv/aetherya_', type: 'STREAMING'});
    
    const guild = member.guild;
    const settings = this.client.settings.get(guild.id);

    if (settings.joinEnabled !== 'true') return;

    if (!member || !member.id || !member.guild) return;

    const channel = guild.channels.find('name', settings.memberLogs);
    if (!channel) return;
    const fromNow = moment(member.user.createdTimestamp).fromNow();
    const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
    channel.send(`📥 ${member.user.tag} (${member.user.id}) joined. Created: ${fromNow} ${isNew}`);
  }
};