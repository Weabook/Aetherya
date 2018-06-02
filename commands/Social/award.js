const Social = require('../../structures/Social.js');

class Award extends Social {
  constructor(client) {
    super(client, {
      name: 'award',
      description: 'Gives a nominated user points.',
      usage: 'award <member:user> <amount:integer>',
      category:'Moderation',
      extended: 'This will give points to a nominated user.',
      hidden: true,
      aliases: ['reward', 'give'],
      botPerms: [],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { 
    try {
      
      const user = await this.verifyCommandUser(args[0]);
      if (isNaN(args[1])) return message.error(undefined, 'You must supply a valid amount of points to award the user.');
      if (args[1] < 0) return message.error(undefined, 'You cannot award someone less than 0 points. Try the `deduct` command.');
      if (message.author.id === user) return message.error(undefined, 'You cannot award points to yourself.');
      await this.cmdRew(message, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Award;