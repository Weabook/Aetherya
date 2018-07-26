const Command = require('../../../structures/Command.js');
const { Attachment } = require('discord.js');

class Thesearch extends Command {
  constructor(client) {
    super(client, {
      name: 'thesearch',
      description: 'Searches the universe..',
      category: 'Canvas',
      usage: 'thesearch [member:user] <text:string>',
      botPerms: ['ATTACH_FILES'],
      cooldown: 10
    });
  }

  async run(message, args, level) {
    if (message.mentions.users.size === 0) {
      const text = args.join(' ');
      if (text.length < 1) return message.channel.send('You must supply something for the guy to say.');
      try {
        this.client.session.requests++;
        await message.channel.send(new Attachment(await this.client.api.theSearch((message.mentions.users.first() || message.author).displayAvatarURL, text), 'achievement.png'));
      } catch (error) {
        throw error;
      }
    } else {
      const text = args.slice(1).join(' ');
      if (text.length < 1) return message.channel.send('You must supply something for the guy to say.');
      try {
        this.client.session.requests++;
        await message.channel.send(new Attachment(await this.client.api.theSearch((message.mentions.users.first() || message.author).displayAvatarURL, text), 'achievement.png'));
      } catch (error) {
        throw error;
      }
    }
  }
}

module.exports = Thesearch;