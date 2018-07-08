const Command = require('../../structures/Command.js');
const { RichEmbed } = require('discord.js');
const { get } = require('snekfetch');

const { version } = require('../../package.json');

class Kpop extends Command {
  constructor(client) {
    super(client, {
      name: 'kpop',
      description: 'Get a random picture of a kpop idol.',
      category: 'API',
      usage: 'kpop -yezi',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    const { body } = await get('http://localhost:3000/api/kpop/yezi')
      .set('Authorization', process.env.LAPI)
      .set('User-Agent',  `Aetherya/${version}/${this.client.user.id === '401773423308832778' ? 'Production' : 'Development'}`);
    
    await message.channel.send({
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

module.exports = Kpop;