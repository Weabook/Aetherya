const Command = require('../../structures/Command.js');

class RoleAdd extends Command {
  constructor(client) {
    super(client, {
      name: 'role-add',
      description: 'Add a role to the self-assignable list.',
      category: 'Roles',
      usage: 'role-add <role:string>',
      permLevel: 'Administrator'
    });
  }

  async run(message, args, level) {
    const roleList = this.client.rolelist.get(message.guild.id);

    const role = args[0];
    
    console.log(role);

    roleList.push(role);
    this.client.rolelist.set(message.guild.id, roleList);
    message.channel.send(`Added ${role} to the self-assignable list.`);
  }
}

module.exports = RoleAdd;