const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const verification = "805546881928527984"
const pendingVerification = "809208420225122374"
const verifiedRole = "805250027152080957"
const mainChannel = "805250027743608833"
const rulesChannel = "805250027396005951"

client.on('ready', () => {
  console.log("ez");
})

client.on('message', message => {
    if(message.content === "asdf")
        client.emit('guildMemberAdd', message.member);

})

client.on('guildMemberAdd', (member) => {
    const modEmbed = new Discord.MessageEmbed();
    modEmbed.setTitle(`${member.displayName} has joined`)
    modEmbed.setDescription(`React with :white_check_mark: to verify them. \n <@${member.id}>`)
	modEmbed.setFooter(`${member.id}`)
	client.channels.cache.get(pendingVerification).send(modEmbed).then(msg => msg.react('✅'));

    const memberEmbed = new Discord.MessageEmbed();
    memberEmbed.setAuthor(member.displayName, member.user.avatarURL())
    memberEmbed.setTitle(`Welcome to Kat Foundation!`)
    memberEmbed.setDescription(`A safe place for people to communicate and receive support!\n
    We take our members' security very seriously. We request you to answer the following questions before you gain access to the entire server. \n
    1. How did you find out about the server?
    2. What is your reason for joining?\n
    As you wait for your entry, be sure to read <#${rulesChannel}>. If you need any help, please ping an online moderator to assist you.
    `)
	client.channels.cache.get(verification).send(`Hey <@${member.id}>`, memberEmbed);
})

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

    if(reaction.message.channel.id !== pendingVerification || reaction.me)
        return;
    if(!reaction.message.guild.member(user).hasPermission('MANAGE_ROLES'))
        return;
    reaction.message.guild.member(reaction.message.embeds[0].footer.text).roles.add(verifiedRole);
})

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (!oldMember.roles.cache.get(verifiedRole) && newMember.roles.cache.get(verifiedRole))
        client.channels.cache.get(mainChannel).send("Welcome to Kat Foundation <@" + newMember.id + "> \nBe sure to make yourself feel at home and don't be shy!");

})

client.login(config.katToken);
