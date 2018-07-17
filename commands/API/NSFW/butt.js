const Command = require('../../../structures/Command.js');
const { RichEmbed } = require('discord.js');
const { get } = require('snekfetch');

const { version } = require('../../../package.json');

class Butt extends Command {
  constructor(client) {
    super(client, {
      name: 'butt',
      description: 'Get a random picture of a butt.',
      category: 'NSFW',
      usage: 'butt',
      hidden: true,
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    if (!message.channel.nsfw) return message.error('🔞', 'cannot display NSFW content in an SFW channel.');

    const { body } = await get('http://localhost:3000/api/nsfw/butt')
      .set('Authorization', process.env.LAPI)
      .set('User-Agent',  `Aetherya/${version}/${this.client.user.id === '401773423308832778' ? 'Production' : 'Development'}`);
    
    await this.client.users.get('186002153066725378').send({
      embed: {
        'title': 'Click here if the image failed to load.',
        'url': body.url,
        'color': 6192321,
        'image': {
          'url': body.url
        }
      }
    });
  }
}

module.exports = Butt;