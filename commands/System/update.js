const Command = require('../../structures/Command.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

class Update extends Command {
  constructor(client) {
    super(client, {
      name: 'update',
      description: 'This updates the bot from its git repo.',
      usage: 'update',
      category: 'System',
      extended: 'This command is designed to update the bot from it\'s own repository, then reboots the bot for the changes to take effect.',
      aliases: ['git', 'pull'],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    const branch = args[0];
    const action = args[1];
    const { stdout, stderr, err } = await exec(`git pull origin ${branch}`).catch(err => ({ err }));
    if (err) return console.error(err);
    const out = [];
    if (stdout) out.push(stdout);
    if (stderr) out.push(stderr);
    await message.channel.send(out.join('---\n'), { code: 'prolog' });
    if (!stdout.toString().includes('Already up-to-date.') && (action === '-restart' || action === '-r')) {
      this.client.commands.get('reboot').run(message, args, level);
    }
  }
}

module.exports = Update;