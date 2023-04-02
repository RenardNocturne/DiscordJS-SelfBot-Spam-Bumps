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

    channel.sendTyping().then(() => { //Starts typing and then sends the command
      client.config.SLASHCOMMANDS.forEach(slashCommand => { 
        channel.sendSlash(slashCommand.BOTID, slashCommand.COMMAND) //Sending all /commands in the channels chosen
        .then(() => console.log(`✅ Sent /${slashCommand.COMMAND} to ${channel.name} from the bot with the ID ${slashCommand.BOTID} !`))
        .catch(err => console.log(`❌ I can't send /${slashCommand.COMMAND} to ${channel.name}: from the bot with the ID ${slashCommand.BOTID} !`, err))
      });
    })

    client.emit("spamCommands", channel) 
  }
}