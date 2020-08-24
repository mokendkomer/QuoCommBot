const config = require('./config.json')
const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log("ez");
})

client.on("message", (message) => {
    let gays = JSON.parse(fs.readFileSync('afk.json'));
    if(gays.some(boi => boi.id === message.author.id)){
        let man = gays.find(boi => boi.id === message.author.id);
        gays.splice(gays.findIndex(boi => boi.id === message.author.id), 1)
        fs.writeFileSync('afk.json', JSON.stringify(gays));
        if(man.mentions.length){
            let mentions = "";
            man.mentions.forEach(mention => mentions = mentions + "\n" + mention)
            message.author.send("You are now afkn't \nThe people who mentioned you while you were gone are:" + mentions)
        }
        else message.author.send("You are now afkn't")
    }
    else if(message.mentions.users.first()){
        message.mentions.users.forEach(mentioned => gays.forEach(gay => {
            if(mentioned.id === gay.id){
                message.channel.send("`" + gay.tag +'` is afk \n`' + gay.afkMsg + '`');
                if(!gay.mentions.some(ban => ban === message.author.tag)){
                    gay.mentions.push(message.author.tag)
                    fs.writeFileSync('afk.json', JSON.stringify(gays));
                }
            }
        }))
    }
    if(message.content.toLowerCase().startsWith('q.afk')){
        fs.writeFileSync('afk.json', JSON.stringify([...JSON.parse(fs.readFileSync('afk.json')), {id: message.author.id, tag: message.author.tag, afkMsg: message.content.substr(6), mentions: []}]));
        message.channel.send("`" + message.author.tag + "` is now afk")
    }

});

client.login(config.token);
