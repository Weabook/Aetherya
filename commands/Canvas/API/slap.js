const Social = require('../../../structures/Social.js');
const { Attachment } = require('discord.js');

class Slap extends Social {
  constructor(client) {
    super(client, {
      name: 'slap',
      description: 'Slap another user as Batman.',
      category: 'Fun',
      usage: 'slap <@mention>',
      extended: 'Mention another user to slap them.',
      botPerms: ['ATTACH_FILES']
    });
  }
  async run(message, args, level) {
    await message.channel.send(new Attachment(await this.client.api.batSlap(message.author.displayAvatarURL, message.mentions.users.first().displayAvatarURL), 'slapped.png'));
  }
}

module.exports = Slap;