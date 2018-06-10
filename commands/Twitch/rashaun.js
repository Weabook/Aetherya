const Command = require('../../structures/Command.js');

class Rashaun extends Command {
  constructor(client) {
    super(client, {
      name: 'rashaun',
      description: 'Get some information on one of our broadcasters, Rashaun.',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const twitch = this.client.emojis.get('455064742935920640');
    const twitter = this.client.emojis.get('455064792168660992');
    const instagram = this.client.emojis.get('455064814990131210');
    const discord = this.client.emojis.get('455064839606370316');
    const youtube = this.client.emojis.get('455064867292839936');

    message.channel.send(`**Background**\n\nRashaun lives in the US and streams whatever interests him. Usually he likes to play first person shooters like Borderlands 2 and Far Cry, but also found his joy in the Battle Royale hit of Fortnite. Other games include Skyrim, GTA, and Dishonored.\n\n${twitch} **»** <https://www.twitch.tv/reshayshay>\n${twitter} **»** <https://twitter.com/Reshayshay1>\n${instagram} **»** <https://www.instagram.com/reshayshay>\n${discord} **»** https://discordapp.com/invite/ggFrzgu`);
  }
}

module.exports = Rashaun;