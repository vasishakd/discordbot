const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = botconfig.prefix;
const TwitchWebhook = require('twitch-webhook')
 
const twitchWebhook = new TwitchWebhook({
    client_id: 'azimmnurr17ca1kn1vsiwqeimhpob9',
    callback: 'http://18.185.154.61/bot.js',
    secret: 'erzxvfbydoln1bb500u0rhk5bvorxa', // default: false
    lease_seconds: 259200,    // default: 864000 (maximum value)
})
 
// set listener for all topics
twitchWebhook.on('*', ({ topic, options, endpoint, event }) => {
    // topic name, for example "streams"
    console.log(topic)
    // topic options, for example "{user_id: 12826}"
    console.log(options)
    // full topic URL, for example
    // "https://api.twitch.tv/helix/streams?user_id=12826"
    console.log(endpoint)
    // topic data, timestamps are automatically converted to Date
    console.log(event)
})
 
// set listener for topic
twitchWebhook.on('users/follows', ({ event }) => {
    console.log(event)
})
 
// subscribe to topic
twitchWebhook.subscribe('users/follows', {
    first: 1,
    from_id: 148731820 // ID of Twitch Channel ¯\_(ツ)_/¯
})
 
// renew the subscription when it expires
twitchWebhook.on('unsubscibe', (obj) => {
  twitchWebhook.subscribe(obj['hub.topic'])
})
 
// tell Twitch that we no longer listen
// otherwise it will try to send events to a down app
process.on('SIGINT', () => {
  // unsubscribe from all topics
  twitchWebhook.unsubscribe('*')
 
  // or unsubscribe from each one individually
  twitchWebhook.unsubscribe('users/follows', {
    first: 1,
    to_id: 12826
  })
 
  process.exit(0)
})

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