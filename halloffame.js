const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

const finalize = (id, reaction) => {
	id = client.channels.cache.get(id)
	sendEmbed(reaction.message, id);
	if (reaction.message.attachments.first()) {
		reaction.message.attachments.forEach(att => {
			if (att.url.indexOf("png", att.url.length - 3) !== -1 || att.url.indexOf("jpg", att.url.length - 3) !== -1 || att.url.indexOf("gif", att.url.length - 3) !== -1 || att.url.indexOf("jpeg", att.url.length - 4) !== -1)
				sendImage(att.url, id)
			else
				sendFile(att.url, id)
		})
	}

}

const sendEmbed = (message, id) => {
	try {
		let embed = {};
		embed.author = {
			name: message.member.displayName,
			icon_url: message.author.avatarURL()
		};
		if (message.content)
			embed.description = `**${message.content}**\nclick [here](${message.url}) to jump to the message`
		else
			embed.description = `click [here](${message.url}) to jump to the message`
		id.send({
			embed
		}).then(ez => {
			if(ez.channel.id === "766626502300532743")
				ez.react('☑️')
		})
		message.react('⭐')
	} catch (err) {
		message.channel.send('Something went wrong')
	}
}

const sendImage = (img, id) => {
	try {
		let embed = {
			image: {
				url: ""
			}
		};
		embed.image.url = img;
		id.send({
			embed
		}).then(ez => {
			if(ez.channel.id === "766626502300532743")
				ez.react('☑️')
		})
	} catch (err) {
		console.log(err)
	}
}

const sendFile = (file, id) => {
	try {
		id.send({
			files: [file]
		}).then(ez => {
			if(ez.channel.id === "766626502300532743")
				ez.react('☑️')
		})
	} catch (ez) {
		let embed = {};
		embed.description = file;
		id.send({
			embed
		}).then(ez => {
			if(ez.channel.id === "766626502300532743")
				ez.react('☑️')
		})
	}
}

client.on("ready", () => {
	client.user.setActivity("out for you", {
		type: "WATCHING"
	});
	console.log('ready')
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
  if (!reaction.me && (reaction.emoji.name === "⭐" && reaction.count === 2) || (reaction.emoji.name === "🏆" && reaction.message.guild.member(user).roles.cache.get('587184713387606017'))){
	  if(reaction.emoji.name === "⭐")
		  finalize('766626502300532743', reaction)
	  if(reaction.emoji.name === "🏆")
		  finalize('678682538637525032', reaction)
  }
	else if (!user.bot && reaction.emoji.name === "☑️" && reaction.count < 3 && reaction.message.channel.id === "766626502300532743" && reaction.message.guild.member(user).roles.cache.get("587144276891140107")){
		client.channels.cache.get('678682538637525032').send(reaction.message, {embed: reaction.message.embeds[0]})
	}

});

client.login(config.canaryToken);