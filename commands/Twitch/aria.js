const Command = require('../../structures/Command.js');

class Aria extends Command {
  constructor(client) {
    super(client, {
      name: 'aria',
      permLevel: 'Family'
    });
  }

  async run(message, args, level) {
    const { streamChannel } = this.client.settings.get(message.guild.id);
    const desc = args.join(' ');

    const channel = message.guild.channels.find('name', streamChannel);
    if (!channel) return message.error(undefined, `I cannot find the \`${channel}\` channel.`);

    const role = message.guild.roles.find('name', 'aria\'s Stream');
    if (!role) return message.error(undefined, `I cannot find the \`${role}\` role.`);
    if (role.mentionable === false) await role.edit({ mentionable: true });

    await channel.send(`⸤ ${role} ⸣ ${desc}\nYou can tune in at https://www.twitch.tv/ariahane\n\nIf you would like to un-/assign this role, head on over to #bot_channel and do \`_selfassign aria\'s Stream\``);

    await role.edit({ mentionable: false });
  }
}

module.exports = Aria;