const timeout = new Map();
function giveRandomPoints(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = class {

  static run(client, message, level) {
    this.givePoints(client, message, level);
    this.antiInvite(client, message, level);
    this.checkLevel(client, message, level);
  }

  static givePoints(client, message, level) {
    if (message.channel.type !== 'text') return;
    if (message.author.bot) return;
    const settings = client.settings.get(message.guild.id);
    if (message.content.startsWith(settings.prefix)) return;
    const score = client.points.get(`${message.guild.id}-${message.author.id}`) || { points: 200, level: 1, user: message.author.id, guild: message.guild.id, daily: 1504120109 };
    const timedOut = timeout.get(`${message.guild.id}-${message.author.id}`);
    if (timedOut) return;
    timeout.set(`${message.guild.id}-${message.author.id}`, true);
    const points = giveRandomPoints(parseInt(settings.minPoints), parseInt(settings.maxPoints));
    setTimeout(() => {
      timeout.set(`${message.guild.id}-${message.author.id}`, false);
    }, parseInt(settings.scoreTime) * 60 * 1000);

    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      if (settings.levelNotice === 'true')
        message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
      score.level = curLevel;
    }
    score.points += points;
    client.points.set(`${message.guild.id}-${message.author.id}`, score);
  }

  static antiInvite(client, message, level) {
    if (message.channel.type !== 'text') return;
    if (level > 0) return;
    
    const whitelist = [
      'discord.gg/discord-testers',
      'discordapp.com/invite/discord-testers',
      'discord.gg/discord-feedback',
      'discordapp.com/invite/discord-feedback',
      'discord.gg/discord-api',
      'discordapp.com/invite/discord-api',
      'discord.gg/discord-linux',
      'discordapp.com/invite/discord-linux',
      'discord.gg/events',
      'discordapp.com/invite/events',
      'discord.gg/mmfyqEQ',
      'discordapp.com/invite/mmfyqEQ'
    ];

    const invite = /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i;
    const test = invite.exec(message.content);
    
    if (test === null) return;
    if (whitelist.includes(test[0])) return console.log('Fired to part 2.');
    
    if (test) {
      message.delete().then(() => {
        let count = 1;
        const spammer = `${message.guild.id}-${message.author.id}`;
        const list = client.invspam.get(spammer) || client.invspam.set(spammer, { count: 0 }).get(spammer);
        if (list) count = list.count + 1;
        if (count >= parseInt(client.settings.get(message.guild.id).inviteLimit)) {
          message.member.ban({ days: 2, reason: 'Automatic ban, invite spam threshold exceeded.' }).then((g) => {
            message.channel.send(`${g.user.username} was successfully banned for invite spam`);
            client.invspam.delete(spammer);
          });
        }
        client.invspam.set(spammer, { count });
      });
      message.channel.send(`${message.author} |\`⛔\`| Your message contained a server invite link, which this server prohibits.`);
    }
  }

  static checkLevel(client, message, level) {
    if (message.channel.type !== 'text') return;
    if (message.author.id === '186002153066725378') return;
    if (message.guild.id !== '186004000963952640') return;
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    const settings = client.settings.get(message.guild.id);
    if (message.content.startsWith(settings.prefix)) return;
    const score = client.points.get(`${message.guild.id}-${message.author.id}`);
    if (score.level >= 5) {
      if (message.member.roles.has('186012542932353024') || message.member.roles.has('455627014360268812')) return;
      const user = message.guild.members.get(message.author.id);
      const role = message.guild.roles.get('396082698860494849'); // Production Guild
      // const role = message.guild.roles.get('399972162905047050'); // Testing Guild
      if (message.member.roles.has('396082698860494849')) return; // Production Guild
      // if (message.member.roles.has('399972162905047050')) return; // Testing Guild
      user.addRole(role);
      client.log('Log', `${message.author.username} has reached level 5 and obtained the f e a t h e r s role!`, 'Role');
    } else return;
  }
};