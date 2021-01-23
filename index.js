const fs = require("fs");
const Discord = require('discord.js');
const mineflayer = require('mineflayer');
const { monthsShort } = require("moment");
const { builtinModules } = require("module");
const tpsPlugin = require('mineflayer-tps')(mineflayer)
let config = JSON.parse(fs.readFileSync('./config.json'))
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const client = new Discord.Client();
client.commands = new Discord.Collection();

var stdin = process.openStdin()

var prefix = { value: config.prefix };
let chatData = { chat: [], hover: [] };
let saving = { chat: false, hover: false };
let regex = { regex: new RegExp() };

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

let options = {
    version: config.serverVersion,
    host: config.serverIP,
    username: config.email,
    password: config.password
};
var bot = { client: mineflayer.createBot(options) };
bot.client.loadPlugin(tpsPlugin);
client.on("ready", async => {
    console.log("Logged in as " + client.user.tag);
});
client.on('message', message => {

    if (!message.content.startsWith(prefix.value) || message.author.bot) return;

    const args = message.content.slice(prefix.value.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    try {
        if (command.enabled == true && command.name != "settings") {
            command.execute(message, args, bot, chatData, saving, regex);
        }
        else if (command.name == "settings") {
            command.execute(message, args, prefix)
        }
    } catch (err) {
        message.channel.send(`\`\`\`${err}\`\`\``).then(msg => {
            msg.delete({ timeout: 3000 })
        });;
    }
});

client.login(config.token).catch(console.error);

stdin.addListener("data", data => {
    bot.client.chat(data.toString().trim())
})
bot.client.on('login', function () {
    console.log("Logged onto the server as " + bot.client.username);
    bot.client.chat(config.realmCommand);
});

bot.client.on("error", error => {
    if (`${error}`.includes("Invalid credentials")) {
        console.log("Invalid Session/Credentials, attempting to relog");
        setTimeout(() => {
            process.exit();
        }, 30000);
    }
})
bot.client.on("end", () => {
    console.log("Connection Ended");
    setTimeout(() => {
        process.exit();
    }, 30000);
})

bot.client.on('kicked', reason => {
    console.log("Kicked for: " + reason);
    console.log("Attempting to relog");
    setTimeout(() => {
        process.exit();
    }, 30000);
});
bot.client.on("message", msg => {
    console.log(msg.toAnsi())
    let parsedMsg = `${msg}`;
    if (parsedMsg.toLowerCase().match(regex.regex) && saving.hover === true && msg.hoverEvent.value) {
        chatData.chat.push(parsedMsg);
        chatData.hover.push(msg.hoverEvent.value)
    }

    if (parsedMsg.match(regex.regex) && !parsedMsg.includes("(!) Vanity") && saving.chat === true) {
        chatData.chat.push(`${msg}`);
    }
});

