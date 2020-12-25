const config = require('../config.json')
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const fs = require('fs');
const file = '../votes.json';

client.on('ready', () => {
	console.log('ez')
})

client.on('message', message => {
	if(message.channel.id === "789172861356343316"){
		if(message.content.toLowerCase() === "q.votes"){
			const embed = new Discord.MessageEmbed()
			embed.setTitle(`Votes`)
			let data = JSON.parse(fs.readFileSync(file));
			data.forEach(ez => {
				if(ez === "bad")
					return;
				let data = ""
				ez.candidates.forEach((goi, index) => data += `${goi}: ${ez.voters[index].length}\n`)
				embed.addField(ez.name, data)
			})
			message.channel.send({embed})
		} if(message.content.toLowerCase() === "q.reset"){
			const data = ["bad", {name: "Life of the chat",voters: [[],[],[]],candidates: [["aishah"],["kaviyarasi"],["samad"]]}, {name: "An absolute savage",voters: [[],[],[]],candidates: [["luv"],["divy"],["samad"]]}, {name: "The comedian of the gang",voters: [[],[],[]],candidates: [["luv"],["samad"],["trost"]]}, {name: "Prom King & Queen",voters: [[],[],[]],candidates: [["nadeem", "aishah"],["hardik", "nandini"],["mukund", "srija"]]}, {name: "Most likely to survive a zombie apocalypse",voters: [[],[],[]],candidates: [["nadeem"],["trost"],["amos"]]}, {name: "Best Duo",voters: [[],[],[]],candidates: [["amy", "ahmad"],["aishah", "mais"],["divy", "luv"]]}, {name: "Most intimidating Moderator",voters: [[],[],[]],candidates: [["divy"],["mukund"],["srija"]]}, {name: "My favourite Moderator",voters: [[],[],[]],candidates: [["srija"],["suho"],["samad"]]}, {name: "Has a heart of gold - helpful and selfless",voters: [[],[],[]],candidates: [["sarah"],["nandini"],["saabit"]]}, {name: "Noblest noble",voters: [[],[],[]],candidates: [["ishansh"],["alfred"],["suho"]]}, {name: "Creativity runs through their blood",voters: [[],[],[]],candidates: [["mukund"],["lucifer"],["augustin"]]}, {name: "Einstein's Successor",voters: [[],[],[]],candidates: [["amos"],["rishi"],["nadeem"]]}, {name: "The future millionaire",voters: [[],[],[]],candidates: [["mukund"],["amos"],["aishah"]]}, {name: "Motivational enough to be a TED Speaker",voters: [[],[],[]],candidates: [["aishah"],["suho"],["nadeem"]]}, {name: "Possibly a catfish behind a screen",voters: [[],[],[]],candidates: [["samad"],["amos"],["luv"]]}];
			fs.writeFileSync(file, JSON.stringify(data));
			message.channel.send(`:white_check_mark:  The votes have been reset successfully.`)
		}
	}
})


client.on('messageReactionAdd', async (reaction, user) => {
	if(user.bot)
		return;
	if(reaction.message.channel.id !== "791690981560287232")
		return;
		reaction.users.remove(user.id);
	let data = JSON.parse(fs.readFileSync(file));
	const index = await reaction.message.fetch().then(msg => data.findIndex(a => a.name === msg.embeds[0].title))
	
	if(data[index].voters.some(a => a.includes(user.id))){
		user.send(`:warning:  You have already voted someone for ${data[index].name}.`)
		return;
	}
	let candidate = 3
	if(reaction.emoji.identifier === "%F0%9F%87%A6")
	candidate = 0
	else if(reaction.emoji.identifier === "%F0%9F%87%A7")
	candidate = 1
	else if(reaction.emoji.identifier === "%F0%9F%87%A8")
	candidate = 2
	if(candidate === 3)
		return;
	data[index].voters[candidate].push(user.id)
	fs.writeFileSync(file, JSON.stringify(data));
	user.send(`:white_check_mark:  You have voted ${data[index].candidates[candidate]} for ${data[index].name}`)
		// data[index].voters
})


client.login(config.canaryToken)
