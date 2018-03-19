const path = require('path');

class Event {
  constructor(client, filepath, options = {}) {
    this.client = client;
    this.name = options.name || path.parse(filepath).name;
    this.enabled = 'enabled' in options ? options.enabled : true;
    this.file = filepath;
  }

  async _run(...args) {
    if (this.enabled) {
      try {
        await this.run(...args);
      } catch (err) {
        this.client.log('ERR', err, 'ERR');
      }
    }
  }

  reload() {
    return this.client.events.load(this.file);
  }
}