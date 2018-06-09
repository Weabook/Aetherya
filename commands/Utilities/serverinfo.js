const Command = require('../../structures/Command.js');
const { RichEmbed } = require('discord.js');

class ServerInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      description: 'Displays server information & statistics.',
      usage: 'serverinfo',
      category: 'Utilities',
      extended: 'This command will return an organised embed with server information and statistics.',
      guildOnly: true,
      aliases: ['serverstats', 'guildinfo', 'guildstats'],
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) {
    const online = message.guild.presences.filter(p => p.status === 'online').size;
    const idle = message.guild.presences.filter(p => p.status === 'idle').size;
    const dnd = message.guild.presences.filter(p => p.status === 'dnd').size;
    const offline = message.guild.presences.filter(p => p.status === 'offline').size;
    
    const verifLevels = ['None', 'Low', 'Medium', 'Tableflip', 'Double Tableflip'];
    const region = {
      'brazil': 'Brazil',
      'eu-central': 'Central Europe',
      'singapore': 'Singapore',
      'us-central': 'U.S. Central',
      'sydney': 'Sydney',
      'us-east': 'U.S. East',
      'us-south': 'U.S. South',
      'us-west': 'U.S. West',
      'eu-west': 'Western Europe',
      'vip-us-east': 'VIP U.S. East',
      'london': 'London',
      'amsterdam': 'Amsterdam',
      'hongkong': 'Hong Kong'
    };

    const oe = '315304490267836416';
    const ae = '315304489521250305';
    const de = '315304489634627584';
    const ie = '315304490162978816';


    const embed = new RichEmbed()
      .setAuthor(`${message.guild.name} (${message.guild.id})`, message.guild.iconURL)
      .setColor('RANDOM')
      .setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
      .addField('Created', `${message.guild.createdAt.toString().substr(0, 15)}, ${this.checkDays(message.guild.createdAt)}`, true)
      // .addField('Guild ID', message.guild.id, true)
      .addField('Location', region[message.guild.region], true)
      .addField('Member Count', `${message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size} members | ${message.guild.members.filter(m => m.user.bot).size} bots`, true)
      .addField('Channels', message.guild.channels.size, true)
      .addField('Verification Level', verifLevels[message.guild.verificationLevel], true)
      .addField('\t\tUsers', `${online} <:online:${oe}> ${idle} <:idle:${ae}> ${dnd} <:dnd:${de}> ${offline} <:offline:${ie}>`, true)
      .setTimestamp()
      .setFooter(this.client.user.username, this.client.user.avatarURL);
    message.channel.send({embed}).catch(e => console.error(e));
  }

  checkDays(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    return days + (days == 1 ? ' day' : ' days') + ' ago';
  }
}

module.exports = ServerInfo;