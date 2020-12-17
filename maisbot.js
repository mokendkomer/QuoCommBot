const config = require('../config.json')
const Discord = require('discord.js');
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});

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
	if (reaction.message.id === "777549816477515806") {
		if (reaction.emoji.name === "Magic") {
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
	if (reaction.message.id === "777549816477515806" && reaction.emoji.name === "Magic") {
		const bigRole = reaction.message.guild.roles.cache.get('765984759431430254');
		reaction.message.guild.member(user).roles.remove(bigRole)
		user.send(`You now have lost the Among Us role, and will not be pinged for future games.`)
	}
});
client.on('message', async message => {
	if (message.author.bot)
		return;
	if (message.channel.id === "788716185410601001") {
		forward(message, client.channels.cache.get('788717896922038282'), `Your letter has been received at the post office!`)
		setTimeout(() => message.delete(), 500)

	}
	if (message.channel.id === "788716405411414016") {
		if(message.attachments.array().length)
			forward(message, client.channels.cache.get('788718012168798219'), `Your tree has been submitted for the contest!`, `Your submission didn't include a picture. Please try again and send a picture of your tree this time`)
		else
			forward(message, client.channels.cache.get('788718012168798219'), `Your submission didn't include a picture. Please try again and send a picture of your tree this time.`)
		setTimeout(() => message.delete(), 500)
	}
})

const forward = async (message, channel, dialog) => {
		channel.send(`${message.author.tag} sent:`)
		if(message.content)
			channel.send(message)
		if (message.attachments.array().length) {
			channel.send({ files: [message.attachments.array()[0] ] })
			// message.attachments.forEach((attachment) => channel.send({
			// 	files: [attachment]
			// }))
		}
		message.author.send(dialog);
}


client.login(config.maisToken);