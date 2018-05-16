const Social = require('../../structures/Command.js');
const { Attachment } = require('discord.js');

class Bobross extends Social {
  constructor(client) {
    super(client, {
      name: 'bobross',
      description: 'Paint a happy little accident.',
      category: 'Canvas',
      usage: 'bobross <member:user>',
      botPerms: ['ATTACH_FILES'],
      cooldown: 10
    });
  }

  async run(message, args, level) { 
    try {
      await message.channel.send(new Attachment(await this.client.api.bobRoss(message.mentions.users.first().displayAvatarURL)));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Bobross;