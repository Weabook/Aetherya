const moment = require('moment');
const { RichEmbed } = require('discord.js');


module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(oldMember, newMember) {
    const settings = this.client.settings.get(newMember.guild.id);
    const channel = newMember.guild.channels.find('name', settings.memberLogs);
    if (!channel) return;

    if (settings.memberUpdate !== 'true') return;


    if (newMember.displayName !== oldMember.displayName) {
      if (settings.compactEvents == 'true') {
        await channel.send(`\`[${moment(new Date()).format('h:mm:ss')}]\` ${newMember.user.username} (${newMember.user.id}) changed their nickname.\nPrevious Nick: \`${oldMember.displayName}\` | New Nick: \`${newMember.displayName}\``);
      } else {
        const embed = new RichEmbed()
          .setTitle('Member Update')
          .setAuthor(newMember.displayName, newMember.user. displayAvatarURL)
          .addField('User', `<@${newMember.user.id}> | ${newMember.user.tag}`)
          .addField('Previous Nick:', oldMember.displayName, true)
          .addField('New Nick', newMember.displayName, true)
          .setTimestamp()
          .setFooter(`User ID: ${newMember.user.id}`);
        await channel.send({ embed });
      }
    }
  }
};