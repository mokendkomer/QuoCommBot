const config = require("../config.json")
const Discord = require("discord.js");
const client = new Discord.Client();
const invites = {}; //{guildId: {memberid: count}}
const getInviteCounts = async guild => {
    return await new Promise((resolve) => {
        guild.fetchInvites().then((invites) => {
            const inviteCounter = {} // { memberId: count }
            invites.forEach((invite) => {
                const {
                    uses,
                    inviter
                } = invite
                const {
                    username,
                    discriminator
                } = inviter
                const name = `${username}#${discriminator}`
                inviteCounter[name] = (inviteCounter[name] || 0) + uses
            })
            resolve(inviteCounter)
        })
    })
}
client.on('ready', async () => {
    console.log('ready')
    invites['587139618999369739'] = await getInviteCounts(client.guilds.cache.get('587139618999369739'));
});
client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.message.guild.id === "587139618999369739"){
        reaction.message.guild.channels.cache.get("587219379456966701").send(`${user.username} reacted with ${reaction.emoji.name} in ${reaction.message.channel}`)
    }
})
client.on('guildMemberRemove', async (member) => {
    client.channels.cache.get('626752381417422849').send(`${member.user.username}#${member.user.discriminator} left. Fuck you.`)
})
client.on('guildMemberAdd', async (member) => {
    const {
        guild,
        id
    } = member
    const invitesBefore = invites[guild.id]
    const invitesAfter = await getInviteCounts(guild)
    for (const inviter in invitesAfter) {
        if (invitesBefore[inviter] === invitesAfter[inviter] - 1) {
            const channelId = '626752381417422849'
            const channel = guild.channels.cache.get(channelId)
            const count = invitesAfter[inviter]
            channel.send(
                `<@${id}> joined.\nInvited by ${inviter} (${count} invites)`
            )
            invites[guild.id] = invitesAfter
            return
        }
    }
})
client.login(config.canaryToken)