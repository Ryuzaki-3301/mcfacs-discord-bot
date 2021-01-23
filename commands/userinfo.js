const Discord = require('discord.js');
const moment = require('moment')
const config = require("../config.json")

module.exports = {
    name: 'UserInfo',
    enabled: true,
    category: "Miscellaneous",
    aliases: ['userinfo', 'user', 'Userinfo', 'whois'],
    description: 'Displays information about specified user',
    execute(message, args) {
        let User;

        if (!args.length) {
            User = message.guild.member(message.author.id);
        }
        else {
            User = message.mentions.members.first();
        }

        User = User.user;

        if (!User.bot) {

            let created = User.createdAt;
            let joined = message.guild.member(User.id).joinedAt;
            let crDate = `${created.getDate()}-${created.getMonth() + 1}-${created.getFullYear()}-${created.getHours()}-${created.getMinutes()}`;
            let jnDate = `${joined.getDate()}-${joined.getMonth() + 1}-${joined.getFullYear()}-${joined.getHours()}-${joined.getMinutes()}`;

            let createdDate = `${moment(crDate, `DD-MM-YYYY-h:mm`).utcOffset('+0000')
                .format('MMM Do, YYYY, h:mm a')}`
                .concat(` (${moment(crDate, `DD-MM-YYYY-h:mm`)
                    .diff(moment(), 'years') * - 1} Years Ago)`);

            let joinedDate = moment(jnDate, `DD-MM-YYYY-h-mm`)
                .utcOffset('+0000').format('MMM Do, YYYY, h:mm a')
                .concat(` (${moment(jnDate, `DD-MM-YYYY-h:mm`)
                    .diff(moment(), 'Months') * - 1} Months Ago)`);

            let userRoles = "";
            let roles = message.guild.member(User).roles.cache;
            roles.forEach(element => {
                if (element.name == "@everyone") {
                    roles.delete(element.id);
                }
            });


            let embed = new Discord.MessageEmbed()
                .setColor(config.embedColor)
                .setAuthor(User.username + "#" + User.discriminator, User.displayAvatarURL())
                .setDescription(`**Created:** ${createdDate}
                **Joined:** ${joinedDate}
                
                **Roles (${roles.size}):** 
                ${roles.map(role => `<@&${role.id}>`).join(", ")}`);
            message.channel.send(embed);
        }
    },
}