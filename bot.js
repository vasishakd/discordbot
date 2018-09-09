let fs = require('fs');
let botconfig = JSON.parse(fs.readFileSync('botconfig.json', 'utf8'));
const Discord = require("discord.js");
const path = require('path');
const client = new Discord.Client();
const prefix = botconfig.prefix;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let isLive = false;
let timer;

// function startTimerTwitch() {
// 	let xhr = new XMLHttpRequest();
// 	xhr.open("GET", 'https://api.twitch.tv/kraken/streams/148731820', false);
// 	xhr.setRequestHeader('Client-ID', 'azimmnurr17ca1kn1vsiwqeimhpob9');
// 	xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
// 	xhr.onreadystatechange = function() {
// 		if (this.readyState == 4 && this.status == 200) {
// 			data = JSON.parse(xhr.responseText);
//             console.log(data.stream);
//             clearInterval(timer);
//         }
// 	};
// 	xhr.send();
// }

function startTimerGG() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", 'http://api2.goodgame.ru/streams/' + botconfig.channel_gg, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(xhr.responseText);
			if (data.status == 'Live' && isLive == false) {
				client.channels.get(botconfig.channel_discord).send('@everyone '+ data.url + ' go live');
				isLive = true;
			}
			if (data.status == 'Dead' && isLive == true) {
				isLive = false;
			}
        }
	};
	xhr.send();
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
  client.user.setActivity("Alive");
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  let params = message.content.split(' ');
  if (message.content === prefix + 'ping') {
    message.channel.send(message.channel.id);
  }
  if (params.length == 2 && params[0] == prefix + 'notify') {
    rewriteJson(message.channel.id, params[1]);
    message.channel.send('Канал '+ params[1] + ' отслеживается');
    botconfig = botconfig = JSON.parse(fs.readFileSync('botconfig.json', 'utf8'));
  }
  });

client.login(botconfig.token);

