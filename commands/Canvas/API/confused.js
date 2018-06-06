const Command = require('../../../structures/Command.js');
const { Attachment } = require('discord.js');

class Confused extends Command {
  constructor(client) {
    super(client, {
      name: 'confused',
      description: 'Show how confused you are.',
      category: 'Canvas',
      usage: 'confused [member:user]',
      botPerms: ['ATTACH_FILES'],
      cooldown: 10
    });
  }

  async run(message, args, level) {
    try {
      await message.channel.send(new Attachment(await this.client.api.confused(message.author.displayAvatarURL, message.guild.members.random().user.displayAvatarURL), 'confused.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Confused;