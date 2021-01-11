const config = require("../config.json")
const Discord = require("discord.js");
const client = new Discord.Client();
const mysql = require('mysql');
const connection = mysql.createConnection(config.mysql);
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
    client.setInterval(() => {
		connection.query(`select id from mutes where current_timestamp() > time`, function (error, result) {
			result.forEach(ele => {
				const muted = client.guilds.cache.get('587139618999369739').members.cache.get(ele.id)
				muted.roles.remove('751530631489650738')
			})
		});
	}, 60000);

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
            break;
        }
    }

    connection.query(`select verified, not isnull(mu.id) as muted, name from members m left join mutes mu using (id) where id = ?`, [member.id], function (error, result) {
        if (!result.length)
            connection.query(`INSERT INTO members (id, name) VALUES (?, ?)`, [member.id, member.displayName])
        else {
            if (result[0].verified === 1 && result[0].muted === 0) {
				console.log(result[0].verified, result[0].muted, result[0].name)
				member.setNickname(result[0].name)
				member.roles.remove('780442815016599634')
                member.roles.add('587187354851082250')
            }
        }
    });
})
client.on('message', message => {
	if (message.content.toLowerCase().startsWith('q.mute')) {
		let args = message.content.toLowerCase().split(" ").slice(1);
		let toMute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!message.member.hasPermission("MANAGE_MESSAGES"))
			return message.channel.send("You do not have the permission to mute someone.");
            if (!toMute)
			return message.channel.send("You did not mention a user or ID.");
            if(toMute.id === message.member.id)
                return message.channel.send(`Go fuck yourself.`)
		let mutedRole = message.guild.roles.cache.get('751530631489650738')
		if (toMute.roles.cache.has(mutedRole.id))
			return message.channel.send("This user is already muted.");

		if (!args[1] && !args[2]) {
			toMute.roles.add(mutedRole)
			message.channel.send(`${toMute.displayName} has been muted.`)
		}
		if (args[1] && args[2]) {
			let time = parseInt(args[1])
			if (isNaN(time))
            return message.channel.send(`Please enter a valid number.`);
			if (args[2].startsWith('m'))
				connection.query(`INSERT INTO mutes VALUES (?, CURRENT_TIMESTAMP() + INTERVAL ? MINUTE)`, [toMute.id, time])
			else if (args[2].startsWith('h'))
				connection.query(`INSERT INTO mutes VALUES (?, CURRENT_TIMESTAMP() + INTERVAL ? HOUR)`, [toMute.id, time])
			else if (args[2].startsWith('d'))
				connection.query(`INSERT INTO mutes VALUES (?, CURRENT_TIMESTAMP() + INTERVAL ? DAY)`, [toMute.id, time])
                else return message.channel.send(`Please enter a valid unit of time.`);
                toMute.roles.add(mutedRole)
			message.channel.send(`${toMute.displayName} has been muted.`)
		}
	} else 	if (message.content.toLowerCase().startsWith('q.selfmute')) {
		let args = message.content.toLowerCase().split(" ").slice(1);
		let toMute = message.member;
		let mutedRole = message.guild.roles.cache.get('751530631489650738')

		if (!args[0] && !args[1]) {
			message.channel.send(`Please specify the duration of your mute in minutes, hours, or days.`)
		}
		if (args[0] && args[1]) {
			let time = parseInt(args[0])
			if (isNaN(time))
				return message.channel.send(`Please enter a valid number.`);
			if (args[1].startsWith('m'))
				connection.query(`INSERT INTO mutes VALUES (?, CURRENT_TIMESTAMP() + INTERVAL ? MINUTE)`, [toMute.id, time])
			else if (args[1].startsWith('h'))
				connection.query(`INSERT INTO mutes VALUES (?, CURRENT_TIMESTAMP() + INTERVAL ? HOUR)`, [toMute.id, time])
			else if (args[1].startsWith('d'))
				connection.query(`INSERT INTO mutes VALUES (?, CURRENT_TIMESTAMP() + INTERVAL ? DAY)`, [toMute.id, time])
			else return message.channel.send(`Please enter a valid unit of time.`);
			toMute.roles.add(mutedRole)
			message.channel.send(`You have been muted.`)
		}
	} else if (message.content.toLowerCase().startsWith('q.unmute')) {
		let args = message.content.toLowerCase().split(" ").slice(1);
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have Permission to unmute.");
		let toUnmute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!toUnmute) return message.channel.send("You did not specify a user mention or ID.");
		let mutedRole = message.guild.roles.cache.get('751530631489650738')
		if (!toUnmute.roles.cache.has(mutedRole.id)) return message.channel.send("This user is not muted.");

		toUnmute.roles.remove(mutedRole)
		message.channel.send(`${toUnmute.displayName} has been unmuted.`)
	}
})

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember.displayName !== newMember.displayName) {
        connection.query(`UPDATE members SET name = ? WHERE id = ?`, [newMember.displayName, newMember.id])
    } else if (!oldMember.roles.cache.get('587187354851082250') && newMember.roles.cache.get('587187354851082250')) {
		connection.query(`UPDATE members SET verified = 1 WHERE id = ?`, [newMember.id])
		client.channels.cache.get('587152863373819904').send("Welcome to QuoComm <@" + newMember.id + "> \nBe sure to <#587156775346765834>");
    } else if (!oldMember.roles.cache.get('751530631489650738') && newMember.roles.cache.get('751530631489650738')) {
		newMember.send(`You have been muted.`)
		connection.query(`INSERT INTO mutes VALUES (?, NULL)`, [newMember.id], (err) => {
			if(err) console.log('')
		})
	} else if (oldMember.roles.cache.get('751530631489650738') && !newMember.roles.cache.get('751530631489650738')) {
		newMember.send(`You have been unmuted.`)
		connection.query(`DELETE FROM mutes WHERE id = ?`, [newMember.id], (err) => {
			if(err) console.log('')
		})
	}
})
client.on("voiceStateUpdate", function (oldMember, newMember) {
	if (newMember.member.user.bot && newMember.channel) {
	  if (
		newMember.channel.members.some(
		  (member) => member.user.bot && member.id != newMember.id
		)
	  )
		newMember.kick();
	}
  });

client.login(config.canaryToken)
