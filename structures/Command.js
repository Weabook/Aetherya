// Create the base class, Command.
const pageButtons = ['⬅','➡','🛑'];

class Command {
  constructor(client, {
    name = null,
    description = 'No description provided.',
    category = 'Miscellaneous',
    usage = 'No usage provided.',
    hidden = false,
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    extended = 'No information provided.',
    botPerms = [],
    exampleUsage = [],
    permLevel = 'User',
    location = ''
  }) {
    this.client = client;
    this.conf = { 
      enabled,
      hidden, 
      guildOnly,
      aliases,
      permLevel,
      botPerms,
      location
    };
    this.help = { 
      name,
      description,
      category,
      usage,
      extended,
      exampleUsage
    };
  }

  async paginate(message, list, makeEmbed) {
    const msg = await message.channel.send('`Loading please wait ...`');
    for (let i = 0; i < pageButtons.length; i++) { await msg.react(pageButtons[i]); }
    const embed = await msg.edit('', { embed: (this.makeEmbed(list, 0)) });
    return await this.progressPages(message, embed, list, 0, makeEmbed);
  }
  
  progressPages(message, embed, list, page, embedMakerFunction) {
    embed.awaitReactions((rec, user) => user.id === message.author.id && pageButtons.includes(rec.emoji.toString()), { time: 30000, max: 1, errors: ['time'] })
      .then((reactions) => {
        const res = reactions.first();
        switch (res._emoji.name) {
          case '⬅':
            page -= 1;
            break;
          case '➡':
            page += 1;
            break;
          case '🛑':
            return embed.reactions.removeAll();
        }
        page = page <= 0 ? 0 : page >= list.length  ? list.length - 1 : page;      
        embed.edit(embedMakerFunction(list, page));
        res.remove(message.author);
        return this.progressPages(message, embed, list, page, embedMakerFunction);
      })
      .catch((error) => {
        this.client.log('ERROR', error, 'Error');
        return message.channel.send('There was some error, sorry for the interuption.').then(sent => sent.delete({ timeout : 5000 }));
      });
  }
  
  makeTitles(data) {
    const arr = new Array();
    const { makeTitle } = this;
    for (let i = 0; i <5; i++) {
      arr.push(`\n${i + 1}:`);
      arr.push(makeTitle(i, data));
    }
    return arr.join(' ');
  }
  
  makeTitle(index, data) {
    const line1 = data[index].titles.en_jp ? data[index].titles.en_jp : '';
    const line2 = data[index].titles.en ? `/${data[index].titles.en}` : '';
    return `${line1}${line2}`;
  }

  // Verifies that a user is actually a user on Discord.
  async verifyUser(user) {
    try {
      const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
      if (!match) throw 'Invalid user';
      const id = match[1];
      const check = await this.client.fetchUser(id);
      if (check.username !== undefined) return check;
    } catch (error) {
      throw error;
    }
  }

  // Makes sure a user is actually in the guild.
  async verifyMember(guild, member) {
    const user = await this.verifyUser(member);
    const target = await guild.fetchMember(user);
    return target;
  }

  // Verifies that a message actually exists.
  async verifyMessage(message, msgid) {
    try {
      const match = /([0-9]{17,20})/.exec(msgid);
      if (!match) throw 'Invalid message id.';
      const id = match[1];
      const check = await message.channel.fetchMessage(id);
      if (check.cleanContent !== undefined) return id;
    } catch (error) {
      throw error;
    }
  }

  // Verifies that a channel actually exists in the guild.
  async verifyChannel(message, chanid) {
    try {
      const match = /([0-9]{17,20})/.exec(chanid);
      if (!match) return message.channel.id;
      const id = match[1];
      const check = await message.guild.channels.get(id);
      if (check.name !== undefined && check.type === 'text') return id;
    } catch (error) {
      throw error;
    }
  }
}

// Export the class for use in commands.
module.exports = Command;