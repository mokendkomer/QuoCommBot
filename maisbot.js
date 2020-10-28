const config = require('../config.json')
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`) 
  
});

client.on('message', (message) =>{
  if(message.channel.type === "dm" && !message.author.bot){
    const embed = new Discord.MessageEmbed();
    embed.setAuthor(message.author.username, message.author.avatarURL())
    embed.setTitle(message.content)
    if(message.attachments.first())
        embed.setImage(message.attachments.first().url)
    client.channels.cache.get('771066205195731037').send({embed})
  } else if(message.author.id === "591006026166173707" && message.channel.id === "642034738818711563"){
    message.react("🧟")
    message.react("🎃")
    message.react("👻")
    message.react("🎂")
  }
})

client.on('messageReactionAdd', async (reaction, user) => {
      // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
  }

    if(reaction.message.author.id === "591006026166173707" && reaction.message.channel.id === "642034738818711563" && !user.bot){
        if(reaction.emoji.name === "🧟"){
            const bigRole = reaction.message.guild.roles.cache.get('765966522988363827');
            reaction.message.guild.member(user).roles.add(bigRole)
            user.send(`HAPPY HALLOWEEN! 🎃\nYou now have the Halloweenies role, we hope you enjoy all our updates as you celebrate halloween with the Kendra Kat Foundation! 👻`)
        } else if(reaction.emoji.name === "👻"){
            const smallRole = reaction.message.guild.roles.cache.get('765984291951345674');
            reaction.message.guild.member(user).roles.add(smallRole)
            user.send(`You are now taking part in our Costume Competition! Best of luck 👻`)
        } else if(reaction.emoji.name === "🎂"){
          const bakeRole = reaction.message.guild.roles.cache.get('765984633845710918');
          reaction.message.guild.member(user).roles.add(bakeRole)
          user.send('You are now taking part in our Baking Competition! Show us what you have in store! 👀')
        } else if(reaction.emoji.name === "🎃"){
          const carveRole = reaction.message.guild.roles.cache.get('765977575591378954');
          reaction.message.guild.member(user).roles.add(carveRole)
          user.send('You are now taking part in our Pumpkin Carving Competition! Time for some spoooooooky creativity 🎃')
        } else{
          reaction.remove();
        }
    } 
});

client.login(config.maisToken);