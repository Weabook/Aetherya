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
      this.client.session.requests++;
      const user = await message.guild.fetchMember(message.mentions.users.first());
      await message.channel.send(new Attachment(await this.client.api.blame(user.displayName), 'blame.png'));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Blame;