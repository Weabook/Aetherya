const Command = require('../../structures/Command.js');

class RoleMe extends Command {
  constructor(client) {
    super(client, {
      name: 'role-me',
      description: 'Add a role to yourself from the self-assignable list.',
      category: 'Roles',
      usage: 'role-me <role:string>',
      permLevel: 'User'
    });
  }

  async run(message, [...role], level) {
    const roleList = ['Felic\'s Stream', 'Lady\'s Stream', 'aria\'s Stream', 'v i e w e r s', 'Bananakin\'s Stream', 'Rashaun\'s Stream', 'Updates', 'Shoutouts'];
    if (!roleList.includes(role)) return message.error(undefined, `${role} is not selfassignable. You can view the list of roles you can assign to youself with \`>role-list\``);
    await message.member.addRole(role);
    await message.channel.send(`You've been given the ${role} role.`);
  }
}

module.exports = RoleMe;