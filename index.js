const fs = require('fs');
const stringSimilarity = require('string-similarity');
const Discord = require('discord.js');
const prefix = "!";

let questionsData = fs.readFileSync('./data/questions.json');
let questions = JSON.parse(questionsData);
console.log('Questions Loaded');
let userFile = fs.readFileSync('./data/users.json');
let userData = JSON.parse(userFile);
console.log('User Data Loaded');
let userQuestionsData = fs.readFileSync('./data/userQuestions.json');
let userQuestions = JSON.parse(userQuestionsData);
console.log('User Questions Loaded')

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
    }

    function initUserQuestionData() {
        userQuestions[message.author.id] = {};
        userQuestions[message.author.id].bonuses = [];
        userQuestions[message.author.id].bonusesTemp = [];
        fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
    }

    if (!userData[message.author.id] && !message.author.bot) {
        initUserData();
    }
    if (!userQuestions[message.author.id] && !message.author.bot) {
        initUserQuestionData();
    }

    function replaceStrings(n) {
        userQuestions[message.author.id].bonuses[n].formatted_answers[0] = userQuestions[message.author.id].bonuses[n].formatted_answers[0].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '');
        userQuestions[message.author.id].bonuses[n].formatted_answers[1] = userQuestions[message.author.id].bonuses[n].formatted_answers[1].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '');
        userQuestions[message.author.id].bonuses[n].formatted_answers[2] = userQuestions[message.author.id].bonuses[n].formatted_answers[2].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '');
        userQuestions[message.author.id].bonuses[n].answers[0] = userQuestions[message.author.id].bonuses[n].answers[0].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '');
        userQuestions[message.author.id].bonuses[n].answers[1] = userQuestions[message.author.id].bonuses[n].answers[1].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '');
        userQuestions[message.author.id].bonuses[n].answers[2] = userQuestions[message.author.id].bonuses[n].answers[2].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '');
        userQuestions[message.author.id].bonuses[n].formatted_leadin = userQuestions[message.author.id].bonuses[n].formatted_leadin.replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
        userQuestions[message.author.id].bonuses[n].formatted_texts[0] = userQuestions[message.author.id].bonuses[n].formatted_texts[0].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
        userQuestions[message.author.id].bonuses[n].formatted_texts[1] = userQuestions[message.author.id].bonuses[n].formatted_texts[1].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
        userQuestions[message.author.id].bonuses[n].formatted_texts[2] = userQuestions[message.author.id].bonuses[n].formatted_texts[2].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
    }

    function firstPart() {
        let n = Math.floor((Math.random() * (userQuestions[message.author.id].bonuses.length - 1)));
        replaceStrings(n);
        let firstEmbed = new Discord.MessageEmbed()
            .setColor('#f5f5f5')
            .setAuthor(userQuestions[message.author.id].bonuses[n].tournament.name)
            .setTitle('Bonus One')
            .setDescription(userQuestions[message.author.id].bonuses[n].formatted_leadin + ' ' +
                userQuestions[message.author.id].bonuses[n].formatted_texts[0])
            .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
        message.channel.send(firstEmbed);
        console.log(userQuestions[message.author.id].bonuses[n].answers[0])
        let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            if (message.content == prefix + 'end') {
                collector.stop();
            } else {
                console.log(stringSimilarity.compareTwoStrings(message.content.toLowerCase(), userQuestions[message.author.id].bonuses[n].answers[0].toLowerCase()));
                if (stringSimilarity.compareTwoStrings(message.content.toLowerCase(), userQuestions[message.author.id].bonuses[n].answers[0].toLowerCase()) > 0.4) {
                    var correctEmbed = new Discord.MessageEmbed()
                        .setColor('#53d645')
                        .setTitle('Correct')
                        .setDescription(userQuestions[message.author.id].bonuses[n].formatted_answers[0])
                    message.channel.send(correctEmbed);
                    userData[message.author.id].points += 10;
                } else {
                    var incorrectEmbed = new Discord.MessageEmbed()
                        .setColor('#f72843')
                        .setTitle('Incorrect')
                        .setDescription(userQuestions[message.author.id].bonuses[n].formatted_answers[0] + "\n\nReact ✅ or ❌ to override the decision This can only be done once")
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
        replaceStrings(n);
        let secondEmbed = new Discord.MessageEmbed()
            .setColor('#f5f5f5')
            .setAuthor(userQuestions[message.author.id].bonuses[n].tournament.name)
            .setTitle('Bonus Two')
            .setDescription(userQuestions[message.author.id].bonuses[n].formatted_texts[1])
            .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
        message.channel.send(secondEmbed);
        console.log(userQuestions[message.author.id].bonuses[n].answers[1])
        let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            if (message.content == prefix + 'end') {
                collector.stop();
            } else {
                console.log(stringSimilarity.compareTwoStrings(message.content, userQuestions[message.author.id].bonuses[n].answers[1].toLowerCase()));
                if (stringSimilarity.compareTwoStrings(message.content.toLowerCase(), userQuestions[message.author.id].bonuses[n].answers[1].toLowerCase()) > 0.4) {
                    var correctEmbed = new Discord.MessageEmbed()
                        .setColor('#53d645')
                        .setTitle('Correct')
                        .setDescription(userQuestions[message.author.id].bonuses[n].formatted_answers[1])
                    message.channel.send(correctEmbed);
                    userData[message.author.id].points += 10;
                } else {
                    var incorrectEmbed = new Discord.MessageEmbed()
                        .setColor('#f72843')
                        .setTitle('Incorrect')
                        .setDescription(userQuestions[message.author.id].bonuses[n].formatted_answers[1] + "\n\nReact ✅ or ❌ to override the decision This can only be done once")
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
        replaceStrings(n);
        let thirdEmbed = new Discord.MessageEmbed()
            .setColor('#f5f5f5')
            .setAuthor(userQuestions[message.author.id].bonuses[n].tournament.name)
            .setTitle('Bonus Two')
            .setDescription(userQuestions[message.author.id].bonuses[n].formatted_texts[2])
            .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
        message.channel.send(thirdEmbed);
        console.log(userQuestions[message.author.id].bonuses[n].answers[2])
        let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', message => {
            if (message.content == prefix + 'end') {
                collector.stop();
            } else {
                console.log(stringSimilarity.compareTwoStrings(message.content.toLowerCase(), userQuestions[message.author.id].bonuses[n].answers[2].toLowerCase()));
                if (stringSimilarity.compareTwoStrings(message.content.toLowerCase(), userQuestions[message.author.id].bonuses[n].answers[2].toLowerCase()) > 0.4) {
                    var correctEmbed = new Discord.MessageEmbed()
                        .setColor('#53d645')
                        .setTitle('Correct')
                        .setDescription(userQuestions[message.author.id].bonuses[n].formatted_answers[2])
                    message.channel.send(correctEmbed);
                    userData[message.author.id].points += 10;
                } else {
                    var incorrectEmbed = new Discord.MessageEmbed()
                        .setColor('#f72843')
                        .setTitle('Incorrect')
                        .setDescription(userQuestions[message.author.id].bonuses[n].formatted_answers[2] + "\n\nReact ✅ or ❌ to override the decision This can only be done once")
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

    if (commandText == 'params') {
      if(userData[message.author.id].playing === 'yes') {
        message.channel.send("You can't change parameters while inside a pk!");
      }
      else {
        if (args[0] == 'reset') {
            userQuestions[message.author.id].bonuses = [];
            userQuestions[message.author.id].bonusesTemp = [];
            message.channel.send('Parameters reset!');
            fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
        } else if (args[0] == 'all') {
            userQuestions[message.author.id].bonuses = questions.data.bonuses;
            message.channel.send('Parameters set to all questions!');
            fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
        } else if (args[0] == 'diff') {
            if (!args[1]) {
                message.channel.send('Please add a difficulty (from 1 to 2) after the command');
            } else if (args[1]) {
                userQuestions[message.author.id].bonuses = []
                questions.data.bonuses.forEach(bonus => {
                    if (bonus.tournament.difficulty_num == args[1]) {
                        userQuestions[message.author.id].bonuses.push(bonus);
                        fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
                    }
                });
                message.channel.send('Parameters set to difficulty ' + args[1] + '!');
            }
        } else if (args[0] == 'cat') {
            if (!args[1]) {
                message.channel.send('Please add a category after the command');
            } else if (args[1]) {
                if (args[1].toLowerCase() == "ce") {
                    args[1] = "current events";
                } else if (args[1].toLowerCase() == "fa") {
                    args[1] = "fine arts";
                }
                userQuestions[message.author.id].bonuses = []
                questions.data.bonuses.forEach(bonus => {
                    if (bonus.category.name.toLowerCase() == args[1].toLowerCase()) {
                        userQuestions[message.author.id].bonuses.push(bonus);
                        fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
                    }
                });
                message.channel.send('Parameters set to category ' + args[1] + '!');
            }
        }
    }
  }

    if (commandText == 'test') {
        var eembed = new Discord.MessageEmbed()
            .setDescription('**' + 'hit' + '**')
        message.channel.send(eembed);
    }

    if (commandText == "pk") {
        if (userData[message.author.id].playing === "yes") {
            message.channel.send("You're already in a pk!");
        } else if (userData[message.author.id].playing === "no") {
            userData[message.author.id].playing = "yes";
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            firstPart();
        }
    }

    if (commandText == 'end') {
        if (userData[message.author.id].playing === "yes") {
            var endEmbed = new Discord.MessageEmbed()
                .setTitle('Pk ended')
                .setDescription(userData[message.author.id].points / userData[message.author.id].parts * 3 + ' ppg')
            message.channel.send(endEmbed);
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
