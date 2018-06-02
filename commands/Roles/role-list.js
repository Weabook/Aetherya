const Command = require('../../structures/Command.js');

class RoleList extends Command {
  constructor(client) {
    super(client, {
      name: 'role-list',
      description: 'Lists the self-assignable list.',
      category: 'Roles',
      usage: 'role-list',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const roleList = this.client.rolelist.get(message.guild.id);

    message.channel.send(`= Roles = \n${roleList}`, { code: 'asciidoc' });
  }
}

module.exports = RoleList;