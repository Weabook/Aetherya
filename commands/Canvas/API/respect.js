const Command = require('../../../structures/Command.js');
const { Attachment } = require('discord.js');

class Respect extends Command {
  constructor(client) {
    super(client, {
      name: 'respect',
      description: 'Pay respects to someone',
      category: 'Canvas',
      usage: 'respect <member:user>',
      extended: 'A command to pay respects to someone, Advanced Warfare style.',
      aliases: ['pressf', 'f', 'rip', 'ripme'],
      botPerms: ['ATTACH_FILES'],
      cooldown: 10
    });
  }

  async run(message, args, level) {
    try {
      this.client.session.requests++;
      await message.channel.send(new Attachment(await this.client.api.respect((message.mentions.users.first() || message.author).displayAvatarURL), 'respect.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Respect;