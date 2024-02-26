const { Client, TextChannel} = require("discord.js-selfbot-v13")
/**
 * 
 * @param {Client} client 
 * @param {TextChannel} channel 
 */
module.exports = (client, channel) => {
    client.config.SLASHCOMMANDS.forEach(slashCommand => {
        setInterval(() => {
            channel.sendSlash(slashCommand.BOTID, slashCommand.COMMAND)
            .then(() => {
                filter = m => m.content.startsWith("Please answer the question below:") //Spot the captcha message
                channel.awaitMessages({filter, max: 1})
                .then(msg => {
                    captcha = eval(msg.first().content.split(":")[1].replaceAll("x", "*")) //Solves the captcha
                    setTimeout(() => {
                    answer = msg.first().components[0].components.find(button => button.label == captcha).customId
                    msg.first().clickButton(answer)
                    .then(() => console.log(`✅ Counter captcha on /${slashCommand.COMMAND} command from the bot ${slashCommand.BOTID}.`))
                    .catch(e => null)
                    }, 5*1000)
                })
                console.log(`✅ Sent /${slashCommand.COMMAND} to ${channel.name} from the bot with the ID ${slashCommand.BOTID} !`)
            })
            .catch(err => console.log(`❌ I can't send /${slashCommand.COMMAND} to ${channel.name}: from the bot with the ID ${slashCommand.BOTID} !`, err))
        }, client.pickRandomNumberBetweenTwoNumbers(slashCommand.DELAY, slashCommand.DELAY + 30))
        //add it some minutes to act like a human (I'm using the /bump command)
        //You can change these values like: pickRandomNumberBetweenTwoNumbers(120, 121) and it will send your bump with the perfect timing !
        // pickRandomNumberBetweenTwoNumbers(<min minutes to wait since your last bump>, <max minutes to wait since your last bump>)
    });
}