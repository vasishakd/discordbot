module.exports = {
    name: 'current',
    description: 'Current notify channel.',
    execute(client, message, args, botconfig) {
        if (message.member.roles.some(r => ["moderator", "Mod"].includes(r.name))) {
            message.channel.send('Текущий отслеживаемый канал: https://goodgame.ru/channel/' + botconfig.channel_gg);
        }
    },
};