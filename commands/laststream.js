module.exports = {
    name: 'laststream',
    description: 'Last stream date.',
    execute(client, message, args, botconfig) {
        if (botconfig.last_stream_date) {
            let date = new Date(botconfig.last_stream_date).toLocaleDateString();
            message.channel.send('Дата последнего стрима: ' + date);
        } else {
            message.channel.send('Неизвестно');
        }

    },
};