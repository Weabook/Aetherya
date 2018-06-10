const Command = require('../../structures/Command.js');

class Bananakin extends Command {
  constructor(client) {
    super(client, {
      name: 'bananakin',
      description: 'Get some information on one of our broadcasters, Bananakin.',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const twitch = this.client.emojis.get('455064742935920640');
    const discord = this.client.emojis.get('455064839606370316');

    message.channel.send(`**Background**\n\nBananakin streams a combination of retro and recent games. He is based in the US and is a huge fan of Nintendo and Capcom, so don't be surprised to see him play something from their franchises. Games he's streamed previously include Mega Man, Monster Hunter, and Pokémon.\n\n${twitch} **»** <https://www.twitch.tv/bananakin_skywalker>\n${discord} **»** <https://discordapp.com/invite/ufurpCD>`);
  }
}

module.exports = Bananakin;