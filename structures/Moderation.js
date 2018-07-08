// Require the base command class.
const Command = require('./Command.js');

// Create the class so we can use it in commands.
class Moderation extends Command {
  constructor(client, options) {
    super(client, Object.assign(options, {
      category: 'Moderation',
      guildOnly: true,
      permLevel: 'Moderator'
    }));
    
    this.actions = {
      w: { color: 0xFFFF00, display: 'Warn'    }, // Yellow 
      k: { color: 0xFFA500, display: 'Kick'    }, // Orange
      m: { color: 0x00FFFF, display: 'Mute'    }, // Aqua
      um: { color: 0x00FFFF, display: 'Unmute' }, // Aqua
      s: { color: 0xEE5A5A, display: 'Softban' }, // Flamingo (Light Red)
      b: { color: 0xFF0000, display: 'Ban'     }, // Red
      hb: { color: 0xFF0000, display: 'Hackban'}, // Red
      u: { color: 0x000000, display: 'Unban'   }, // Black
      ld: { color: 0x7289DA, display: 'Lockdown'} // Blurple!
    };
  }

  // Make sure that you aren't trying to do anything stupid.
  async modCheck(message, user, level) {
    try {
      const modBot = message.guild.me;
      const id = await this.verifyUser(user);
      const target = await message.guild.fetchMember(id).catch(() => { return message.channel.send(`${message.author}, |\`❓\`| Cannot find member in guild.`); });
      if (target.highestRole.position >= modBot.highestRole.position) return message.channel.send(`${message.author}, |\`🛑\`| You cannot perform that action on someone of equal, or higher role.`);
      if (message.author.id === id) return message.channel.send(`${message.author}, |\`🛑\`| You cannot moderate yourself.`);
      const author = target.user;
      const member = target;
      const msg = { author:author, member:member, guild: message.guild, client: this.client, channel: message.channel };
      if (level <= this.client.permlevel(msg)) return message.channel.send(`${message.author}, |\`🛑\`| You cannot perform that action on someone of equal, or a higher permission level.`);
      return target;
    } catch (error) {
      throw error;
    }
  }

  async hackCheck(message, user, level) {
    try {
      const modBot = message.guild.me;
      const id = await this.verifyUser(user);
      const target = await this.client.fetchUser(id).catch(() => { message.channel.send(`${message.author}, |\`❓\`| I cannot fetch that member.`); });
      if (message.author.id === id) return message.channel.send(`${message.author}, |\`🛑\`| You cannot moderate yourself.`);
      return target;
    } catch (error) {
      throw error;
    }
  }

  // Sanitize the embed to allow us to set a new reason.
  embedSan(embed) {
    embed.message ? delete embed.message : null;
    embed.footer ? delete embed.footer.embed : null;
    embed.provider ? delete embed.provider.embed : null;
    embed.thumbnail ? delete embed.thumbnail.embed : null;
    embed.image ? delete embed.image.embed : null;
    embed.author ? delete embed.author.embed : null;
    embed.fields ? embed.fields.forEach(f => {delete f.embed;}) : null;
    return embed;
  }
  
  // Find what number this case should be.
  async caseNumber(client, modlog) {
    const messages = await modlog.fetchMessages({limit: 100});
    const log = messages.filter(m => m.author.id === client.user.id
      && m.embeds[0]
      && m.embeds[0].type === 'rich'
      && m.embeds[0].footer
      && m.embeds[0].footer.text.startsWith('Case')
    ).first();
    if (!log) return 1;
    const thisCase = /Case\s(\d+)/.exec(log.embeds[0].footer.text);
    return thisCase ? parseInt(thisCase[1]) + 1 : 1;
  }
  
  // Create a base embed for a case log.
  async caseEmbed(color, description, author, timestamp, footer) {
    const embed = {
      'color': color,
      'description': description,
      'author': {
        'name': author
      },
      'timestamp': timestamp,
      'footer': {
        'text': footer
      }
    };
    return embed;
  }

  // Build the case log.
  async buildModLog(client, guild, action, target, mod, reason) {
    const settings = client.settings.get(guild.id);
    const caseNumber = await this.caseNumber(client, guild.channels.find('name', settings.modLogChannel));
    const thisAction = this.actions[action];
    if (reason.length < 1) reason = `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNumber} <reason>.`;
    const embed = await this.caseEmbed(thisAction.color, `**Action:** ${thisAction.display}\n**Target:** ${target.user.tag} (${target.id})\n**Moderator:** ${mod.tag} (${mod.id})\n**Reason:** ${reason}`,`${mod.tag} (${mod.id})`, new Date(), `Case ${caseNumber}`);
    return guild.channels.find('name', settings.modLogChannel).send({embed});
  }
  
  async buildHackLog(client, guild, action, target, mod, reason) {
    const settings = client.settings.get(guild.id);
    const caseNumber = await this.caseNumber(client, guild.channels.find('name', settings.modLogChannel));
    const thisAction = this.actions[action];
    const moderee = await client.fetchUser(target);
    if (reason.length < 1) reason = `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNumber} <reason>.`;
    const embed = await this.caseEmbed(thisAction.color, `**Action:** ${thisAction.display}\n**Target:** ${moderee.username} (${moderee.id})\n**Reason:** ${reason}`,`${mod.tag} (${mod.id})`, new Date(), `Case ${caseNumber}`);
    return guild.channels.find('name', settings.modLogChannel).send({embed});
  }

  async infractionCreate(client, guildID, targetID, modID, action, reason) {
    const conn = await this.client.util.db.acquire();
    try {
      await this.client.util.db.createInfraction(conn, target, guild, action, reason, mod);
    } finally {
      conn.release();
    }
  }
}

// Export the class to allow for use in commands.
module.exports = Moderation;