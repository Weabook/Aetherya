const { Attachment } = require('discord.js');
const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const guild = member.guild;
    const settings = this.client.settings.get(guild.id);

    const roles = ['Felic\'s Stream', 'Lady\'s Stream', 'aria\'s Stream', 'v i e w e r s', 'Bananakin\'s Stream', 'Rashaun\'s Stream', 'Updates', 'Shoutouts'];

    roles.forEach(async role => {
      const add = await guild.roles.find('name', role);
      await member.addRole(add.id);
    });

    if (settings.joinEnabled !== 'true') return;

    if (!member || !member.id || !member.guild) return;

    const channel = guild.channels.find('name', settings.memberLogs);
    if (!channel) return;
    const fromNow = moment(member.user.createdTimestamp).fromNow();
    const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
    channel.send(`📥 ${member.user.tag} (${member.user.id}) joined. Created: ${fromNow} ${isNew}`);
  }
};