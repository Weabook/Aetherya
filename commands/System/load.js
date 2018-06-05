const Command = require('../../structures/Command.js');

class Load extends Command {
  constructor(client) {
    super(client, {
      name: 'load',
      description: 'Loads an unloaded command.',
      category: 'System',
      usage: 'load <path:string> <command:string>',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, [path, ...command], level) {
    const response = await this.client.loadCommand(`${process.cwd()}${path}`, command);

    if (response) return message.error(undefined, `Error loading: ${response}`);

    message.reply(`The command ${command} has been loaded.`);
  }
}

module.exports = Load;