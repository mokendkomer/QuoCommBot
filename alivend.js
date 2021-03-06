const config = require('../config.json')
const Discord = require("discord.js");
const { clearTimeout } = require("timers");
const client = new Discord.Client();
const fs = require('fs')
const file = '../alivend.json'
let timer;
let canAliven = true;
const resetTimer = () => {
	clearTimeout(timer);
    timer = setTimeout(() => {
		let data = JSON.parse(fs.readFileSync(file));
        client.channels.cache.get('587152863373819904').send(data[0][data[1]]);
		data[1] += 1;
        if(data[1] === data[0].length - 1)
			data[1] = 0
		fs.writeFileSync(file, JSON.stringify(data));
    }, 1200000);
}
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    if((message.author.id === "689377680210264075" || message.author.id === "314427251502350337") && message.content.toLowerCase().startsWith('q.ban') && message.mentions.members.size){
        let embed = new Discord.MessageEmbed();
        embed.title = `${message.mentions.members.first().displayName} has been banned`
        message.channel.send({embed})
        embed.title = `Just kidding, they're right here`
        setTimeout(() => message.channel.send({embed}), 10000)
    }
    if(message.channel.id === '587152863373819904' && message.author.id !== client.user.id)
    resetTimer();   
    if(message.channel.id === '587152863373819904' && message.content.toLowerCase() === "q.aliven"){
        if (!canAliven){
            message.channel.send(`Can't aliven chat yet`)
            return;
        }
		clearTimeout(timer);
		let data = JSON.parse(fs.readFileSync(file));
        client.channels.cache.get('587152863373819904').send(data[0][data[1]]);
		data[1] += 1;
        if(data[1] === data[0].length - 1)
			data[1] = 0
		fs.writeFileSync(file, JSON.stringify(data));
        canAliven = false;
        setTimeout(() => {
            canAliven = true;
        }, 60000);
    }
});

client.login(config.token)

