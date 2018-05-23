const Social = require('../../structures/Social.js');

class Pay extends Social {
  constructor(client) {
    super(client, {
      name: 'pay',
      description: 'Pay another user your activity points.',
      usage: 'pay<member:user> <amount:integer>',
      category: 'Command',
      cost: 0,
      aliases: ['loan', 'donate'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { 
    try {
      const user = await this.verifyCommandUser(args[0]);
      if (isNaN(args[1])) return message.error(undefined, 'You must supply a valid amount of points to pay the user.');
      if (args[1] < 0) return message.error(undefined, 'You cannot pay someone less than 0 points.');
      if (message.author.id === user) return message.error(undefined, 'You cannot pay yourself.');

      await this.usrPay(message, message.author.id, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pay;