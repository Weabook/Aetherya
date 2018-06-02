const Social = require('../../structures/Social.js');

const { Canvas } = require('canvas-constructor');
const { resolve, join } = require('path');
Canvas.registerFont(resolve(join(__dirname, '../../assets/fonts/Discord.ttf')), 'Discord');

const { Attachment } = require('discord.js');
const { get } = require('snekfetch');
const imageUrlRegex = /\?size=2048$/g;

class Profile extends Social {
  constructor(client) {
    super(client, {
      name: 'profile',
      description: 'Create a neat little profile with your social information.',
      usage: 'profile',
      category: 'Social',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { 
    if (message.guild) {
      const key = `${message.guild.id}-${message.author.id}`;
      if (!this.client.points.has(key)) {
        this.client.points.set(key, {
          user: message.author.id, guild: message.guild.id, points: 0, level: 1
        });
      }

      await message.channel.send(new Attachment(await this.profile(message.member, this.client.points.get(key)), `profile-${message.author.id}.jpg`));
    }
  }

  async newRun(message, args, level) {
    if (message.guild) {
      if (message.mentions.users.size === 0) {
        const key = `${message.guild.id}-${message.author.id}`;
        if (!this.client.points.has(key)) {
          this.client.points.set(key, {
            user: message.author.id, guild: message.guild.id, points: 0, level: 1
          });
        }

        const { body: avatar } = await get(member.user.displayAvatarURL.replace(imageUrlRegex, '?size=128'));

        await message.channel.send(new Attachment(await this.profile(message.author, avatar, this.client.points.get(key)), 'profile.png'));
      } else {
        const id = args[0];

        const key = `${message.guild.id}-${id}`;
        if (!this.client.points.has(key)) {
          this.client.points.set(key, {
            user: message.author.id, guild: message.guild.id, points: 0, level: 1
          });
        }
        const member = await this.client.fetchUser(id);

        const { body: avatar } = await get(member.user.displayAvatarURL.replace(imageUrlRegex, '?size=128'));

        console.log(member);

        // await message.channel.send(new Attachment(await this.profile(member, avatar, this.client.points.get(key)), 'profile.png'));
      }
    }
  }

  async profile(member, /* avatar, */ score) {
    const { level, points } = score;
    const name = member.displayName.length > 20 ? member.displayName.substring(0, 17) + '...' : member.displayName;
    const { body: avatar } = await get(member.user.displayAvatarURL.replace(imageUrlRegex, '?size=128'));
    return new Canvas(400, 180)
    // Create the Blurple rectangle on the right of the image
      .setColor('#7289DA')
      .addRect(84, 0, 316, 180)

    // Create the "Dark, but not black" boxes for the left side of the image
    // and the text boxes on the right.
      .setColor('#2C2F33')
      .addRect(0, 0, 84, 180)
      .addRect(169, 26, 231, 46)
      .addRect(224, 108, 176, 46)

    // Create a shadow effect for the avatar placement.
      .setShadowColor('rgba(22, 22, 22, 1)')
      .setShadowOffsetY(5)
      .setShadowBlur(10)

    // This circle is 2 pixels smaller in the radius to prevent a white border.
      .save()
      .createRoundPath(84, 90, 62)
      .fill()
      .addRoundImage(avatar, 20, 26, 128, 128, 64)
      .restore()

    // This creates a rounded corner rectangle, you must use restore to
    // add new elements afterwards.
      .createBeveledClip(20, 138, 128, 32, 5)
      .setColor('#23272A')
      .addRect(20, 138, 128, 32)
      .restore()

    // Add all of the text for the template.
      .setTextAlign('center')
      .setTextFont('10pt Discord')
      .setColor('#FFFFFF')
      .addText(name, 285, 54)
      .addText(`Level: ${level.toLocaleString()}`, 84, 159)
      .setTextAlign('left')
      .addText(`Score: ${points.toLocaleString()}`, 241, 136)
      .toBuffer();
  }
}

module.exports = Profile;