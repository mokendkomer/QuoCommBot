const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios").default;

const sendMessage = (msg, response, thumbnail) => {
      const exampleEmbed = {
        color: "0x" + msg.member.roles.highest.hexColor,
        title: "COVID19 Stats for " + response.data.country,
        author: {
          name: msg.member.nickname,
          icon_url: msg.author.avatarURL(),
        },
        thumbnail: {
          url: thumbnail,
        },
        fields: [
          {
            name: "Cases",
            value: response.data.cases,
            inline: true,
          },
          {
            name: "Active",
            value: response.data.active,
            inline: true,
          },
          {
            name: "Recovered",
            value: response.data.recovered,
            inline: true,
          },
          {
            name: "Critical",
            value: response.data.critical,
            inline: true,
          },
          {
            name: "Deaths",
            value: response.data.deaths,
            inline: true,
          },
          {
            name: "Cases Today",
            value: response.data.todayCases,
            inline: true,
          },
          {
            name: "Cases Per One Million",
            value: response.data.casesPerOneMillion,
              inline: true,
            },
            {
              name: "Deaths  Per One Million",
              value: response.data.deathsPerOneMillion,
              inline: true,
            },
            {
            name: "Deaths Today",
            value: response.data.todayDeaths,
            inline: true,
            },
        ],
        footer: {
            text: "Tests: " + response.data.tests,
            icon_url: msg.guild.iconURL(),
        },
      };
      msg.channel.send({ embed: exampleEmbed });
}

client.on("ready", () => {
  console.log("ez");
});

client.on("message", (msg) => {
  if (
    (msg.channel.id === "587152950078734348" ||
      msg.channel.id === "692489104268591144") &&
    msg.content.toLowerCase().startsWith("q.corona")
  ) {
    let country = msg.content.toLowerCase().substr(9);
    if (country === "") {
      axios
        .get("http://corona.lmao.ninja/v2/all")
        .then((response) => sendMessage(msg, response, "https://icons.iconarchive.com/icons/dtafalonso/modern-xp/512/ModernXP-73-Globe-icon.png"))
        .catch(function (error) {
          msg.channel.send("Something went wrong");
        });
    } else {
        axios
    .get("http://corona.lmao.ninja/v2/countries/" + country)
    .then((response) => sendMessage(msg, response, response.data.countryInfo.flag))
    .catch((error) => msg.channel.send("Something went wrong"))
    }
  }
});

client.login(config.token);
