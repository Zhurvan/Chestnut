const fs = require('fs');
const cjson = require('compressed-json');
const reload = require('./scripts/reload');
const Discord = require('discord.js');

let questionsData = fs.readFileSync('./data/questions.json');
let questions = cjson.decompress(JSON.parse(questionsData)).questions;
console.log('Questions Loaded');
let userFile = fs.readFileSync('./data/users.json');
let userData = JSON.parse(userFile);
console.log('User Data Loaded');
let guildFile = fs.readFileSync('./data/guilds.json');
let guildData = JSON.parse(guildFile);
console.log('Guild Data Loaded');
let userQuestionsData = fs.readFileSync('./data/userQuestions.json');
let userQuestions = JSON.parse(userQuestionsData);
console.log('User Questions Loaded');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Bot Started!');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: '+help',
            type: 'STREAMING',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
    });
});

client.on('message', message => {

    if (message.channel instanceof Discord.DMChannel) {
    } else {

        reload.reloadUserData();
        reload.reloadGuildData();

        function initUserData() {
            userData[message.author.id] = {};
            userData[message.author.id].points = 0;
            userData[message.author.id].parts = 0;
            userData[message.author.id].playing = "no";
            userData[message.author.id].paused = "no";
            userData[message.author.id].link = "";
            userData[message.author.id].categories = [];
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            reload.reloadUserData();
        }

        function initUserQuestionData() {
            userQuestions[message.author.id] = {};
            userQuestions[message.author.id].bonuses = [];
            userQuestions[message.author.id].bonusesTemp = [];
            fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
        }

        function initGuildData() {
            guildData[message.guild.id] = {};
            guildData[message.guild.id].prefix = '+';
            fs.writeFileSync('./data/guilds.json', JSON.stringify(guildData));
        }

        if (!userData[message.author.id] && !message.author.bot) {
            initUserData();
        }
        if (!userQuestions[message.author.id] && !message.author.bot) {
            initUserQuestionData();
        }
        if (!guildData[message.guild.id]) {
            initGuildData();
            console.log(`Joined and Connected to ${message.guild.name}`)
        }

        if (message.mentions.members.first()) {
            if (!userData[message.mentions.members.first().id]) {
                userData[message.mentions.members.first().id] = {};
                userData[message.mentions.members.first().id].points = 0;
                userData[message.mentions.members.first().id].parts = 0;
                userData[message.mentions.members.first().id].playing = "no";
                userData[message.mentions.members.first().id].paused = "no";
                userData[message.mentions.members.first().id].link = "";
                userData[message.mentions.members.first().id].categories = [];
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                reload.reloadUserData();
            }
            if (!userData[message.mentions.members.first().id]) {
                userQuestions[message.mentions.members.first().id] = {};
                userQuestions[message.mentions.members.first().id].bonuses = [];
                userQuestions[message.mentions.members.first().id].bonusesTemp = [];
                fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
            }
        }

        const prefix = guildData[message.guild.id].prefix;
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const isCommand = message.content.startsWith(prefix);

        if (isCommand) {
            switch (command) {
                case 'prefix':
                    client.commands.get('prefix').execute(message, args, guildData, prefix);
                    break;
                case 'params':
                    client.commands.get('params').execute(message, args, questions, userData, userQuestions);
                    break;
                case 'p':
                    client.commands.get('params').execute(message, args, questions, userData, userQuestions);
                    break;
                case 'help':
                    client.commands.get('help').execute(message, prefix);
                    break;
                case 'pk':
                    client.commands.get('pk').execute(message, args, prefix, questions, userData, userQuestions);
                    break;
                case 'end':
                    client.commands.get('end').execute(message, userData);
            }
        } else {
            switch (command) {
                case 'prefix':
                    message.channel.send('The current prefix is `' + prefix + '`');
                    break;
                case 'help':
                    client.commands.get('help').execute(message);
            }
        }
    }
});

process.on('uncaughtException', function (e) {
    console.log(new Date().toString(), e.stack || e);
    process.exit(1);
});


client.login(TOKEN);
