const Command = require('../../structures/Command.js');
const moment = require('moment');
const { RichEmbed } = require('discord.js');

class UserInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      description: 'Get info about a certain user',
      user: 'user <user:mention>',
      aliases: ['user'],
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const embed = new RichEmbed()
      .addField('Username', `${msg.author.tag}`, true)
      .addField('ID', `${msg.author.id}`, true)
      .setColor(3447003)
      .setThumbnail(`${msg.author.avatarURL}`)
      .setURL(`${msg.author.avatarURL}`)
      .addField('Currently', `${msg.author.presence.status.toUpperCase()}`, true)
      .addField('Game', `${msg.author.presence.game === null ? 'No Game' : msg.author.presence.game.name}`, true)
      .addField('Joined Discord', `${moment(msg.author.createdAt).format('MM.DD.YY')}`, true)
      .addField('Joined Server', `${moment(msg.member.joinedAt).format('MM.DD.YY')}`, true)
      .addField('Roles', `${msg.member.roles.filter(r => r.name).size}`, true)
      .addField('Is Bot', `${msg.author.bot.toString().toUpperCase()}`, true)
      .setTimestamp()
      .setFooter('');
  }
}

module.exports = UserInfo;