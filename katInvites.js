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
    invites['641530868267089920'] = await getInviteCounts(client.guilds.cache.get('641530868267089920'));
});
client.on('guildMemberRemove', async (member) => {
    client.channels.cache.get('713085571769040977').send(`${member.user.username}#${member.user.discriminator} left`)
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
            const channelId = '713085571769040977'
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
client.login(config.maisToken)