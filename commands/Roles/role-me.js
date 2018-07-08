const Command = require('../../structures/Command.js');

class RoleMe extends Command {
  constructor(client) {
    super(client, {
      name: 'role-me',
      description: 'Add a role to yourself from the self-assignable list.',
      category: 'Roles',
      usage: 'role-me <role:string>',
      aliases: ['roleme'],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, [...role], level) {
    const roleList = ['Felic\'s Stream', 'Lady\'s Stream', 'aria\'s Stream', 'Bananakin\'s Stream', 'Rashaun\'s Stream', 'Updates', 'Shoutouts'];
    if (!roleList.includes(role.join(' '))) return message.error(undefined, `${role.join(' ')} is not selfassignable. You can view the list of roles you can assign to youself with \`>role-list\``);
    const toAdd = await message.guild.roles.find('name', role);
    await message.member.addRole(toAdd);
    await message.channel.send(`You've been given the ${role.join(' ')} role.`);
  }
}

module.exports = RoleMe;