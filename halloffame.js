const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client();

const findGay = users => {
        users.forEach(boi => {
                if (boi.id === client.id) return false
        });
        return true;
}

const sendEmbed = (message) => {
        try{
        let embed = {};
        embed.author = {
                name: message.member.displayName,
                icon_url: message.author.avatarURL()
        };
        if (message.content)
        embed.description = `**${message.content}**\nclick [here](${message.url}) to jump to the message`
        else
        embed.description = `click [here](${message.url}) to jump to the message`
        client.channels.cache.get('678682538637525032').send({
                embed
        });
        message.react('⭐')
        message.react('🏆')
} catch(err){
        message.channel.send('Something went wrong')
}
}

const sendImage = img => {
        try{
                let embed = {
                        image: {
                                url: ""
                        }
                };
                embed.image.url = img;
                client.channels.cache.get('678682538637525032').send({
                        embed
                });
        } catch(err){console.log(err)}
}
const sendFile = file => {
        try {
                client.channels.cache.get('678682538637525032').send({files:[file]});
        } catch (ez) {
                let embed = {};
                embed.description = file;
                client.channels.cache.get('678682538637525032').send({
                        embed
                });
        }
}

client.on("ready", () => {
        client.user.setActivity("out for you", {
                type: "WATCHING"
        });
        console.log('ready')
});

client.on("messageReactionAdd", (reaction, user) => {
        if (!reaction.me && (reaction.emoji.toString() === "⭐" && reaction.count === 6 && findGay(reaction.users.cache)) || (findGay(reaction.users.cache) && reaction.emoji.toString() === "🏆" && (user.id === "519927226280443928" || user.id === "392271349860663297" || user.id === "314427251502350337"))) {
                sendEmbed(reaction.message);
                if (reaction.message.attachments.first()) {
                        reaction.message.attachments.forEach(att => {
                                if (att.url.indexOf("png", att.url.length - 3) !== -1 || att.url.indexOf("jpg", att.url.length - 3) !== -1 || att.url.indexOf("gif", att.url.length - 3) !== -1 || att.url.indexOf("jpeg", att.url.length - 4) !== -1)
                                        sendImage(att.url)
                                else
                                        sendFile(att.url)
                        })
                }
        }
});

client.login(config.token);
