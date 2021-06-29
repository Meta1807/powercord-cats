const { Plugin } = require('powercord/entities');
const { channels, getModule } = require('powercord/webpack');

const autocomplete = require('./helpers/autocomplete');

const { mime, tags, baseUrl } = require('./constants');

module.exports = class Cats extends Plugin {
  async startPlugin () {
    const { upload } = await getModule([ 'upload', 'cancel' ]);

    const send = (object) => {
      if (mime[object.type]) {
        const file = new File([ object.buffer ], `${Date.now()}${mime[object.type]}`);
        upload(channels.getChannelId(), file);
      } // Temporary workaround for cases where image does not exist.
    };

    powercord.api.commands.registerCommand({
      command: 'cat',
      aliases: [ 'neko' ],
      description: 'Send a random cat picture!',
      usage: '{c}',
      executor: (args) => {
        const mode = args.shift()?.toLowerCase();
        const imageArgument = args[0];
        if (mode === 'tag') {
          if (tags.some((item) => item === imageArgument)) {
            this.getCats(`/${imageArgument}`)
              .then(send);
          }
        } else if (mode === 'gif') {
          this.getCats('/gif')
            .then(send);
        } else if (mode === 'say') {
          this.getCats(`/says/${encodeURI(args.join(' '))}`)
            .then(send);
        } else {
          this.getCats()
            .then(send);
        }
      },
      autocomplete
    });
  }

  async processImage (response) {
    const buffer = await response.blob();
    return {
      buffer,
      type: response.headers.get('content-type')
    };
  }

  getCats (endpoint = '') {
    return fetch(`${baseUrl}${endpoint}`, { cache: 'no-cache' })
      .then(this.processImage);
  }

  pluginWillUnload () {
    powercord.api.commands.unregisterCommand('cats');
  }
};
