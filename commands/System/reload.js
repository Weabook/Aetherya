const Command = require('../../structures/Command.js');

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      description: 'Reloads a command that has been modified.',
      category: 'System',
      usage: 'reload [command]',
      permLevel: 'Bot Admin',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, [piece], level) {
    // if (!args || args.size < 1) return message.reply('Must provide a command to reload. Derp.');
    
    // const commands = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
    // if (!commands) return message.reply(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`);
    
    // let response = await this.client.unloadCommand(`${commands.conf.location}`, commands.help.name);
    // if (response) return message.reply(`Error Unloading: ${response}`);
    
    // response = this.client.loadCommand(`${commands.conf.location}`, commands.help.name);
    // if (response) return message.reply(`Error loading: ${response}`);
    
    // message.reply(`The command \`${commands.help.name}\` has been reloaded.`);

    if (!piece || !piece.length) return message.reply('Must provide a piece to reload. Derp.');
    piece = this.resolvePiece(piece);
    if (!piece) return message.reply('That is not a valid piece.');
    try {
      const reloadedPiece = piece.reload();
      return message.channel.send(`I have successfully reloaded the ${piece} piece.`);
    } catch (err) {
      piece.store.set(piece);
      return message.channel.send(`I was unable to reload the ${piece} piece`);
    }
  }

  resolvePiece(arg) {
    const isCommand = this.client.commands.get(arg);
    if (isCommand) return isCommand;
    const isEvent = this.client.events.get(arg);
    if (isEvent) return isEvent;
    return false;
  }
}
module.exports = Reload;