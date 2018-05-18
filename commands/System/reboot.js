const Command = require('../base/Command.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);


class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      description: 'Restart the bot.',
      category: 'System',
      usage: 'reboot',
      aliases: [],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.reply('Bot is shutting down.');
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      await exec('docker restart aetherya_bot_1');
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;