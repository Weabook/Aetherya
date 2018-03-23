const Command = require('../../structures/Command.js');
const ms = require('ms');
const moment = require('moment');
const { RichEmbed } = require('discord.js');

class Reminder extends Command {
  constructor(client) {
    super(client, {
      name: 'reminder',
      description: 'Remind yourself with this command.',
      category: 'Utilities',
      usage: 'reminder <reminder:string>',
      extended: 'Need to be reminded to take the trash out? This command can help!',
      aliases: ['remember'],
      usageExamples: ['reminder -create practice in 20 minutes', 'reminder -delete <reminder id>', 'reminder -edit <reminder id> practice in 3 hours'],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const pingRole =  this.client.guilds.get(message.guild.id).roles.find('name', settings.pingRole).id;
    if (!pingRole) return message.error(undefined, `I cannot find the \`${settings.pingRole}\` role.`);
    if (!message.flags.length) {
      let reminders = this.client.reminders.findAll('ID', pingRole).map(r => `${r.reminder} - ${moment(r.reminderTimestamp).fromNow()}`);
      reminders.length === 0 ? reminders = 'You do not have any reminders set.' : '**Your Reminders:**\n' + reminders;
      const embed = new RichEmbed()
        .setTitle('Your Reminders')
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setDescription(reminders)
        .setFooter('Scheduler', this.client.user.displayAvatarURL)
        .setTimestamp();
      return message.channel.send({ embed });
    }

    switch (message.flags[0]) {
      case ('create'): {
        const blah = await this.regCheck(args.join(' '));
        if (!blah) throw '|`❌`| Invalid Command usage, you must supply a reminder message and duration e.g; `Do the laundry in 20 minutes`.';

        this.client.reminders.set(`${pingRole}-${message.createdTimestamp + ms(blah.split('#')[1])}`, {
          ID: pingRole,
          guildID: message.guild.id,
          channelID: message.channel.id,
          reminder: blah.split('#')[0],
          reminderTimestamp: message.createdTimestamp + ms(blah.split('#')[1])
        });

        message.channel.send(`I've created a reminder with the ID ${message.createdTimestamp + ms(blah.split('#')[1])}, to \`${blah.split('#')[0]}\`, ${blah.split('#')[1]} from now.`);
        break;
      }

      case ('delete'): {
        const agree = ['yes', 'y'];
        const disagree = ['no', 'n'];
        try {
          const reminder = await this.client.reminders.get(`${pingRole}-${args[0]}`);

          const response = await this.client.awaitReply(message, `Are you sure you want to delete the reminder \`\`${reminder.reminder}\`\`?`, 60000);
          
          if (agree.includes(response)) {
            await this.client.reminders.delete(`${pingRole}-${args[0]}`);
            message.reply('I have deleted the reminder.');
          } else

          if (disagree.includes(response)) {
            message.channel.send('Cancelled deletion.');
          } else {
            message.channel.send(`That is not a valid response. Valid responses include \`${agree.join(', ')}\` and \`${disagree.join(', ')}\``);
          }
        } catch (err) {
          throw err;
        }
        break;
      }

      case ('edit'): {
        const reminder = await this.client.reminders.get(`${pingRole}-${args[0]}`);
        const id = args[0];
        const blah = await this.regCheck(args.splice(1).join(' '));
        if (!blah) throw '|`❌`| Invalid Command usage, you must supply a reminder message and duration e.g; `Do the laundry in 20 minutes`.';

        await this.client.reminders.delete(`${pingRole}-${id}`);
        await this.client.reminders.set(`${pingRole}-${message.createdTimestamp + ms(blah.split('#')[1])}`, {
          ID: pingRole,
          guildID: message.guild.id,
          channelID: message.channel.id,
          reminder: blah.split('#')[0],
          reminderTimestamp: message.createdTimestamp + ms(blah.split('#')[1])
        });
        message.channel.send(`I've updated your reminder to remind you of ${reminder.reminder}`);
      }
    }
  }

  regCheck(reminder) {
    const remind = /(?:^| )(?:in ?)?(((?:\d{1,2}(?:\.\d|\d)?)|a) ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?))\b/gi.exec(reminder);
    if (!remind) return false;
    const time = remind[1]
      .replace(/ ms?\b/, ' min') //m => min
      .replace(/\ba ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?)\b/g, '1 $1').trim(); // a "something" => 1 "something"
    const input = /(?:me ?)?(?:to ?)?(.*)/gi.exec(reminder)[1]
      .replace(remind[0], '').trim();
    if (input.length === 0) return false;
    return `${input}#${time}`;
  }
}

module.exports = Reminder;