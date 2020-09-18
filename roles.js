const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const emojiname = ["🔫","✏️","🗡️","🎤","🎵","❓","⚔️","🤖","🃏","🔒"];
const rolename = ["PUBG","Skribbl","Among Us","Karaoke","SingSong","Hunter","Debater","Alisha Talk","Dark Humor","Locked Down"];
// client.on("ready", () => {
//   console.log(`Logged in as ${client.user.tag}!`);
//   let embed = {};
//   embed.author = {
// 		name: 'Get yourself some roles!',
// 		icon_url: client.user.avatarURL()
//   };
//   embed.title = "To assign yourself a role, please react with its corresponding emote:"
//   embed.description = `
// :gun: - To participate in PUBG games.\n
// :pencil2: - To participate in Skribbl.io games.\n
// :dagger: - To participate in Among Us games.\n
// :microphone: - To get pings for karaoke events.\n
// :musical_note: - To get pings when talented singers are performing.\n
// :question: - To get pings for quiz and hunt events.\n
// :crossed_swords: - To get pings for debates.\n
// :robot: - To talk to Alisha Talk, our AI robot.\n
// :black_joker: - To see the dark-humour and roast-me channels (not for those easily offended).\n
// :lock: - If you're in COVID-19 (Coronavirus) lockdown.\n
// **DM <@519927226280443928> if you want access to our restricted face-reveal channel.**
// `
//   client.channels.cache.get('587923888177152003').send({embed}).then(message => {
//     try{
//       emojiname.forEach(emote => message.react(emote))
//     }
//     catch(e){console.log(e)}
//   })
// });


client.on("messageReactionAdd", async (reaction, user) => {
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

  if (reaction.message.channel.id === "587923888177152003" && user && !user.bot && reaction.message.channel.guild){
    for (let o in emojiname)
    if (reaction.emoji.name == emojiname[o]) {
      let i = reaction.message.guild.roles.cache.find(e => e.name == rolename[o]);
      if(reaction.message.guild.member(user).roles.cache.some(role => role.name == rolename[o]))
      reaction.message.guild.member(user).roles.remove(i).catch(console.error)
      else
      reaction.message.guild.member(user).roles.add(i).catch(console.error)
    }
    setTimeout(() => {
      reaction.users.remove(user.id);
    }, 5000);
  }
});

client.login(config.token);
