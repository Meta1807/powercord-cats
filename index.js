const { Plugin } = require('powercord/entities');
const { channels, getModule } = require('powercord/webpack');

const autocomplete = require('./helpers/autocomplete');

const mimeTypes = require('./mime.json');
const tags = require('./tags.json');

module.exports = class Cats extends Plugin {
  async startPlugin () {
    const { upload } = await getModule([ 'upload', 'cancel' ]);

    const send = (object) => {
      if (mimeTypes[object.Type]) {
        const file = new File([ object.buffer ], `${Date.now()}${mimeTypes[object.type]}`);
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
            fetch(`https://cataas.com/cat/${imageArgument}`, { cache: 'no-cache' })
              .then(async (response) => {
                const buffer = await response.blob();
                return {
                  buffer,
                  type: response.headers.get('content-type')
                };
              })
              .then(send);
          }
        } else if (mode === 'gif') {
          fetch('https://cataas.com/cat/gif', { cache: 'no-cache' })
            .then(async (response) => {
              const buffer = await response.blob();
              return {
                buffer,
                type: response.headers.get('content-type')
              };
            })
            .then(send);
        } else if (mode === 'say') {
          fetch(`https://cataas.com/cat/says/${encodeURI(args.join(' '))}`, { cache: 'no-cache' })
            .then(async (response) => {
              const buffer = await response.blob();
              return {
                buffer,
                type: response.headers.get('content-type')
              };
            })
            .then(send);
        } else {
          fetch('https://cataas.com/cat', { cache: 'no-cache' })
            .then(async (response) => {
              const buffer = await response.blob();
              return {
                buffer,
                type: response.headers.get('content-type')
              };
            })
            .then(send);
        }
      },
      autocomplete
    });
  }

  pluginWillUnload () {
    powercord.api.commands.unregisterCommand('cats');
  }
};
