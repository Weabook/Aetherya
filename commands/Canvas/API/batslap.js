const Command = require('../../../structures/Command.js');
const { Attachment } = require('discord.js');

class Batslap extends Command {
  constructor(client) {
    super(client, {
      name: 'batslap',
      description: 'Slap someone, Batman style.',
      category: 'Canvas',
      usage: 'batslap <member:user>',
      botPerms: ['ATTACH_FILES'],
      cooldown: 10
    });
  }

  async run(message, args, level) {
    const slapper = message.author;
    const slapped = message.mentions.users.first(); 
    try {
      this.client.session.requests++;
      await message.channel.send(new Attachment(await this.client.api.batSlap(slapper.displayAvatarURL, slapped.displayAvatarURL), 'batman.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Batslap;