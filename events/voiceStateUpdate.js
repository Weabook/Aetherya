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

    if (!settings.memberUpdate !== 'true') return;

    if (newMember.voiceChannel !== oldMember.voiceChannel) {
      if (settings.compactEvents !== 'true') {
        const voiceChan = newMember.guild.channels.get(newMember.voiceChannelID);
        const oldChan = oldMember.guild.channels.get(oldMember.voiceChannelID);
        if (!voiceChan) return await channel.send(`\`[${moment(new Date()).format('h:mm:ss')}]\` ${oldMember.displayName} left voice channel \`${oldChan.name}\``);
        await channel.send(`\`[${moment(new Date()).format('h:mm:ss')}]\` ${newMember.displayName} joined voice channel \`${voiceChan.name}\``);
      } else {
        const voiceChan = newMember.guild.channels.get(newMember.voiceChannelID);
        const oldChan = oldMember.guild.channels.get(oldMember.voiceChannelID);
        if (!voiceChan) {
          const embed = new RichEmbed()
            .setTitle('User Left Voice Channel')
            .setAuthor(newMember.displayName, newMember.user. displayAvatarURL)
            .addField('User', `<@${newMember.user.id}> | ${newMember.user.tag}`)
            .addField('Old Voice Channel', oldChan.name, true);
          await channel.send({ embed });
        } 
        if (!oldChan) {
          const embed = new RichEmbed()
            .setTitle('User Joined Voice Channel')
            .setAuthor(newMember.displayName, newMember.user. displayAvatarURL)
            .addField('User', `<@${newMember.user.id}> | ${newMember.user.tag}`)
            .addField('New Voice Channel', newChan.name, true);
          await channel.send({ embed });
        } else {
          const embed = new RichEmbed()
            .setTitle('User Changed Voice Channel')
            .setAuthor(newMember.displayName, newMember.user. displayAvatarURL)
            .addField('User', `<@${newMember.user.id}> | ${newMember.user.tag}`)
            .addField('Old Voice Channel', oldChan.name, true)
            .addField('New Voice Channel', newChan.name, true);
          await channel.send({ embed });
        }
      }
    }
  }
};