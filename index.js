const { Plugin } = require('powercord/entities');
const { channels, getModule } = require('powercord/webpack');

module.exports = class Cats extends Plugin {
  async startPlugin () {
    const { upload } = await getModule([ 'upload', 'cancel' ]);
    powercord.api.commands.registerCommand({
      command: 'cats',
      aliases: [ 'neko' ],
      description: 'Send a random cat picture!',
      usage: '{c}',
      executor: () => {
        fetch('https://cataas.com/cat')
          .then((response) => response.blob())
          .then((buffer) => {
            const file = new File([ buffer ], 'cat.png');
            upload(channels.getChannelId(), file);
          });
      }
    });
  }

  pluginWillUnload () {
    powercord.api.commands.unregisterCommand('cats');
  }
};
