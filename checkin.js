const config = require('../config.json');
const Discord = require("discord.js");
const cron = require('node-cron');
const fs = require("fs");
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});
const emotes = ["❤️", "🧡", "💛", "🤍", "🖤", "💚", "💙", "💜", "💔"]
const mods = ["801392764390604840", "392271349860663297", "314427251502350337", "452437719516315649", "389779718473515008", "689377680210264075", "719155027171606538"]
const webhook = new Discord.WebhookClient(config.webhookID, config.webhookToken)
const defaultPrompt = `How are you feeling today?\n\n:heart:  - Amazing\n:orange_heart: - Good\n:yellow_heart: - Fine/Okay\n:white_heart: - Neutral\n:black_heart: - I don't know how I'm feeling right now\n:green_heart: - Meh\n:blue_heart: - I'm struggling right now\n:purple_heart: - I'm having a really hard time and need somebody to talk to\n:broken_heart: - I'm at my lowest, and in a really dark place right now.`
const shouldRemind = () => client.channels.cache.get('749244006705397761').messages.fetch({
	limit: 1
}).then(messages => new Date(messages.first().createdTimestamp).getDay() !== new Date().getDay())

client.on('message', async message => {
	if (message.channel.id === "749244006705397761" && (message.content.toLowerCase().includes('💙') || message.content.toLowerCase().includes('blue_heart'))) {
		emotes.forEach(emote => message.react(emote))
	}

	if (message.channel.id === `697745992463810601` && message.mentions.roles.first() && message.member.permissions.has('MANAGE_MESSAGES')) {
		message.channel.messages.fetchPinned().then(ez => ez.forEach(msg => msg.unpin()));
		setTimeout(() => {
			message.pin();
		}, 500);
	}
	if (message.content.toLowerCase().startsWith(`q.setprompt`) && mods.includes(message.author.id)) {
		if (message.content.length > 1600)
			return message.channel.send(`:warning: Your prompt is too long. Keep it below 1600 characters.`);
		const prompt = message.content.substring(12)
		let content = require("../checkin.json")
		content.find(ez => ez.id === message.author.id).prompt = prompt

		fs.writeFile("../checkin.json", JSON.stringify(content), (err) => {
			if (err)
				return message.channel.send('Something bad happened')
			message.channel.send(`You have updated your prompt successfully.`)
		})
	}
	if (message.content.toLowerCase().startsWith(`q.getprompt`) && mods.includes(message.author.id)) {
		const prompts = require('../checkin.json')
		message.channel.send(prompts.find(ez => ez.id === message.author.id).prompt)
	}
	if (message.content === "q.startsim" && mods.includes(message.author.id)) {
		message.channel.send(`:warning: Test simulation started. Stay alert.`)
		const modID = message.author.id
		const embed = new Discord.MessageEmbed()
		embed.setTitle(`It's your turn to check in!`)
		embed.setDescription(`This is a reminder for you to check in.\nReact to this message if you want me to do it for you.`)
		client.users.cache.get(modID).send({
			embed
		}).then((message) => message.react(`⚪`))
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (user.id === client.user.id)
		return;
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

	if (reaction.message.channel.id === "749244006705397761" && !emotes.includes(reaction.emoji.name))
		return reaction.remove();

	if (reaction.emoji.name === "⚪" && reaction.message.channel.type === "dm" && mods.includes(user.id)) {
		const prompts = require('../checkin.json')
		const prompt = `${defaultPrompt} \n\n ${prompts.find(ez => ez.id === user.id).prompt}`

		webhook.send(prompt, {
			username: client.guilds.cache.get('587139618999369739').member(user.id).nickname,
			avatarURL: user.avatarURL()
		}).then(() => reaction.message.channel.send(`Your checkin was completed successfully.`))
	}
})

cron.schedule('0 15 * * *', async () => {
	const modID = mods[new Date().getDay()]
	if (!await shouldRemind())
		return;
	const embed = new Discord.MessageEmbed()
	embed.setTitle(`It's your turn to check in!`)
	embed.setDescription(`This is a reminder for you to check in.\nReact to this message if you want it to be automated.`)
	client.users.cache.get(modID).send({
		embed
	}).then((message) => message.react(`⚪`))
});

cron.schedule('0 17 * * *', async () => {
	if (!await shouldRemind)
		return;
	const mod = client.guilds.cache.get('587139618999369739').member(mods[new Date().getDay()])
	const prompts = require('../checkin.json')
	const prompt = `${defaultPrompt} \n\n ${prompts.find(ez => ez.id === mod.id).prompt}`
	webhook.send(prompt, {
		username: mod.displayName,
		avatarURL: mod.user.avatarURL()
	}).then(() => mod.send(`Your checkin was completed automatically as you hadn't done it in time.`))
})

client.login(config.canaryToken)