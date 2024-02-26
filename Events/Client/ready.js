const {Client} = require("discord.js-selfbot-v13")

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
  console.log(`🚀 Client successfully logged in ${client.user.username} !`)
  //Step one: Get slowmodes per channel
  for (channelID of client.config.CHANNELS) {
    channel = client.channels.cache.get(channelID) //Get the channel
    
      client.config.SLASHCOMMANDS.forEach(slashCommand => { 
        channel.sendSlash(slashCommand.BOTID, slashCommand.COMMAND) //Sending all /commands in the channels chosen
        .then(() => {
          filter = m => m.content.startsWith("Please answer the question below:") //Spot the captcha message
          channel.awaitMessages({filter, max: 1})
          .then(msg => {
            captcha = eval(msg.first().content.split(":")[1].replaceAll("x", "*")) //Solves the captcha
            setTimeout(() => {
              answer = msg.first().components[0].components.find(button => button.label == captcha).customId
              msg.first().clickButton(answer)
              .then(console.log(`✅ Counter captcha on /${slashCommand.COMMAND} command from the bot ${slashCommand.BOTID}.`))
              .catch(e => null)
            }, 5*1000)
          })
          console.log(`✅ Sent /${slashCommand.COMMAND} to ${channel.name} from the bot with the ID ${slashCommand.BOTID} !`)
        })
        .catch(err => console.log(`❌ I can't send /${slashCommand.COMMAND} to ${channel.name}: from the bot with the ID ${slashCommand.BOTID} !`, err))
      });

    client.emit("spamCommands", channel) 
  }
}