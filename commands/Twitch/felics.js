const Command = require('../../structures/Command.js');

class Felics extends Command {
  constructor(client) {
    super(client, {
      name: 'felics',
      description: 'Get some information on one of our broadcasters, Felics.',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const twitch = this.client.emojis.get('455064742935920640');
    const twitter = this.client.emojis.get('455064792168660992');
    const instagram = this.client.emojis.get('455064814990131210');
    const discord = this.client.emojis.get('455064839606370316');
    const youtube = this.client.emojis.get('455064867292839936');

    message.channel.send(`**Background**\n\nFelics is a streamer from the Netherlands who streams a variety of games from a wide spectrum of genres. He likes to try out new games, and is open to suggestions. Games previously streamed include Fallout 4, Subnautica, and Rimworld.\n\n${twitch} **»** <https://www.twitch.tv/felixinfintum>\n${youtube} **»** <https://www.youtube.com/channel/UCiLY3M9Yu9LXXzDbolqpAiA>\n${twitter} **»** <https://twitter.com/FelixInfintum>\n📄 **»** <https://felixinfintum.wordpress.com/>`);
  }
}

module.exports = Felics;