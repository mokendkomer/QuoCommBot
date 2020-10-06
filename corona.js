const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios").default;
const sendMessage = (message, response) => {
  const embed = new Discord.MessageEmbed();
  embed.setColor("0x" + message.member.roles.highest.hexColor)
  if(response.data.country){
    embed.setTitle("COVID-19 Stats for " + response.data.country);
    embed.setThumbnail(response.data.countryInfo.flag);
  }
  else{
    embed.setTitle("WorldWide COVID-19 Stats");
    embed.setThumbnail("https://icons.iconarchive.com/icons/dtafalonso/modern-xp/512/ModernXP-73-Globe-icon.png");
  }
  embed.setAuthor(message.member.nickname, message.author.avatarURL());
  embed.addField("Cases", response.data.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Active", response.data.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Recovered", response.data.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Critical", response.data.critical.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Deaths", response.data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Cases Today", response.data.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Cases Per One Million", response.data.casesPerOneMillion.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Deaths  Per One Million", response.data.deathsPerOneMillion.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.addField("Deaths Today", response.data.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
  embed.setFooter(`Tests: ${response.data.tests}`, message.guild.iconURL());
  message.channel.send({ embed });
}
client.on("ready", () => {
  console.log("ez");
});
client.on("message", (message) => {
  if (
    (message.channel.id === "587152950078734348" ||
      message.channel.id === "692489104268591144") &&
    message.content.toLowerCase().startsWith("q.corona")
  ) {
    let country = message.content.toLowerCase().substr(9);
    if (!country.length)
      country = "all"
    else 
      country = `countries/${country}`
    axios
    .get("http://corona.lmao.ninja/v2/" + country)
    .then((response) => sendMessage(message, response))
    .catch((error) => message.channel.send("Something went wrong"))
  }
});

client.login(config.token);