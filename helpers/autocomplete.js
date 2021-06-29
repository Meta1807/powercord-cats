const tags = require('../tags.json');

const modes = [
  {
    command: '',
    description: 'Random cats!'
  },
  {
    command: 'gif',
    description: 'Random gif of cats!'
  },
  {
    command: 'tag',
    description: 'Search cats by tag'
  },
  {
    command: 'say',
    description: 'Random cats, now with text!'
  }
];

module.exports = (args) => {
  if (args.length === 1) {
    const re = new RegExp(args.shift(), 'i');
    return {
      commands: modes.filter((item) => item.command.match(re)),
      header: 'Cats!'
    };
  } else if (args.length === 2) {
    const re = new RegExp(args[1], 'i');
    switch (args.shift(args[0])) {
      case 'tag':
        return {
          commands: tags.filter((item) => item.match(re)).map((item) => ({
            command: item,
            description: ''
          })),
          header: 'Cats! - Tag Mode'
        };
      default:
        return false;
    }
  }
  return false;
};
