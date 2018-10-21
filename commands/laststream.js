module.exports = {
    name: 'laststream',
    description: 'Last stream date.',
    execute(client, message, args, botconfig) {
        if (botconfig.last_stream_date) {
            message.channel.send('Дата последнего стрима: ' + botconfig.last_stream_date);
        } else {
            message.channel.send('Хуй его знает');
        }

    },
};