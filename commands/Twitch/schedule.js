const Command = require('../../structures/Command.js');

class Schedule extends Command {
  constructor(client) {
    super(client, {
      name: 'schedule',
      description: 'Get info about our family members.'
    });
  }

  async run(message, args, level) {
    const twitch = this.client.emojis.get('455064742935920640');
    const discord = this.client.emojis.get('455064839606370316');
    const twitter = this.client.emojis.get('455064792168660992');
    const youtube = this.client.emojis.get('455064867292839936');
    const instagram = this.client.emojis.get('455064814990131210');

    message.channel.send(`**Background**\n\nBananakin streams a combination of retro and recent games. He is based in the US and is a huge fan of Nintendo and Capcom, so don't be surprised to see him play something from their franchises. Games he's streamed previously include Mega Man, Monster Hunter, and Pokémon.\n\n${twitch} **»** <https://www.twitch.tv/bananakin_skywalker>\n${discord} **»** <https://discordapp.com/invite/ufurpCD>\u200b\n**Background**\n\nFelics is a streamer from the Netherlands who streams a variety of games from a wide spectrum of genres. He likes to try out new games, and is open to suggestions. Games previously streamed include Fallout 4, Subnautica, and Rimworld.\n\n${twitch} **»** <https://www.twitch.tv/felixinfintum>\n${youtube} **»** <https://www.youtube.com/channel/UCiLY3M9Yu9LXXzDbolqpAiA>\n${twitter} **»** <https://twitter.com/FelixInfintum>\n📄 **»** <https://felixinfintum.wordpress.com/>\u200b\n**Background**\n\nJoey is a content creator from the US. He mainly creates videos on YouTube but isn\'t shy to stream occasionally. Streams include Minecraft and Super Mario World speed runs, and sometimes show off his artistic talents. Joey is also the biggest Nintendo fan.\n\n${twitch} **»** <https://www.twitch.tv/goldmanjh>\n${youtube} **»** <https://www.youtube.com/channel/UCslEBSxIeTLx2yjsf-gopPw>\n${discord} **»** <https://discordapp.com/invite/gy9sfkt>\u200b\n**Background**\n\nRashaun lives in the US and streams whatever interests him. Usually he likes to play first person shooters like Borderlands 2 and Far Cry, but also found his joy in the Battle Royale hit of Fortnite. Other games include Skyrim, GTA, and Dishonored.\n\n${twitch} **»** <https://www.twitch.tv/reshayshay>\n${twitter} **»** <https://twitter.com/Reshayshay1>\n${instagram} **»** <https://www.instagram.com/reshayshay>\n${discord} **»** <https://discordapp.com/invite/ggFrzgu>`, { split: { char: '\u200b' }});
  }
}

module.exports = Schedule;