const { prefix } = require('../botconfig.json');

module.exports = {
    name: 'help',
    description: 'List of all commands.',
    execute(client, message, args) {
        let data = [];
        const { commands } = message.client;
        if (!args.length) {
            commands.forEach(function(command) {
                data.push("\n " + prefix + command.name + ' - ' + command.description);
            });
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            data = data.join("\n");
            return message.channel.send("List of all commands: \n" + "```" + data + "```");
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push("\n" + prefix + command.name + ' - ' + command.description);
        data.push(`\nYou can send ${prefix}help to get list of all commands`);

        data = data.join("\n");

        message.channel.send("```" + data + "```");
    },
};