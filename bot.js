let fs = require('fs');
let botconfig = JSON.parse(fs.readFileSync('botconfig.json', 'utf8'));
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = botconfig.prefix;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let isLive = false;
let timer;
let embed;

function startTimerGG() {
    if (botconfig.channel_discord != '' && botconfig.channel_gg != '') {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", 'http://api2.goodgame.ru/streams/' + botconfig.channel_gg, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(xhr.responseText);
                if (data.status == 'Live' && isLive == false) {
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
                }
                if (data.status == 'Dead' && isLive == true) {
                    isLive = false;
                }
            }
        };
        xhr.send();
    }
}

function rewriteJson(discord, channel) {
    let content;
    let contents = fs.readFileSync('botconfig.json', 'utf8');
    content = JSON.parse(contents);
    content.channel_discord = discord;
    content.channel_gg = channel;
    content = JSON.stringify(content);
    fs.writeFileSync("botconfig.json", content);
}

client.on('ready', () => {
    timer = setInterval(startTimerGG, 10000);
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(botconfig.activity);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot
        || !message.member.roles.some(r => ["moderator"].includes(r.name))) return;
    message.content = message.content.slice(1);
    console.log(message.member.user.tag);
    if (message.member.user.tag == 'Захар#6967') {
        const emoji = message.guild.emojis.find('name', 'hahaa');
        message.react(emoji);
    }
    let params = message.content.split(' ');
    if (params.length == 3 && params[0] == 'notify' && params[1] == 'delete'
        && params[2] == botconfig.channel_gg) {
        rewriteJson('', '');
        message.channel.send('Канал ' + params[2] + ' больше не отслеживается');
        botconfig = JSON.parse(fs.readFileSync('botconfig.json', 'utf8'));
    }
    else if (params.length == 3 && params[0] == 'notify' && params[1] == 'delete') 
        message.channel.send('Неверное имя канала');
    if (params.length == 2 && params[0] == 'notify') {
        rewriteJson(message.channel.id, params[1]);
        message.channel.send('Канал ' + params[1] + ' отслеживается');
        botconfig = JSON.parse(fs.readFileSync('botconfig.json', 'utf8'));
    }
    if (message.content == 'current') {
        message.channel.send('Текущий отслеживаемый канал: ' + botconfig.channel_gg);
    }
    if (params.length > 1 && params[0] == 'setactivity') {
        params.shift();
        let activity = params.join(' ');
        client.user.setActivity(activity);
        let content;
        let contents = fs.readFileSync('botconfig.json', 'utf8');
        content = JSON.parse(contents);
        content.activity = activity;
        content = JSON.stringify(content);
        fs.writeFileSync("botconfig.json", content);
    }
});

client.login(botconfig.token);

