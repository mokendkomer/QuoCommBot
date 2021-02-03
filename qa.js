const config = require('../config.json')
const Discord = require("discord.js");
const mysql = require('mysql');
const client = new Discord.Client();
const connection = mysql.createConnection(config.mysql);


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    if(message.channel.type !== "dm")
      return;
      const args = message.content.toLowerCase().split(" ")
      if(
        args[0] !== "q.ask" &&
        args[0] !== "q.vent" &&
        args[0] !== "q.vent1" &&
        args[0] !== "q.vent2" &&
        args[0] !== "q.report"

        ) return;
        connection.query(`select verified, not isnull(mu.id) as muted, name from members m left join mutes mu using (id) where id = ?`, [message.author.id], function (error, result) {
          if(error)
          return;
          if (!result.length)
          return;
          if(result[0].verified !== 1){
            message.channel.send(`Who even are you?`)
            return;
          }
          let channel = "", prompt = "", substring = 0;
          if(args[0].toLowerCase() === "q.ask"){
            channel = "639902815849938975";
            prompt = "Thank you for your question!";
            substring = args[0].length + 1;
          }
          if(args[0].toLowerCase() === "q.vent" || args[0].toLowerCase() === "q.vent1"){
            channel = "739150769722228806";
            prompt = "Your message has been sent. Take care!";
            substring = args[0].length + 1;
          }
          if(args[0].toLowerCase() === "q.vent2"){
            channel = "793407631066005554";
            prompt = "Your message has been sent. Take care!";
            substring = args[0].length + 1;
          }
          if(args[0].toLowerCase() === "q.report"){
            substring = args[0].length + 1;
            if(message.content.includes('@everyone') || message.content.includes('@here') || message.content.includes('<@'))
            return message.channel.send(`Your report is not allowed to mention anyone.`)
            client.channels.cache.get('806590123386208326').send(`${client.guilds.cache.get('587139618999369739').member(message.author.id).displayName} reports: ${message.content.substring(substring)}`);
            message.channel.send("The moderators have been notified. Thanks!")
            return;
          }
          if(result[0].muted !== 0){
            return message.channel.send(`You may not do this because you are muted.`)
          }
          if(message.content.includes('@everyone') || message.content.includes('@here') || message.content.includes('<@'))
            return message.channel.send(`Your message is not allowed to ping roles.`)
          client.channels.cache.get('587219379456966701').send(`${client.guilds.cache.get('587139618999369739').member(message.author.id).displayName} sent ${message.content.substring(substring)} in <#${channel}>`);
          client.channels.cache.get(channel).send(`${message.content.substring(substring)}`);
          message.channel.send(prompt);
        })
});

client.login(config.anonToken);
