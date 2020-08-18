const fs = require('fs');
const stringSimilarity = require('string-similarity');
const Discord = require('discord.js');
const prefix = "!";

let historyData = fs.readFileSync('./data/history.json');
let history = JSON.parse(historyData);
console.log('History Questions Loaded');
let userFile = fs.readFileSync('./data/users.json');
let userData = JSON.parse(userFile);
console.log('User Data Loaded');

function reloadData() {
    userFile = fs.readFileSync('./data/users.json');
    userData = JSON.parse(userFile);
    console.log('Json Files Reloaded');
}

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Bot Started!');
});

client.on('message', message => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const combinedArgs = message.content.slice(prefix.length);
    const commandText = args.shift().toLowerCase();

    reloadData();

    function initUserData() {
        userData[message.author.id] = {};
        userData[message.author.id].points = 0;
        userData[message.author.id].parts = 0;
        userData[message.author.id].playing = "no";
        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        reloadData();
        console.log(message.author.id);
    }

    if (!userData[message.author.id]) {
        initUserData();
    }

    function firstPart() {
        let n = Math.floor((Math.random() * 46));
        history.data.bonuses[n].formatted_answers[0] = history.data.bonuses[n].formatted_answers[0].replace(/<\/?strong>/g, '**');
        history.data.bonuses[n].formatted_answers[1] = history.data.bonuses[n].formatted_answers[1].replace(/<\/?strong>/g, '**');
        history.data.bonuses[n].formatted_answers[2] = history.data.bonuses[n].formatted_answers[2].replace(/<\/?strong>/g, '**');
        history.data.bonuses[n].answers[0] = history.data.bonuses[n].answers[0].replace(/ *\([^)]*\) */g, ' ');
        history.data.bonuses[n].answers[1] = history.data.bonuses[n].answers[1].replace(/ *\([^)]*\) */g, ' ');
        history.data.bonuses[n].answers[2] = history.data.bonuses[n].answers[2].replace(/ *\([^)]*\) */g, ' ');
        let firstEmbed = new Discord.MessageEmbed()
            .setColor('#f5f5f5')
            .setTitle('Bonus One')
            .setDescription(history.data.bonuses[n].leadin + ' ' +
                history.data.bonuses[n].texts[0])
            .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
        message.channel.send(firstEmbed);
        console.log(history.data.bonuses[n].answers[0])
        let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            if (message.content == "!end") {
                collector.stop();
                var endEmbed = new Discord.MessageEmbed()
                    .setTitle('Pk ended')
                    .setDescription(userData[message.author.id].points / userData[message.author.id].parts * 3)
                message.channel.send(endEmbed);
                userData[message.author.id] = {};
                userData[message.author.id].points = 0;
                userData[message.author.id].parts = 0;
                userData[message.author.id].playing = "no";
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                reloadData();
            } else {
                console.log(stringSimilarity.compareTwoStrings(message.content.toLowerCase(), history.data.bonuses[n].answers[0].toLowerCase()));
                if (stringSimilarity.compareTwoStrings(message.content.toLowerCase(), history.data.bonuses[n].answers[0].toLowerCase()) > 0.4) {
                    var correctEmbed = new Discord.MessageEmbed()
                        .setColor('#53d645')
                        .setTitle('Correct')
                        .setDescription(history.data.bonuses[n].formatted_answers[0])
                    message.channel.send(correctEmbed);
                    userData[message.author.id].points += 10;
                } else {
                    var incorrectEmbed = new Discord.MessageEmbed()
                        .setColor('#f72843')
                        .setTitle('Incorrect')
                        .setDescription(history.data.bonuses[n].formatted_answers[0] + "\n\nReact ✅ or ❌ to override the decision This can only be done once")
                    message.channel.send(incorrectEmbed).then(embedMessage => {
                        embedMessage.react('✅');
                        embedMessage.react('❌');
                        let filter = (reaction, user) => {
                            return reaction.emoji.name === '✅' && user.id === message.author.id;
                        };
                        let reactionCollector = embedMessage.createReactionCollector(filter);
                        reactionCollector.on('collect', (reaction, user) => {
                            console.log('reaction collected');
                            userData[message.author.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                            reactionCollector.stop();
                        });
                    });
                }
                userData[message.author.id].parts++
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                secondPart(n);
                collector.stop()
            }
        });
    }

    function secondPart(n) {
        let secondEmbed = new Discord.MessageEmbed()
            .setColor('#f5f5f5')
            .setTitle('Bonus Two')
            .setDescription(history.data.bonuses[n].texts[1])
            .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
        message.channel.send(secondEmbed);
        console.log(history.data.bonuses[n].answers[1])
        let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            if (message.content == "!end") {
                collector.stop();
                var endEmbed = new Discord.MessageEmbed()
                    .setTitle('Pk ended')
                    .setDescription(userData[message.author.id].points / userData[message.author.id].parts * 3)
                message.channel.send(endEmbed);
                userData[message.author.id] = {};
                userData[message.author.id].points = 0;
                userData[message.author.id].parts = 0;
                userData[message.author.id].playing = "no";
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                reloadData();
            } else {
                console.log(stringSimilarity.compareTwoStrings(message.content, history.data.bonuses[n].answers[1].toLowerCase()));
                if (stringSimilarity.compareTwoStrings(message.content.toLowerCase(), history.data.bonuses[n].answers[1].toLowerCase()) > 0.4) {
                    var correctEmbed = new Discord.MessageEmbed()
                        .setColor('#53d645')
                        .setTitle('Correct')
                        .setDescription(history.data.bonuses[n].formatted_answers[1])
                    message.channel.send(correctEmbed);
                    userData[message.author.id].points += 10;
                } else {
                    var incorrectEmbed = new Discord.MessageEmbed()
                        .setColor('#f72843')
                        .setTitle('Incorrect')
                        .setDescription(history.data.bonuses[n].formatted_answers[1] + "\n\nReact ✅ or ❌ to override the decision This can only be done once")
                    message.channel.send(incorrectEmbed).then(embedMessage => {
                        embedMessage.react('✅');
                        embedMessage.react('❌');
                        let filter = (reaction, user) => {
                            return reaction.emoji.name === '✅' && user.id === message.author.id;
                        };
                        let reactionCollector = embedMessage.createReactionCollector(filter);
                        reactionCollector.on('collect', (reaction, user) => {
                            console.log('reaction collected');
                            userData[message.author.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                            reactionCollector.stop();
                        });
                    });
                }
                userData[message.author.id].parts++
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                thirdPart(n);
                collector.stop()
            }
        });
    }

    function thirdPart(n) {
        let thirdEmbed = new Discord.MessageEmbed()
            .setColor('#f5f5f5')
            .setTitle('Bonus Two')
            .setDescription(history.data.bonuses[n].texts[2])
            .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
        message.channel.send(thirdEmbed);
        console.log(history.data.bonuses[n].answers[2])
        let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            if (message.content == "!end") {
                collector.stop();
                var endEmbed = new Discord.MessageEmbed()
                    .setTitle('Pk ended')
                    .setDescription(userData[message.author.id].points / userData[message.author.id].parts * 3)
                message.channel.send(endEmbed);
                userData[message.author.id] = {};
                userData[message.author.id].points = 0;
                userData[message.author.id].parts = 0;
                userData[message.author.id].playing = "no";
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                reloadData();
            } else {
                console.log(stringSimilarity.compareTwoStrings(message.content.toLowerCase(), history.data.bonuses[n].answers[2].toLowerCase()));
                if (stringSimilarity.compareTwoStrings(message.content.toLowerCase(), history.data.bonuses[n].answers[2].toLowerCase()) > 0.4) {
                    var correctEmbed = new Discord.MessageEmbed()
                        .setColor('#53d645')
                        .setTitle('Correct')
                        .setDescription(history.data.bonuses[n].formatted_answers[2])
                    message.channel.send(correctEmbed);
                    userData[message.author.id].points += 10;
                } else {
                    var incorrectEmbed = new Discord.MessageEmbed()
                        .setColor('#f72843')
                        .setTitle('Incorrect')
                        .setDescription(history.data.bonuses[n].formatted_answers[2] + "\n\nReact ✅ or ❌ to override the decision This can only be done once")
                    message.channel.send(incorrectEmbed).then(embedMessage => {
                        embedMessage.react('✅');
                        embedMessage.react('❌');
                        let filter = (reaction, user) => {
                            return reaction.emoji.name === '✅' && user.id === message.author.id;
                        };
                        let reactionCollector = embedMessage.createReactionCollector(filter);
                        reactionCollector.on('collect', (reaction, user) => {
                            console.log('reaction collected');
                            userData[message.author.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                            reactionCollector.stop();
                        });
                    });
                }
                userData[message.author.id].parts++
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                firstPart();
                collector.stop()
            }
        });
    }

    if (commandText == "test") {
        var eembed = new Discord.MessageEmbed()
            .setDescription('**' + 'hit' + '**')
        message.channel.send(eembed);
    }

    if (commandText == "pk") {
        if (!userData[message.author.id]) {
            message.channel.send('This must be your first message in the server. Please try using `!pk` again!');
        } else {
            if (userData[message.author.id].playing === "yes") {
                message.channel.send("You're already in a pk!");
            } else if (userData[message.author.id].playing === "no") {
                userData[message.author.id].playing = "yes";
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                firstPart();
            }
        }
    }

    if (commandText == 'end') {
        if (userData[message.author.id].playing === "yes") {
            var endEmbed = new Discord.MessageEmbed()
                .setTitle('Pk ended')
                .setDescription(userData[message.author.id].points / userData[message.author.id].parts * 3 + ' ppg')
            message.channel.send(endEmbed);
            userData[message.author.id] = {};
            userData[message.author.id].points = 0;
            userData[message.author.id].parts = 0;
            userData[message.author.id].playing = "no";
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            reloadData();
        } else if (userData[message.author.id].playing === "no") {
            message.channel.send("You're not in a pk.")
        }
    }
});


client.login('NzQ0NjY1NzMxOTY2MTczMzQ2.XzmiAQ.kVrCaFyv-7PCcNu-OxNPvR1SOGc');