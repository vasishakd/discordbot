module.exports = {
    name: 'current',
    description: 'Current notify channel. Example: !current',
    execute(client, message, args, botconfig) {
        message.channel.send('Текущий отслеживаемый канал: ' + botconfig.channel_gg);
    },
};