const config = require('../config.json')
const Discord = require('discord.js');
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});
const disclose = (personman, contest, index) => {
	client.channels.cache.get('772312322797862922').send(`${personman.username} voted for ${contest}`)
	let bakingString = ""
	let costumeString = ""
	let pumpkinString = ""
	baking.forEach((value, index) => bakingString += `\n option ${index + 1}: ${value} votes`)
	costume.forEach((value, index) => costumeString += `\n option ${index + 1}: ${value} votes`)
	pumpkin.forEach((value, index) => pumpkinString += `\n option ${index + 1}: ${value} votes`)
	embed.fields = []
	embed.addField('Baking', bakingString)
	embed.addField('costume', costumeString)
	embed.addField('pumpkin', pumpkinString)
	client.channels.cache.get('772312322797862922').send({embed})

} 
let embed = new Discord.MessageEmbed();
let baking = [0]
let costume = [0, 0, 0, 0, 0]
let pumpkin = [0, 0, 0, 0, 0, 0]
let bakingVoted = []
let costumeVoted = []
let pumpkinVoted = []

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
	if(user.bot)
		return;
	if (reaction.message.channel.id === "772306536331477012") {
		if (reaction.emoji.name === "☑️") {
			if (bakingVoted.includes(user.id))
				user.send('You cannot vote for two submissions! Only your first vote is valid. If for whatever reason that was a mistake, please DM <@392271349860663297> :)')
			else {
				if (reaction.message.id === "772307868510060554")
					baking[0] = baking[0] + 1;
				bakingVoted.push(user.id)
				disclose(user, "baking")
			}
		}
		reaction.users.remove(user.id);
	}
	if (reaction.message.channel.id === "772306605592805396") {
		if (reaction.emoji.name === "☑️") {
			if (costumeVoted.includes(user.id))
				user.send('You cannot vote for two submissions! Only your first vote is valid. If for whatever reason that was a mistake, please DM <@392271349860663297> :)')
			else {
				if (reaction.message.id === "772309808320741416")
					costume[0] = costume[0] + 1;
				if (reaction.message.id === "772309827363667969")
					costume[1] = costume[1] + 1;
				if (reaction.message.id === "772309846489432094")
					costume[2] = costume[2] + 1;
				if (reaction.message.id === "772309864328069140")
					costume[3] = costume[3] + 1;
				if (reaction.message.id === "772309883328135178")
					costume[4] = costume[4] + 1;
				costumeVoted.push(user.id)
				disclose(user, "costume")
			}
		}
		reaction.users.remove(user.id);
	}
	if (reaction.message.channel.id === "772306686735155207") {
		if (reaction.emoji.name === "☑️") {
			if (pumpkinVoted.includes(user.id))
				user.send('You cannot vote for two submissions! Only your first vote is valid. If for whatever reason that was a mistake, please DM <@392271349860663297> :)')
			else {
				if (reaction.message.id === "772308367821373470")
					pumpkin[0] = pumpkin[0] + 1;
				if (reaction.message.id === "772308439191912468")
					pumpkin[1] = pumpkin[1] + 1;
				if (reaction.message.id === "772308462167654400")
					pumpkin[2] = pumpkin[2] + 1;
				if (reaction.message.id === "772308481955856384")
					pumpkin[3] = pumpkin[3] + 1;
				if (reaction.message.id === "772309010128175125")
					pumpkin[4] = pumpkin[4] + 1;
				if (reaction.message.id === "772309506230583346")
					pumpkin[5] = pumpkin[5] + 1;
				pumpkinVoted.push(user.id)
				disclose(user, "pumpkin")
			}
		}
		reaction.users.remove(user.id);
	}
})

client.login(config.maisToken);