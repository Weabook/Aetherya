const { RichEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(oldMessage, newMessage) {
    const message = oldMessage;
    const settings = this.client.settings.get(message.guild.id);

    if (settings.editEnabled !== 'true') return;

    if (message.author.bot) {
      return false;
    }
    
    if (!message.guild) {
      return false;
    }
    
    if (message.content == newMessage.content) {
      return false;
    }

    if (!message || !message.id || !message.content || !message.guild) return;
    const channel = message.guild.channels.find('name', settings.modLogChannel);
    if (!channel) return;
    channel.send(`\`[${moment(new Date()).format('h:mm:ss')}]\` 📝 ${message.author.tag} (\`${message.author.id}\`) Message Edited in **#${message.channel.name}**:\n**B**: ${message.cleanContent}\n**A**: ${newMessage.cleanContent}`);
  }
};