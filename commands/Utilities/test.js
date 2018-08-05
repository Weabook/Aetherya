const Command = require('../../structures/Command.js');
const { RichEmbed } = require('discord.js');
const { get } = require('chainfetch');

// const { version } = require('../../package.json');

class Test extends Command {
  constructor(client) {
    super(client, {
      name: 'test',
      description: 'Test shit.',
      category: 'API',
      usage: 'test',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    const { body } = await get('https://jokes-api.glitch.me/api/jokes/dad')
      .set('Authorization', '2de3f21fcb');
      // .set('User-Agent',  `Aetherya/${version}/${this.client.user.id === '401773423308832778' ? 'Production' : 'Development'}`);
    
    // await message.channel.send({
    //   embed: {
    //     'title': 'Click here if the image failed to load.',
    //     'url': body.url,
    //     'color': 6192321,
    //     'image': {
    //       'url': body.url
    //     }
    //   }
    // });
    await message.channel.send(body.joke);
  }
}

module.exports = Test;