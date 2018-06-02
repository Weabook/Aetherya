const { Attachment } = require('discord.js');
const moment = require('moment');
const { yorkAPIKey } = require('../config.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const guild = member.guild;
    const settings = this.client.settings.get(guild.id);

    if (settings.joinEnabled !== 'true') return;

    if (!member || !member.id || !member.guild) return;

    member.guild.fetchInvites().then(guildInvites => {
      const ei = invites[member.guild.id];
      const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
      const inviter = this.client.users.get(invite.inviter.id);

      const channel = guild.channels.find('name', settings.modLogChannel);
      if (!channel) return;
      const fromNow = moment(member.user.createdTimestamp).fromNow();
      const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
      channel.send(`📥 ${member.user.tag} (${member.user.id}) joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation. Created: ${fromNow} ${isNew}`);
      
    });
  }
};