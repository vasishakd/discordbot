module.exports = {
    name: 'level',
    description: 'Your current level.',
    execute(client, message) {
        let xp = require('../xp.json');
        let xpRemain = xp[message.author.id].level * 250 - xp[message.author.id].xp;
        message.channel.send('Your level: ' + xp[message.author.id].level + '. Exp for next level: ' + xpRemain);
    },
};