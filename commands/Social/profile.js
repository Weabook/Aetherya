const Social = require('../../structures/Social.js');

class Profile extends Social {
  constructor(client) {
    super(client, {
      name: 'social',
      description: 'Create a neat little profile with your social information.',
      usage: 'profile',
      category: 'Social',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { 
    
  }
}

module.exports = Profile;