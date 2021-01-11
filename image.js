const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client();
const GoogleImages = require("google-images");
const imgclient = new GoogleImages(
  config.googleCX,
  config.googleKey
);
client.on("ready", () => {
  console.log("ez");
});
client.on("message", (message) => {
  if (
    message.content.toLowerCase().startsWith("q.img ") ||
    message.content.toLowerCase().startsWith("q.image ") ||
    message.content.toLowerCase().startsWith(".img ")
  ) {
    let query = message.content.toLowerCase().substr(5);
    if (query.startsWith("g ")) query = query.substr(2);
    if (query.startsWith("e ")) query = query.substr(2);
    if (!query.length) message.channel.send("Search for something next time");
    else {
      message.channel.startTyping();
      imgclient
        .search(query)
        .then((images) => {
          if (images.length) {
            let index = 0;
            let embed = new Discord.MessageEmbed();
            embed.setAuthor(message.author.username, message.author.avatarURL);
            embed.setTimestamp(new Date());
            embed.setTitle(`Image results for '${query}'`);
            embed.setImage(images[index].url);
            message.channel.send(embed).then((msg) => {
              const msgFilter = (m) => m.author.id === message.author.id;
              const mosageCollector = message.channel.createMessageCollector(
                msgFilter,
                { time: 60000 }
              );
              mosageCollector.on("collect", (m) => {
                if (m.content === "next" || m.content === "n") {
                  m.delete();
                  if (index < images.length) {
                    index++;
                    msg.embeds[0].setImage(images[index].url);
                    msg.edit(msg.embeds[0]);
                  }
                }
                if (
                  m.content === "back" ||
                  m.content === "previous" ||
                  m.content === "b"
                ) {
                  if (index > 0) {
                    index--;
                    msg.embeds[0].setImage(images[index].url);
                    msg.edit(msg.embeds[0]);
                  }
                }
                if (m.content === "stop" || m.content === "s") {
                  mosageCollector.stop();
                  reactionCollector.stop();
                  msg.embeds[0].setImage("");
                  msg.edit(msg.embeds[0]);
                }
              });
              msg.react("◀️");
              msg.react("▶️");
              msg.react("⏹️");
              msg.react("🔢");
              const reactionFilter = (reaction, user) =>
                (reaction.emoji.name === "◀️" ||
                  reaction.emoji.name === "▶️" ||
                  reaction.emoji.name === "⏹️" ||
                  reaction.emoji.name === "🔢") &&
                user.id === message.author.id;
              const reactionCollector = msg.createReactionCollector(
                reactionFilter,
                { time: 60000 }
              );
              reactionCollector.on("collect", (reaction) => {
                if (reaction.emoji.name === "◀️") {
                  if (index > 0) {
                    index--;
                    msg.embeds[0].setImage(images[index].url);
                    msg.edit(msg.embeds[0]);
                  }
                }
                if (reaction.emoji.name === "▶️") {
                  if (index < images.length) {
                    index++;
                    msg.embeds[0].setImage(images[index].url);
                    msg.edit(msg.embeds[0]);
                  }
                }
                if (reaction.emoji.name === "⏹️") {
                  reactionCollector.stop();
                  msg.embeds[0].setImage("");
                  msg.edit(msg.embeds[0]);
                }
                if (reaction.emoji.name === "🔢") {
                  message.channel
                    .send("Which page would you like to go to?")
                    .then(() => {
                      const messageFilter = (m) =>
                        m.author.id === message.author.id;
                      const msgCollector = message.channel.createMessageCollector(
                        messageFilter,
                        { time: 10000 }
                      );
                      msgCollector.on("collect", (m) => {
                        msgCollector.stop();
                        index = Number(m.content);
                        if (!Number.isInteger(index))
                          message.channel.send("Stop trying to break me");
                        else {
                          if (index > images.length)
                            message.channel.send(
                              "I couldn't even find " + index + " pictures"
                            );
                          else {
                            msg.embeds[0].setImage(images[index].url);
                            msg.edit(msg.embeds[0]);
                          }
                        }
                      });
                    });
                }
                if (reaction.emoji.name != "⏹️") {
                  reaction.users.remove(message.author.id)
                }
              });
              reactionCollector.on("end", () => msg.reactions.removeAll());
            });
          } else message.channel.send("I couldn't find any images of " + query);
        })
        .catch((err) => console.log(err));
      message.channel.stopTyping();
    }
  }
});
client.login(config.token);

