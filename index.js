const fs = require('fs');
const cjson = require('compressed-json');
const reload = require('./scripts/reload');
const Discord = require('discord.js');
const config = require('./config.json');
const Gists = require('gists');
const gists = new Gists({username: config.githubUsername, password: config.githubPassword});

let prefix;

let questionsData = fs.readFileSync('./data/questions.json');
let questions = cjson.decompress(JSON.parse(questionsData));
console.log('Questions Loaded');
let userFile = fs.readFileSync('./data/users.json');
let userData = JSON.parse(userFile);
console.log('User Data Loaded');
let guildFile = fs.readFileSync('./data/guilds.json');
let guildData = JSON.parse(guildFile);
console.log('Guild Data Loaded');
let userAnswersData = fs.readFileSync('./data/userAnswers.json');
let userAnswers = JSON.parse(userAnswersData);
console.log('User Answers Loaded');
let ratingsData = fs.readFileSync('./data/ratings.json');
let ratings = JSON.parse(ratingsData);
console.log('Question Ratings Loaded');
let userQuestions = {};

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
        reload.reloadUserData();
        reload.reloadGuildData();
        reload.reloadRatingData();

        function initUserData() {
            userData[message.author.id] = {};
            userData[message.author.id].points = 0;
            userData[message.author.id].parts = 0;
            userData[message.author.id].playing = "no";
            userData[message.author.id].paused = "no";
            userData[message.author.id].link = "";
            userData[message.author.id].categories = [];
            userData[message.author.id].color = {};
            userData[message.author.id].color.name = 'Gray';
            userData[message.author.id].color.part1 = '';
            userData[message.author.id].color.part2 = ''
            userData[message.author.id].color.bar = {};
            userData[message.author.id].color.bar.name = 'White';
            userData[message.author.id].color.bar.value = '#f5f5f5'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            reload.reloadUserData();
        }

        function initUserQuestionData() {
            userQuestions[message.author.id] = {};
            userQuestions[message.author.id].bonuses = [];
            userQuestions[message.author.id].bonusesTemp = [];
        }

        function initUserAnswersData() {
            userAnswers[message.author.id] = [];
            fs.writeFileSync('./data/userAnswers.json', JSON.stringify(userAnswers));
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
        if (!userAnswers[message.author.id] && !message.author.bot) {
            initUserAnswersData();
        }
        if (message.channel instanceof Discord.DMChannel) {
            prefix = '+';
        } else {
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
                    userData[message.mentions.members.first().id].color = {};
                    userData[message.mentions.members.first().id].color.name = 'Gray';
                    userData[message.mentions.members.first().id].color.part1 = '';
                    userData[message.mentions.members.first().id].color.part2 = '';
                    userData[message.mentions.members.first().id].color.bar = {};
                    userData[message.mentions.members.first().id].color.bar.name = 'White';
                    userData[message.mentions.members.first().id].color.bar.value = '#f5f5f5'
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    reload.reloadUserData();
                }
                if (!userQuestions[message.mentions.members.first().id]) {
                    userQuestions[message.mentions.members.first().id] = {};
                    userQuestions[message.mentions.members.first().id].bonuses = [];
                    userQuestions[message.mentions.members.first().id].bonusesTemp = [];

                }
                if (!userAnswers[message.mentions.members.first().id]) {
                    userAnswers[message.mentions.members.first().id] = [];
                    fs.writeFileSync('./data/userAnswers.json', JSON.stringify(userAnswers));
                }
            }

            prefix = guildData[message.guild.id].prefix;
        }
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const isCommand = message.content.startsWith(prefix);

        if (isCommand) {
            switch (command) {
                case 'prefix':
                    if (message.channel instanceof Discord.DMChannel) {
                        message.channel.send('The current prefix is `+`')
                    } else {
                        client.commands.get('prefix').execute(message, args, guildData, prefix);
                    }
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
                    client.commands.get('pk').execute(message, args, prefix, questions, userData, userQuestions, ratings, userAnswers);
                    break;
                case 'end':
                    client.commands.get('end').execute(message, userData, userAnswers, gists);
                    break;
                case 'color':
                    if (userData[message.author.id].playing === 'no') {
                        client.commands.get('color').execute(message, args, userData);
                    }
                    break;
                case 'c':
                    client.commands.get('color').execute(message, args, userData);
            }
        } else {
            switch (message.content) {
                case '+prefix':
                    message.channel.send('The current prefix is `' + prefix + '`');
                    break;
                case '+help':
                    client.commands.get('help').execute(message, prefix);
            }
        }
    }
);

process.on('uncaughtException', function (e) {
    console.log(new Date().toString(), e.stack || e);
    process.exit(1);
});

fs.readFile('token.txt', 'utf-8', function (err, token) {
    client.login(config.discordKey);
});
