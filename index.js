const { Plugin } = require('powercord/entities');
const { channels, getModule } = require('powercord/webpack');

const autocomplete = require('./helpers/autocomplete');

const mimeTypes = require('./mime.json');

module.exports = class Cats extends Plugin {
  async startPlugin () {
    const { upload } = await getModule([ 'upload', 'cancel' ]);

    const send = (object) => {
      const file = new File([ object.buffer ], `cat${mimeTypes[object.type]}`);
      upload(channels.getChannelId(), file);
    };

    powercord.api.commands.registerCommand({
      command: 'cat',
      aliases: [ 'neko' ],
      description: 'Send a random cat picture!',
      usage: '{c}',
      executor: (args) => {
        const mode = args[0] && args[0].toLowerCase();
        const imageArgument = args[1] && args[1].toLowerCase();
        if (mode === 'tag') {
          fetch(`https://cataas.com/cat/${imageArgument}`)
            .then(async (response) => {
              const buffer = await response.blob();
              return {
                buffer,
                type: response.headers.get('content-type')
              };
            })
            .then(send);
        } else if (mode === 'gif') {
          fetch('https://cataas.com/cat/gif')
            .then(async (response) => {
              const buffer = await response.blob();
              return {
                buffer,
                type: response.headers.get('content-type')
              };
            })
            .then(send);
        } else {
          fetch('https://cataas.com/cat')
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
