const { RichEmbed } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(reaction, user) {
    const message = reaction.message;
    if (message.reactions.size < 2) return;
    if (reaction.emoji.name !== '🎵') return;
    const settings = message.settings;
    
    const fetch = await message.guild.channels.find('name', settings.musicLog).fetchMessages({ limit: 100 });

    const notes = fetch.find(m => m.embeds[0].footer.text.startsWith('🎵') && m.embeds[0].footer.text.endsWith(message.id));
    if (notes) {
      const note = /\🎵\s([0-9]{1,3})\s\|\s([0-9]{17,20})/g.exec(notes.embeds[0].footer.text);
      const _note = notes.embed[0];
      const embed = new RichEmbed()
        .setAuthor(message.author.name, message.author.displayAvatarURL, message.content)
        .setDescription(_note.description)
        .setTimestamp()
        .setFooter(`🎵 ${parseInt(note[1])+1} | ${message.id}`)
        .setColor(_note.color);
      const noteMsg = await message.guild.channels.find('name', settings.musicLog).fetchMessage(notes.id);
      await noteMsg.edit({ embed });
    }
    if (!notes) {
      const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL, message.content)
        .setDescription(message.cleanContent)
        .setTimestamp(new Date())
        .setFooter(`🎵 1 | ${message.id}`)
        .setColor(0xffc1e2);
      await message.guild.channels.find('name', settings.musicLog).send({ embed });
    }
    
    // if (reaction.emoji.name == '🎵') {
    // if () 
    // }

    // if (reaction.emoji.name == '📌') {
    //   if ()
    // }
  }
};