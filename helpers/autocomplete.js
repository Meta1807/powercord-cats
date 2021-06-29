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
  }
];

module.exports = (args) => {
  if (args.length === 1) {
    return {
      commands: modes,
      header: 'Cats!'
    };
  } else if (args.length === 2) {
    switch (args.shift()) {
      case 'tag':
        return {
          commands: tags.map((item) => ({
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
