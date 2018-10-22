let fs = require('fs');
let botconfig = require('./botconfig.json');
let isLive = true;
let timer;
let embed;
const Discord = require("discord.js");
const prefix = botconfig.prefix;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

function checkChannelOnline() {
    if (botconfig.channel_discord !== '' && botconfig.channel_gg !== '') {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", 'http://api2.goodgame.ru/streams/' + botconfig.channel_gg, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                data = JSON.parse(xhr.responseText);
                if (data.status === 'Live' && isLive === false) {
                    embed = new Discord.RichEmbed()
                        .setColor('#233056')
                        .setTitle('Stream online')
                        .setURL(data.url)
                        .setAuthor(data.key, null, data.url)
                        .setDescription('Hey @everyone ' + data.key + ' is now live! ' + data.url)
                        .setImage('https:' + data.channel.thumb)
                        .setTimestamp();
                    client.channels.get(botconfig.channel_discord).send("@everyone", embed);
                    isLive = true;
                    saveStreamDate();
                }
                if (data.status === 'Dead' && isLive === true) {
                    isLive = false;
                }
            }
        };
        xhr.send();
    }
}

function requireUncached(module){
    delete require.cache[require.resolve(module)];
    return require(module);
}

client.on('ready', () => {
    timer = setInterval(checkChannelOnline, 10000);
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(botconfig.activity);
});

client.on("messageDelete", (messageDelete) => {
    client.channels.get('496339158525018122').send(`The message : "${messageDelete.content}" by ${messageDelete.author.tag} was deleted.`)
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot
        || !message.member.roles.some(r => ["moderator"].includes(r.name))) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(client, message, args, botconfig, isLive);
        botconfig = requireUncached('./botconfig.json');
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});

client.login(botconfig.token);

function saveStreamDate()
{
    const Writer = require('./writer.js');
    let now = new Date();
    console.log(now);
    let config = {
        last_stream_date: now.toISOString()
    };
    let writer = new Writer();
    writer.writeFile('./botconfig.json', config);
}