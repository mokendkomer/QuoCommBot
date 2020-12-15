const config = require('../config.json');
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const channel = "749244006705397761";
const doesMatter = (reaction) => {
    if(
            reaction.emoji.name === "❤️" ||
            reaction.emoji.name === "🧡" ||
            reaction.emoji.name === "💛" ||
            reaction.emoji.name === "🤍" ||
            reaction.emoji.name === "🖤" ||
            reaction.emoji.name === "💚" ||
            reaction.emoji.name === "💙" ||
            reaction.emoji.name === "💜" ||
            reaction.emoji.name === "💔"
    )
            return true;
        else
            return false;
}

client.on('message', message => {
    if(message.channel.id === channel && message.content.toLowerCase().includes("💙")){
        try{
                message.react('❤️');
                message.react('🧡');
                message.react('💛');
                message.react('🤍');
                message.react('🖤');
                message.react('💚');
                message.react('💙');
                message.react('💜');
                message.react('💔');
        } catch(err){console.log(err)}
    }
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
    
    if(reaction.message.channel.id === channel && !doesMatter(reaction))
        reaction.remove();

})

client.on('message',  message => {
    if(message.channel.id === `697745992463810601` && message.mentions.roles.first() && message.member.permissions.has('MANAGE_MESSAGES')){
        message.channel.messages.fetchPinned().then(ez => ez.forEach(msg => msg.unpin()));
        setTimeout(() => {
            message.pin();
        }, 500);

    }
})

client.on('error', err => console.log(err))

client.login(config.canaryToken)
