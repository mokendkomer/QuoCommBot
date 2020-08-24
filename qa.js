const config = require('./config.json')
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    if(message.channel.type === "dm"){
        if(message.content.toLowerCase().startsWith('q.ask')){
            client.guilds.cache.get('587139618999369739').channels.cache.get('587321519051636776').send("<@" + message.author.id + "> asks " + message.content.substring(6));
            client.guilds.cache.get('587139618999369739').channels.cache.get('639902815849938975').send(message.content.substring(6));
            message.channel.send(`Thank you for your question!`);
        }
    }
});

client.login(config.token);
