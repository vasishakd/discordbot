module.exports = {
    name: 'current',
    description: 'Current notify channel.',
    execute(client, message, args, botconfig) {
        message.channel.send('Текущий отслеживаемый канал: https://goodgame.ru/channel/' + botconfig.channel_gg);
    },
};