module.exports = {
    name: 'rank',
    description: 'Your current rank.',
    execute(client, message) {
        let xp = require('../xp.json');
        let top = [];

        for (user in xp) {
            top.push({id: user, level: xp[user].level});
        }

        top.sort(function (a, b) {
            return b.level - a.level;
        });

        let rank;
        top.find(function (element, index, top) {
            if (element.id === message.author.id) {
                rank = 'Your current rank #' + (index + 1) + '. Level ' + element.level;
                return true;
            }
        });

        message.channel.send(rank);
    },
};