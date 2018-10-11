module.exports = {
    name: 'delete',
    description: 'Delete channel from notify. Example: !delete',
    execute(message) {
        message.channel.send('Канал ' + botconfig.channel_gg + ' больше не отслеживается');
        rewriteJson('', '');
        botconfig = JSON.parse(fs.readFileSync('botconfig.json', 'utf8'));
    },
};