module.exports = {
    name: 'current',
    description: 'Current notify channel.',
    execute(client, message, args, botconfig) {
        message.channel.send('Текущий отслеживаемый канал: ' + botconfig.channel_gg);
    },
};