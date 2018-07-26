const Command = require('../../../structures/Command.js');
const { Attachment } = require('discord.js');

class Sepia extends Command {
  constructor(client) {
    super(client, {
      name: 'sepia',
      description: 'Overlay a sepia filter onto someone\'s avatar.',
      category: 'Canvas',
      usage: 'sepia <member:user>',
      botPerms: ['ATTACH_FILES'],
      cooldown: 10
    });
  }

  async run(message, args, level) {
    try {
      this.client.session.requests++;
      await message.channel.send(new Attachment(await this.client.api.sepia((message.mentions.users.first() || message.author).displayAvatarURL), 'sepia.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Sepia;