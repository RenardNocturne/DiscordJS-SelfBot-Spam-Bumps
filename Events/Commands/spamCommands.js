/**
 * 
 * @param {Client} client 
 * @param {TextChannel} channel 
 */

const { Client, TextChannel } = require("discord.js-selfbot-v13")

module.exports = (client, channel) => {
    setInterval(() => {
        channel.sendTyping().then(() => {
            client.config.SLASHCOMMANDS.forEach(slashCommand => {
                channel.sendSlash(slashCommand.BOTID, slashCommand.COMMAND)
                .then(() => console.log(`✅ Sent /${slashCommand.COMMAND} to ${channel.name} from the bot with the ID ${slashCommand.BOTID} !`))
                .catch(err => console.log(`❌ I can't send /${slashCommand.COMMAND} to ${channel.name}: from the bot with the ID ${slashCommand.BOTID} !`, err))
            });
        })
    }, client.pickRandomNumberBetweenTwoNumbers(120, 135)) //add it some minutes to act like a human (I'm using the /bump command)
    //You can change these values like: pickRandomNumberBetweenTwoNumbers(120, 121) and it will send your bump with the perfect timing !
    // pickRandomNumberBetweenTwoNumbers(<min minutes to wait since your last bump>, <max minutes to wait since your last bump>)
}