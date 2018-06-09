const Command = require('./Command.js');

class Partner extends Command {
  constructor(client, options) {
    super(client, Object.assign(options, {
      category: 'Partnership'
    }));
  }

  async appNumber(client, partnerLog) {
    const messages = await partnerLog.fetchMessages({limit: 100});
    const log = messages.filter(m => m.author.id === client.user.id
      && m.embeds[0]
      && m.embeds[0].type === 'rich'
      && m.embeds[0].footer
      && m.embeds[0].footer.text.startsWith('Application')
    ).first();
    if (!log) return 1;
    const thisCase = /Application\s(\d+)/.exec(log.embeds[0].footer.text);
    return thisCase ? parseInt(thisCase[1]) + 1 : 1;
  }

  async appEmbed(color, invite, count, reason, author, timestamp, appNumber) {
    const { RichEmbed } = require('discord.js');
    const embed = new RichEmbed()
      .setAuthor(`${author.tag} (${author.id})`, author.displayAvatarURL)
      .setDescription(`**Invite Link:** ${invite} \n**Member Count:** ${count} Members\n**Status:** Pending\n**Reason:** ${reason}`)
      .setFooter(`Application ${appNumber}`)
      .setColor(color)
      .setTimestamp(timestamp);
    return embed;
  }

  async appApprove(color, invite, count, author, authorAvatar, timestamp, appNumber) {
    const { RichEmbed } = require('discord.js');
    const embed = new RichEmbed()
      .setAuthor(author, authorAvatar)
      .setDescription(`**Invite Link:** ${invite}\n**Member Count:** ${count} Members\n**Status:** Approved`)
      .setFooter(`Application ${appNumber}`)
      .setColor(color)
      .setTimestamp(timestamp);
    return embed;
  }

  async appDeny(color, invite, count, author, authorAvatar, timestamp, appNumber) {
    const { RichEmbed } = require('discord.js');
    const embed = new RichEmbed()
      .setAuthor(author, authorAvatar)
      .setDescription(`**Invite Link:** ${invite}\n**Member Count:** ${count} Members\n**Status:** Approved`)
      .setFooter(`Application ${appNumber}`)
      .setColor(color)
      .setTimestamp(timestamp);
    return embed;
  }

  async buildPartnerApp(client, invite, count, reason, author) {
    const setGuild = '335951728560046080';
    const settings = client.settings.get(setGuild);
    const appNumber = await this.appNumber(client, this.client.guilds.get(setGuild).channels.find('name', settings.partnerLog));
    const embed = await this.appEmbed('0xd9adfc', invite, count, reason, author, new Date(), appNumber);
    const msg = await this.client.guilds.get(setGuild).channels.find('name', settings.partnerLog).send({ embed });
    await msg.react(this.client.emojis.get('423664501083340811'));
    await msg.react(this.client.emojis.get('423664500999192598'));
  }
}

module.exports = Partner;