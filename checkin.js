const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('message', message => {
    if(message.channel === "749244006705397761" && message.content.toLowerCase().includes("how are you feeling today")){
        message.react('❤️')
        message.react('🧡')
        message.react('💛')
        message.react('🤍')
        message.react('🖤')
        message.react('💚')
        message.react('💙')
        message.react('💜')
        message.react('💔')
    }
});

client.on('error', err => console.log(err))

client.login(config.token)
