module.exports = {
    name: 'setactivity',
    description: 'Set bot activity. Example: !setactivity Killing myself',
    execute(client, message, args) {
        const Writer = require('../writer.js');
        let activityValue = args.join(' ');
        client.user.setActivity(activityValue);
        let config = {
            activity: activityValue
        };
        let writer = new Writer();
        writer.writeFile('./botconfig.json', config)
    },
};