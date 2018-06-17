const { Message, Channel, RichEmbed, TextChannel, DMChannel, User } = require('discord.js');
const ms = require('ms');


String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.toPlural = function() {
  return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
};
  
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Message.prototype.buildEmbed = function() {
  return this.channel.buildEmbed();
};

Message.prototype.evalBlock = function(lang, expression, type, time) {
  return this.channel.send(`**Output:**\n\`\`\`${lang}\n${expression}\n\`\`\`**Type:**\n\`\`\`${type}\`\`\`\n${time}`);
};

Message.prototype.codeBlock = function(lang, expression) {
  return `\`\`\`${type}\n${expression}\`\`\``;
};

Message.prototype.error = function(message, content, embed, options = {}) {
  return this.channel.send(`${this.author} \`|❌|\` ${content}`, embed);
};

User.prototype.tempOMute = async function(client, message, user, time) {
  const { muteRole } = client.settings.get(message.guild.id);
  await user.addRole(muteRole).then(() => {
    user.removeRole(muteRole);
    console.log('Done!');
  }, ms(time));
};

User.prototype.tempMute = async function(client, message, user, time) {
  const { muteRole } = client.settings.get(message.guild.id);
  const role = message.guild.roles.find('name', muteRole);
  await user.addRole(role).then(() => {
    setTimeout(() => {
      user.removeRole(role);
    }, ms(time));
  });
};

Channel.prototype.lock = async function(client, message, time) {
  if (!this.client.lockit) this.client.lockit = [];
  message.channel.overwritePermissions(message.guild.id, {
    SEND_MESSAGES: false
  }).then(() => {
    message.channel.send(`The channel has been locked down for ${ms(ms(time), { long: true })}.`).then(() => {
      this.client.lockit[message.channel.id] = setTimeout(() => {
        message.channel.overwritePermissions(message.guild.id, {
          SEND_MESSAGES: null
        }).then(message.channel.send('The lockdown has been lifted.')).catch(console.error);
        delete this.client.lockit[message.channel.id];
      }, ms(time));
    });
  });
};

Channel.prototype.unlock = async function(message) {
  message.channel.overwritePermissions(message.guild.id, {
    SEND_MESSAGES: null
  });
};

Channel.prototype.buildEmbed = function() {
  return Object.defineProperty(new RichEmbed(), 'sendToChannel', { value: this });
};

RichEmbed.prototype.send = function(content) {
  if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject('Embed not created in a channel');
  return this.sendToChannel.send(content || '', { embed: this });
};

