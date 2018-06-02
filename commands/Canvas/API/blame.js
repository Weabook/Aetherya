const Command = require('../../../structures/Command.js');
const { Attachment } = require('discord.js');

class Blame extends Command {
  constructor(client) {
    super(client, {
      name: 'blame',
      description: 'Blame someone.',
      category: 'Canvas',
      usage: 'blame <member:user>',
      botPerms: ['ATTACH_FILES'],
      cooldown: 10
    });
  }

  async run(message, args, level) { 
    try {
      await message.channel.send(new Attachment(await this.client.api.blame(message.mentions.users.first().displayName)));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Blame;