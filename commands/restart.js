const Discord = require("discord.js");
const config = require("../config.json");
module.exports = {
    name: 'restart',
    category: "Bot",
    description: 'Restarts the bot to the server',
    enabled: true,
    execute(message, args, bot) {
        let embedRestart = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setDescription(`Bot is restarting...`);
        message.channel.send(embedRestart);
        setTimeout(() => {
            process.exit();
        }, 3000);
    },
}