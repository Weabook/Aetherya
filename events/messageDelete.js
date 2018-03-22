const moment = require('moment');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    const settings = this.client.settings.get(message.guild.id);

    if (settings.deleteEnabled !== 'true') return;

    if (!message || !message.id || !message.content || !message.guild) return;
    const channel = message.guild.channels.find('name', settings.modLogChannel);
    if (!channel) return;
    channel.send(`\`[${moment(new Date()).format('h:mm:ss')}]\` 🗑 ${message.author.tag} (\`${message.author.id}\`) Message Deleted in **#${message.channel.name}**:\n${message.cleanContent}`);
  }
};