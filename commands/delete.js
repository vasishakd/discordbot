module.exports = {
    name: 'delete',
    description: 'Delete channel from notify.',
    execute(client, message) {
        if (message.member.roles.some(r => ["moderator", "Mod"].includes(r.name))) {
            const Writer = require('../writer.js');
            let config = {
                channel_gg: '',
                channel_discord: ''
            };
            let writer = new Writer();
            writer.writeFile('./botconfig.json', config)
            message.channel.send('Канал ' + botconfig.channel_gg + ' больше не отслеживается');
        }
    },
};