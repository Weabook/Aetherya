const Command = require('../../structures/Command.js');

class Pin extends Command {
  constructor(client) {
    super(client, {
      name: 'pin',
      description: 'Pin a message.',
      category: 'Utilities',
      usage: 'pin <message:id>',
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) {
    const msg = await message.channel.fetchMessage(args[0]);
    if (!msg) return message.error(undefined, `${args[0]} is not a valid message ID. Please try again.`);
    await msg.pin();
    return message.error(undefined, 'that message is already pinned.');
  }
}

module.exports = Pin;