const config = require('../config.json')
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

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
  if(reaction.message.id === "777549816477515806"){
      if(reaction.emoji.name === "Magic"){
        const bigRole = reaction.message.guild.roles.cache.get('765984759431430254');
        reaction.message.guild.member(user).roles.add(bigRole)
        user.send(`You now have the Among Us role, and will be pinged for future games!`)
      } else reaction.remove();
  }
});
client.on('messageReactionRemove', async (reaction, user) => {
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
  if(reaction.message.id === "777549816477515806" && reaction.emoji.name === "Magic"){
    const bigRole = reaction.message.guild.roles.cache.get('765984759431430254');
    reaction.message.guild.member(user).roles.remove(bigRole)
    user.send(`You now have lost the Among Us role, and will not be pinged for future games.`)
  }
});

client.login(config.maisToken);