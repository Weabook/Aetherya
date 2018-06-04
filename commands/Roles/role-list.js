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
    const roleList = ['Felic\'s Stream', 'Lady\'s Stream', 'aria\'s Stream', 'v i e w e r s', 'Bananakin\'s Stream', 'Rashaun\'s Stream', 'Updates', 'Shoutouts'];

    message.channel.send(`= Roles = \n${roleList.join('\n')}`, { code: 'asciidoc' });
  }
}

module.exports = RoleList;