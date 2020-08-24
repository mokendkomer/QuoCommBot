const config = require('../config.json')
const cleverbot = require("cleverbot-free");
const Discord = require("discord.js");
const client = new Discord.Client();
let context = ['hey', 'How are you?', 'foine', 'Fine!'];

client.on('message', message => {
    if(message.channel.id === "590111101115432960" && !message.author.bot){
        message.channel.startTyping();
        cleverbot(message.content, context).then(res => {
            message.channel.send(res)
            context.shift();
            context.shift();
            context.push(message.content);
            context.push(res);
        });
        message.channel.stopTyping();
    }
})

client.login(config.alishaToken);
