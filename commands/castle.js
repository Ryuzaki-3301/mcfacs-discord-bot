const Discord = require("discord.js");
const config = require("../config.json")
const fs = require('fs');
module.exports = {
    name: 'castle',
    category: 'Factions',
    description: 'Displays information about Castle',
    enabled: JSON.parse(fs.readFileSync('./config.json')).enableCommands.castle,
    execute(message, args, bot, chatData, saving, regex) {

        saving.chat = true;
        regex.regex = /^\bCastle\b|^\bControlled\b/i;

        bot.client.chat(`/castle`)

        setTimeout(() => {
            saving.bool = false;
            if (!chatData.chat.length) {
                chatData.chat[0] = "Try Again";
            }
            let embedCastle = new Discord.MessageEmbed()
                .setTitle("Castle Information")
                .setColor(config.embedColor)
                .setDescription(`\`\`\`${chatData.chat.join('\n')}\`\`\``)
                .setTimestamp(new Date())
                .setFooter(`${config.serverIP}`);
            message.channel.send(embedCastle);
            chatData.hover.length = 0;
            chatData.chat.length = 0;

        }, 500);
    },
}