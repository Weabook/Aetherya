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
    const roleList = this.client.rolelist.get(message.guild.id);

    if (roleList[role]) {
      const add = await message.guild.roles.find('name', role);
      const member = await message.guild.fetchMember(message.author.id);
      member.addRole(add);
      await message.channel.send(`Added ${role}.`);
    } else {
      return message.channel.send(`${role} is not on the self-assignable list. You can view it by running \`>role-list\`.`);
    }
  }
}

module.exports = RoleMe;