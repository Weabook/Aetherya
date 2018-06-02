const Command = require('../../structures/Command.js');

class Set extends Command {
  constructor(client) {
    super(client, {
      name: 'set',
      description: 'View or change settings for your server.',
      category: 'System',
      usage: 'set <view/get/edit> <key> <value>',
      guildOnly: true,
      aliases: ['setting', 'settings'],
      permLevel: 'Administrator'
    });
  }

  async run(message, [action, key, ...value], level) {

    const settings = this.client.settings.get(message.guild.id);
    const defaults = this.client.settings.get('default');
  
    if (action === 'edit') {
      if (!key) return message.reply('Please specify a key to edit');
      if (!settings.hasOwnProperty(key)) return message.reply('This key does not exist in the settings');
      if (value.length < 1) return message.reply('Please specify a new value');
    
      settings[key] = value.join(' ');

      this.client.settings.set(message.guild.id, settings);
      message.reply(`${key} successfully edited to ${value.join(' ')}`);
    } else
  
    if (action === 'del' || action === 'reset') {
      if (!key) return message.reply('Please specify a key to delete (reset).');
      if (!settings[key]) return message.reply('This key does not exist in the settings');
      
      const response = await this.client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`?`);

      if (['y', 'yes'].includes(response)) {

        delete settings[key];
        this.client.settings.set(message.guild.id, settings);
        message.reply(`${key} was successfully reset to default.`);
      } else

      if (['n','no','cancel'].includes(response)) {
        message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
      }
    } else
  
    if (action === 'get') {
      if (!key) return message.reply('Please specify a key to view');
      if (!settings[key]) return message.reply('This key does not exist in the settings');
      message.reply(`The value of ${key} is currently ${settings[key]}`);
      
    } else {
      //       const array = [];
      //       Object.entries(settings).forEach(([key, value]) => {
      //         array.push(`${key}${' '.repeat(20 - key.length)}::  ${value}`); 
      //       });
      //       await message.channel.send(`= Current Guild Settings =
      // ${array.join('\n')}`, {code: 'asciidoc'});
      await message.channel.send(`${' '.repeat(23)} = Current Guild Settings =\n\n= Strings =\nprefix${' '.repeat(20 - 6)}::  ${settings.prefix}\n\n= Booleans =\njoinEnabled${' '.repeat(20 - 11)}::  ${settings.joinEnabled}\nleaveEnabled${' '.repeat(20 - 12)}::  ${settings.leaveEnabled}\neditEnabled${' '.repeat(20 - 11)}::  ${settings.editEnabled}\ndeleteEnabled${' '.repeat(20 - 13)}::  ${settings.deleteEnabled}\n\n= Channels =\nstreamChannel${' '.repeat(20 - 13)}::  ${settings.streamChannel}\nannounceChannel${' '.repeat(20 - 15)}::  ${settings.announceChannel}\nmodLogChannel${' '.repeat(20 - 13)}::  ${settings.modLogChannel}\npartnerLog${' '.repeat(20 - 10)}::  ${settings.partnerLog}\n\n= Roles =\nfamily${' '.repeat(20 - 6)}::  ${settings.family}\nmoderator${' '.repeat(20 - 9)}::  ${settings.moderator}\nmuteRole${' '.repeat(20 - 8)}::  ${settings.muteRole}\n\n= Points =\nMinimum Points${' '.repeat(20 - 14)}::  ${settings.minPoints}\nMaximum Points${' '.repeat(20 - 14)}::  ${settings.maxPoints}\nDaily Reward${' '.repeat(20 - 12)}::  ${settings.pointsReward}\nDaily Delay${' '.repeat(20 - 11)}::  ${settings.dailyTime}`, { code: 'asciidoc' });
    }
  }
}

module.exports = Set;