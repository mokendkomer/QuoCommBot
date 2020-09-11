const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => console.log('im ready'))

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.message.guild.id === "587139618999369739"){
        reaction.message.guild.channels.cache.get("587219379456966701").send(`${user.username} reacted with ${reaction.emoji.name} in ${reaction.message.channel}`)
    }
})

client.login(config.canaryToken);
