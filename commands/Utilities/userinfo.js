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
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) {
    const member = message.mentions.members.first() || message.guild.member(args[0]) || message.member;
    
    const embed = new RichEmbed()
      .addField('Username', `${member.user.tag}`, true)
      .addField('ID', `${member.user.id}`, true)
      .setColor(3447003)
      .setThumbnail(`${member.user.avatarURL}`)
      .setURL(`${member.user.avatarURL}`)
      .addField('Currently', `${member.presence.status.toProperCase()}`, true)
      .addField('Game', `${member.presence.game === null ? 'No Game' : member.presence.game.name}`, true)
      .addField('Joined Discord', `${moment(member.user.createdAt).format('MM.DD.YY')}`, true)
      .addField('Joined Server', `${moment(member.user.joinedAt).format('MM.DD.YY')}`, true)
      .addField('Roles', `${member.roles.filter(r => r.name).size}`, true)
      .addField('Is Bot', `${member.user.bot.toString().toProperCase()}`, true)
      .setTimestamp()
      .setFooter('');

    message.channel.send({ embed });
  }
}

module.exports = UserInfo;