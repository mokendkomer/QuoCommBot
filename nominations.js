const config = require('../config.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const file = '../file.json';


const nominate = (message) => {
	const args = message.content.toLowerCase().slice(2).trim().split(/ +/g);
	const nominee = args.slice(2).join(' ')
	const category = args[1]
	if(isNaN(category)){
		message.channel.send(`:warning:  "${category}" is not a number.\nPlease enter the number assigned to the category you want to nominate someone for.\nFormat: \`q.nominate [category number]  [person's full name]\`\nEg. q.nominate 15 Samad Bilal`)
		return;
	}
	if(category > 15 || category < 1){
		message.channel.send(`:warning:  ${category} is invalid. \nPlease enter the number assigned to the category you want to nominate someone for.\nFormat: \`q.nominate [category number]  [person's full name]\`\nEg. q.nominate 15 Samad Bilal`)
		return;
	}
	if(!nominee){
		message.channel.send(`:warning:  You haven't specified someone to nominate.\nPlease enter the name of the person you want to nominate.\nFormat: \`q.nominate [category number]  [person's full name]\`\nEg. q.nominate 15 Samad Bilal`)
		return;
	}

	let data = JSON.parse(fs.readFileSync(file));
	if(data[category].nominators.includes(message.author.id)){
		message.channel.send(`:warning:  You have already nominated someone for this category.`)
		return;
	}

	data[category].nominators.push(message.author.id)
	data[category].nominees.push(nominee)
	fs.writeFileSync(file, JSON.stringify(data));
	message.channel.send(`:white_check_mark:  You have nominated ${nominee} for ${data[category].name}`)
	const embed = new Discord.MessageEmbed();
	embed.setTitle(`New Nomination`)
	embed.addField(`Category`, `${category}. ${data[category].name}`)
	embed.addField(`Nominator`, client.guilds.cache.get('587139618999369739').member(message.author).displayName)
	embed.addField(`Nominee`, nominee)
	client.channels.cache.get('789172861356343316').send({embed})

}
client.on('ready', () => {
	console.log('ez')
})

client.on('message', message => {
	if(message.channel.type === "dm" && !message.author.bot && message.content.toLowerCase().startsWith('q.nominate '))
		nominate(message)
	if(message.channel.id === "789172861356343316"){
		if(message.content.toLowerCase() === "q.nominations"){
			const embed = new Discord.MessageEmbed()
			embed.setTitle(`Nominations`)
			let data = JSON.parse(fs.readFileSync(file));
			data.forEach(ez => {
				if(ez === "bad")
					return;
				let nominees = ez.nominees.join(', ')
				if(nominees === "")
					nominees = "."
	
				embed.addField(ez.name, nominees)
			})
			message.channel.send({embed})
		} if(message.content.toLowerCase() === "q.reset"){
			const data = [  'bad',  { name: 'Life of the chat ', nominators: [], nominees: [] },  { name: 'An absolute savage', nominators: [], nominees: [] },  { name: 'The comedian of the gang ', nominators: [], nominees: [] },  { name: 'Prom King & Queen', nominators: [], nominees: [] },  {    name: 'Most likely to survive a zombie apocalypse',    nominators: [],    nominees: []  },  { name: 'Best Duo', nominators: [], nominees: [] },  { name: 'Most intimidating Moderator', nominators: [], nominees: [] },  { name: 'My favourite Moderator', nominators: [], nominees: [] },  {    name: 'Has a heart of gold - helpful and selfless',    nominators: [],    nominees: []  },  { name: 'Noblest noble', nominators: [], nominees: [] },  {    name: 'Creativity runs through their blood',    nominators: [],    nominees: []  },  { name: "Einstein's Successor", nominators: [], nominees: [] },  { name: 'The future millionaire ', nominators: [], nominees: [] },  {    name: 'Motivational enough to be a TED Speaker',    nominators: [],    nominees: []  },  {    name: 'Possibly a catfish behind a screen',    nominators: [],    nominees: []  } ];
			fs.writeFileSync(file, JSON.stringify(data));
			message.channel.send(`:white_check_mark:  The nominations have been reset successfully.`)
		}
	}
})



client.login(config.token)

