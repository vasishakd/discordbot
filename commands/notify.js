module.exports = {
    name: 'notify',
    description: 'Set channel to notify. Example: !notify goodgamechannel',
    execute(client, message, args) {
        if (message.member.roles.some(r => ["moderator", "Mod"].includes(r.name))) {
            const Writer = require('../writer.js');
            let config = {
                channel_gg: args[0],
                channel_discord: message.channel.id
            };
            let writer = new Writer();
            writer.writeFile('./botconfig.json', config);
            message.channel.send('Канал ' + args[0] + ' теперь отслеживается');
        }
    },
};