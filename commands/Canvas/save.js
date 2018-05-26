const Social = require('../../structures/Social.js');
 
const { Canvas } = require('canvas-constructor');
 
const { Attachment } = require('discord.js');
const { get } = require('snekfetch');
 
const imageUrlRegex = /\?size=2048$/g;
 
class Save extends Social {
  constructor(client) {
    super(client, {
      name: 'save'
    });
  }
 
  async run(message, args, level) {
    const msg = await message.channel.send('Creating save.');
    const m = await message.channel.send('▱▱▱▱▱▱▱▱▱▱');
 
    for (let i = 0; i < 11; i++) {  
      await m.edit('▰'.repeat(i) + '▱'.repeat(10 - i));
      while (i === parseInt('11')) {
        await msg.delete();
        await m.delete();
        await message.channel.send(new Attachment(await this.save((message.mentions.users.first() || message.author)), 'save.png'));
      }
    }
    // await message.channel.send(new Attachment(await this.save((message.mentions.users.first() || message.author)), 'save.png'));
  }
 
  async save(member) {
    const { body: avatar } = await get(member.displayAvatarURL.replace(imageUrlRegex, '?size=256'));
    return new Canvas(500, 500)
      .setColor('#808080')
      .createBeveledPath(0, 0, 850, 850, 60)
      .fill()
      .restore()
      .setColor('#23272A')
      .addRect(0, 0, 128, 32)
      .addRect(84, 0, 500, 180)
      .setColor('#2C2F33')
      .addRect(0, 0, 165, 180)
      .addRect(275, 26, 231, 46)
      .addRect(323, 108, 176, 46)
      .setShadowColor('rgba(22, 22, 22, 1)')
      .setShadowOffsetY(5)
      .setShadowBlur(10)
      // .setColor('#A9A9A9')
      // .addCircle(250, 325, 75)
      .restore()
      .addRoundImage(avatar, 210, 300, 75, 75, 36)
      .restore()
      .toBuffer();
  }
}
 
module.exports = Save;