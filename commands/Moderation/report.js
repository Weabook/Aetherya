const Moderation = require('../../structures/Moderation.js');

class Report extends Moderation {
  constructor(client) {
    super(client, {
      name: 'report',
      description: 'Report a user.',
      usage: 'report <report:string>',
      permLevel: 'User'
    });
  }

  async run(message, [reason, user, ...request], level) {
    const { moderator, modLogChannel } = this.client.settings.get(message.guild.id);
    const channel = message.guild.channels.find('name', modLogChannel);
    const role = message.guild.roles.find('name', moderator);

    const validReasons = ['spam', 'nsfw', 'advertising'];
    if (!validReasons.includes(reason)) return message.error(undefined, `you provided an invalid reason for a report. Please provide one of these reasons \`${validReasons.join(', ')}\``);

    const regex = /[a-zA-Z]{1,32}[#][0-9]{1,4}/;
    if (regex.exec(user) == null) {
      return message.error(undefined, 'please provide a valid user, eg: OGNovuh#0003');
    }

    await channel.send(`${role}`);
    channel.send(`= User Report =\n\n[ Requested by ${message.author.tag} ]\n\n== Offending User ==\n${user}\n\n== Reason ==\n${reason}\n\n== Optional Notes ==\n${request.length < 1 ? 'No notes provided.': request}`, { code: 'asciidoc' });
  }
}

module.exports = Report;