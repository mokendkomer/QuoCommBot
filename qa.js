const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    if(message.channel.type === "dm"){
        if(message.content.toLowerCase().startsWith('q.ask')){
            client.channels.cache.get('587219379456966701').send(`${client.guilds.cache.get('587139618999369739').member(message.author.id).displayName} asks ${message.content.substring(6)}`);
            client.channels.cache.get('639902815849938975').send(message.content.substring(6));
            message.channel.send(`Thank you for your question!`);
        }
        else if(message.content.toLowerCase().startsWith('q.vent1')){
            client.channels.cache.get('587219379456966701').send(`${client.guilds.cache.get('587139618999369739').member(message.author.id).displayName} vents ${message.content.substring(8)} in vent 1`);
            client.channels.cache.get('739150769722228806').send(message.content.substring(8));
            message.channel.send(`Your message has been sent. Take care!`);
        }
        else if(message.content.toLowerCase().startsWith('q.vent ')){
            client.channels.cache.get('587219379456966701').send(`${client.guilds.cache.get('587139618999369739').member(message.author.id).displayName} vents ${message.content.substring(7)} in vent 1`);
            client.channels.cache.get('739150769722228806').send(message.content.substring(7));
            message.channel.send(`Your message has been sent. Take care!`);
        }
        else if(message.content.toLowerCase().startsWith('q.vent2')){
            client.channels.cache.get('587219379456966701').send(`${client.guilds.cache.get('587139618999369739').member(message.author.id).displayName} vents ${message.content.substring(8)} in vent 2`);
            client.channels.cache.get('793407631066005554').send(message.content.substring(8));
            message.channel.send(`Your message has been sent. Take care!`);
        }
    }
});

client.login(config.anonToken);
