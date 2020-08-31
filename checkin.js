const config = require('../config.json');
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('message', message => {
    if(message.channel.id === "587321519051636776" && message.content.toLowerCase().includes("q.checkin")){
        try{
            message.channel.send(`
            *How are you feeling today?*\n
            :hearts: - Amazing\n
            :orange_heart: - Good\n
            :yellow_heart: - Fine/Okay\n
            :white_heart: - Neutral\n
            :black_heart: - I don't know how I'm feeling right now\n
            :green_heart: - Meh\n
            :blue_heart: - I'm struggling right now\n
            :purple_heart: - I'm having a really hard time and need somebody to talk to\n
            :broken_heart: - I'm at my lowest, and in a really dark place right now\n
            `).then(sentMessage => {
                sentMessage.react('❤️');
                sentMessage.react('🧡');
                sentMessage.react('💛');
                sentMessage.react('🤍');
                sentMessage.react('🖤');
                sentMessage.react('💚');
                sentMessage.react('💙');
                sentMessage.react('💜');
                sentMessage.react('💔');
            })
            message.delete();
        } catch(err){console.log(err)}
    }
});

client.on('error', err => console.log(err))

client.login(config.canaryToken)
