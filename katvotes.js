const config = require('../config.json')
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const fs = require('fs');
const file = '../katvotes.json';

client.on('ready', () => {
    console.log('ez')
})

client.on('messageReactionAdd', async (reaction, user) => {
	if(user.bot)
		return;
	if(reaction.message.channel.id !== "792430189710671932")
        return;
    reaction.users.remove(user.id);
    if(reaction.emoji.name !== "☑️")
        return;
	let data = JSON.parse(fs.readFileSync(file));
    let index = 3;
    if(reaction.message.id === "792430257902846012")
        index = 0
    if(reaction.message.id === "792430259970113546")
        index = 1
    if(reaction.message.id === "792430262545416192")
        index = 2
    if(index === 3)
        return; 
	if(data.some(a => a.voters.includes(user.id))){
		user.send(`:warning:  You have already voted.`)
		return;
	}
	data[index].voters.push(user.id)
    fs.writeFileSync(file, JSON.stringify(data));
    user.send(`:white_check_mark:  You have voted ${data[index].name}`)
    const embed = new Discord.MessageEmbed()
    embed.setTitle(`Votes`)
    data = JSON.parse(fs.readFileSync(file));
    data.forEach(entry => {
        embed.addField(entry.name, entry.voters.length)
    })
    client.channels.cache.get('788718012168798219').send({embed})

})

client.login(config.maisToken)
