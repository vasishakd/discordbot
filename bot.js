let fs = require('fs');
let botconfig = require('./botconfig.json');
let xp = require("./xp.json");
let isLive = true;
let timer;
let embed;
const Discord = require("discord.js");
const prefix = botconfig.prefix;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const client = new Discord.Client();
let express = require('express');
let app = express();

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
                        .setImage('http:' + data.channel.thumb)
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

function requireUncached(module) {
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

    if (message.author.bot) return;

    addXp(message.author.id);

    if (!message.content.startsWith(prefix)) return;

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

function saveStreamDate() {
    const Writer = require('./writer.js');
    let now = new Date();
    let config = {
        last_stream_date: now.toISOString()
    };
    let writer = new Writer();
    writer.writeFile('./botconfig.json', config);
}

function addXp(authorId) {
    let xpAdd = 25;

    if (!xp[authorId]) {
        xp[authorId] = {
            xp: 0,
            level: 1
        };
    }

    let curxp = xp[authorId].xp;
    let curLvl = xp[authorId].level;
    let nxtLvl = xp[authorId].level * 250;

    xp[authorId].xp = curxp + xpAdd;

    if (nxtLvl <= xp[authorId].xp) {
        xp[authorId].xp = 0;
        xp[authorId].level = curLvl + 1;
    }

    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
        if (err) console.log(err)
    });
}

app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});

app.get('/api/top', function (req, res) {
    let top = [];
    let username;

    for (user in xp) {
        if (client.users.get(user)) {
            username = client.users.get(user).username;
            top.push({name: username, level: xp[user].level});
        }
    }

    top.sort(function (a, b) {
        return b.level - a.level;
    });

    res.jsonp(top);
});
