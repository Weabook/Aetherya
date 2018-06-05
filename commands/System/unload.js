const Command = require('../../structures/Command.js');

class Unload extends Command {
  constructor(client) {
    super(client, {
      name: 'unload',
      description: 'Loads an unloaded command.',
      category: 'System',
      usage: 'unload <path:string> <command:string>',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, [path, ...command], level) {
    const response = await this.client.unloadCommand(`${process.cwd()}${path}`, command);

    if (response) return message.error(undefined, `Error unloading: ${response}`);

    message.reply(`The command ${command} has been unloaded.`);
  }
}

module.exports = Unload;