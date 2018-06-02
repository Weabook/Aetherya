const Social = require('../../structures/Social.js');

class Deduct extends Social {
  constructor(client) {
    super(client, {
      name: 'deduct',
      description: 'Takes points away from the nominated user.',
      usage: 'deduct <member:user> <amount:integer>',
      category:'Moderation',
      extended: 'This will take points away from a nominated user.',
      hidden: true,
      aliases: ['punish', 'take'],
      botPerms: [],
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { 
    try {      
      const user = await this.verifyCommandUser(args[0]);
      if (isNaN(args[1])) return message.error(undefined, 'You must supply a valid amount of points to deduct from the user.');
      if (args[1] < 0) return message.error(undefined, 'You cannot deductless than 0 points from someone.');
      if (message.author.id === user) return message.error(undefined, 'You cannot deduct points from yourself.');
      await this.cmdPun(message, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Deduct;