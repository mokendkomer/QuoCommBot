const config = require('../config.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const channel = "749244006705397761";

client.on('message', message => {
    if(message.channel.id === channel && message.content.toLowerCase().includes("💙")){
        try{
                message.react('❤️');
                message.react('🧡');
                message.react('💛');
                message.react('🤍');
                message.react('🖤');
                message.react('💚');
                message.react('💙');
                message.react('💜');
                message.react('💔');
        } catch(err){console.log(err)}
    }
});

client.on('error', err => console.log(err))

client.login(config.canaryToken)
