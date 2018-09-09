const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = botconfig.prefix;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Alive");
});

client.on('message', msg => {
  if (msg.content === prefix + 'ping') {
    client.channels.get('488064339421691936').send('@everyone Pong')
  }
});

client.login(botconfig.token);