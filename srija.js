const Discord = require("discord.js");
const config = require('./config.json')
const client = new Discord.Client();
let isStudying = 0;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if(message.channel.type === 'dm' && (message.author.id === "689377680210264075" || message.author.id === "314427251502350337") && message.content.toLowerCase().includes(`study`)){
    if(isStudying === 0){
      isStudying = 1;
      message.react('🌞')
    }
    else {
      isStudying = 0;
      message.react('🌝')
    }
  }
  if(isStudying === 1 && message.author.id === "689377680210264075" && message.channel.type === "text" && message.guild.id === "587139618999369739"){
    message.channel.send(`<@${message.author.id}> go back to studying :dagger:`);
  }
});

client.login(config.token);
