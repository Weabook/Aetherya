const Command = require('../../structures/Command.js');

class Joey extends Command {
  constructor(client) {
    super(client, {
      name: 'joey',
      description: 'Get some information on one of our broadcasters, Joey.',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const twitch = this.client.emojis.get('455064742935920640');
    const twitter = this.client.emojis.get('455064792168660992');
    const instagram = this.client.emojis.get('455064814990131210');
    const discord = this.client.emojis.get('455064839606370316');
    const youtube = this.client.emojis.get('455064867292839936');

    message.channel.send(`**Background**\n\nJoey is a content creator from the US. He mainly creates videos on YouTube but isn\'t shy to stream occasionally. Streams include Minecraft and Super Mario World speed runs, and sometimes show off his artistic talents. Joey is also the biggest Nintendo fan.\n\n${twitch} **»** <https://www.twitch.tv/goldmanjh>\n${youtube} **»** <https://www.youtube.com/channel/UCslEBSxIeTLx2yjsf-gopPw>\n${discord} **»** https://discordapp.com/invite/gy9sfkt`);
  }
}

module.exports = Joey;