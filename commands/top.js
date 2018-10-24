module.exports = {
    name: 'top',
    description: 'Your current level.',
    execute(client, message) {
        let xp = require('../xp.json');

        let top = [];
        let username;

        for (user in xp) {
            if (client.users.get(user)) {
                username = client.users.get(user).username;
                top.push({name: username, level: xp[user].level});
            }
        }

        top.sort(function (a, b) {
            return b.level - a.level;
        });

        top = top.slice(0, 10);

        let content = '```';

        for (let i = 0; i < top.length; i++) {
            content += (i+1) + '. ' + top[i].name + '. Level: ' + top[i].level + '\n';
        }

        content += '```';

        message.channel.send(content);
    },
};

