const fs = require('fs');
const Discord = require('discord.js');
const dice = require('dice-coefficient');
const replace = require('./replace');
const wikipedia = require('./wikipedia');

function firstPart(message, prefix, userData, selectedQuestions, ratings, userAnswers) {
    let n = Math.floor((Math.random() * selectedQuestions.bonuses.length));
    replace.strings(n, selectedQuestions);
    wikipedia.search(selectedQuestions.bonuses[n].answers[0], message.author, userData);
    let firstEmbed = new Discord.MessageEmbed()
        .setColor(userData[message.author.id].color.bar.value)
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus One')
        .setDescription(userData[message.author.id].color.part1 + selectedQuestions.bonuses[n].formatted_leadin + ' ' +
            selectedQuestions.bonuses[n].formatted_texts[0] + userData[message.author.id].color.part2)
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
    message.channel.send(firstEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (userData[message.author.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            firstPart(message, prefix, userData, selectedQuestions, ratings, userAnswers);
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            message.channel.send('The game has been paused.')
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no';
            message.channel.send('The game has been restarted.')
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (collectorArgs[0] === '_ ') {
        } else if (message.content.includes(prefix + 'color')) {
            message.channel.send('You cannot change colors while in a pk!');
        } else if (userData[message.author.id].paused === 'no') {
            if (!ratings[selectedQuestions.bonuses[n].answers[0]]) {
                ratings[selectedQuestions.bonuses[n].answers[0]] = {}
                if (!ratings[selectedQuestions.bonuses[n].answers[0]][message.content] && message.content.length > 2) {
                    ratings[selectedQuestions.bonuses[n].answers[0]][message.content] = 0
                }
                fs.writeFileSync('./data/ratings.json', JSON.stringify(ratings, null, 4))
            }
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[0].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[message.author.id].link + ') \n\nReact with the given emoji to override the decision')
                userData[message.author.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[message.author.id].points -= 10;
                        if(!userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[0])) {
                            userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[0]);
                        }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[message.author.id].points += 10;
                        if (userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[0])) {
                            userAnswers[message.author.id].splice(userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[0]));
                        }
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[message.author.id].link + ') \n\nReact with the given emoji to override the decision')
                userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[0]);
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                            userData[message.author.id].points += 10;
                            if (userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[0])) {
                                userAnswers[message.author.id].splice(userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[0]));
                            }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                            userData[message.author.id].points -= 10;
                            if(!userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[0])) {
                                userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[0]);
                            }
                    });
                });
            }
            fs.writeFileSync('./data/userAnswers.json', JSON.stringify(userAnswers));
            userData[message.author.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            secondPart(message, prefix, userData, n, selectedQuestions, ratings, userAnswers);
            collector.stop()
        }
    });
}

function secondPart(message, prefix, userData, n, selectedQuestions, ratings, userAnswers) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[1], message.author, userData);
    let secondEmbed = new Discord.MessageEmbed()
        .setColor(userData[message.author.id].color.bar.value)
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Two')
        .setDescription(userData[message.author.id].color.part1 + selectedQuestions.bonuses[n].formatted_texts[1] + userData[message.author.id].color.part2)
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
    message.channel.send(secondEmbed);

    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (userData[message.author.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            firstPart(message, prefix, userData, selectedQuestions, ratings, userAnswers);
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            message.channel.send('The game has been paused.')
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no';
            message.channel.send('The game has been restarted.')
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (collectorArgs[0] === '_ ') {
        } else if (message.content.includes(prefix + 'color')) {
            message.channel.send('You cannot change colors while in a pk!');
        } else if (userData[message.author.id].paused === 'no') {
            if (!ratings[selectedQuestions.bonuses[n].answers[1]]) {
                ratings[selectedQuestions.bonuses[n].answers[1]] = {}
                if (!ratings[selectedQuestions.bonuses[n].answers[1]][message.content] && message.content.length > 2) {
                    ratings[selectedQuestions.bonuses[n].answers[1]][message.content] = 0
                }
                fs.writeFileSync('./data/ratings.json', JSON.stringify(ratings, null, 4))
            }
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[1].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[message.author.id].link + ') \n\nReact with the given emoji to override the decision')
                userData[message.author.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[message.author.id].points -= 10;
                        if(!userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[1]);
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[message.author.id].points += 10;
                        if (userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[message.author.id].splice(userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1]));
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[message.author.id].link + ') \n\nReact with the given emoji to override the decision')
                userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[1]);
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[message.author.id].points += 10;
                        if (userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[message.author.id].splice(userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1]));
                        }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[message.author.id].points -= 10;
                        if(!userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[1]);
                        }
                    });
                });
            }
            fs.writeFileSync('./data/userAnswers.json', JSON.stringify(userAnswers));
            userData[message.author.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            thirdPart(message, prefix, userData, n, selectedQuestions, ratings, userAnswers);
            collector.stop()
        }
    });
}

function thirdPart(message, prefix, userData, n, selectedQuestions, ratings, userAnswers) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[2], message.author, userData);
    let thirdEmbed = new Discord.MessageEmbed()
        .setColor(userData[message.author.id].color.bar.value)
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Three')
        .setDescription(userData[message.author.id].color.part1 + selectedQuestions.bonuses[n].formatted_texts[2] + userData[message.author.id].color.part2)
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
    message.channel.send(thirdEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (userData[message.author.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            firstPart(message, prefix, userData, selectedQuestions, ratings, userAnswers);
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            message.channel.send('The game has been paused.')
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no';
            message.channel.send('The game has been restarted.')
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (collectorArgs[0] === '_ ') {
        } else if (message.content.includes(prefix + 'color')) {
            message.channel.send('You cannot change colors while in a pk!');
        } else if (userData[message.author.id].paused === 'no') {
            if (!ratings[selectedQuestions.bonuses[n].answers[2]]) {
                ratings[selectedQuestions.bonuses[n].answers[2]] = {}
                if (!ratings[selectedQuestions.bonuses[n].answers[2]][message.content] && message.content.length > 2) {
                    ratings[selectedQuestions.bonuses[n].answers[2]][message.content] = 0
                }
                fs.writeFileSync('./data/ratings.json', JSON.stringify(ratings, null, 4))
            }
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[2].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[message.author.id].link + ') \n\nReact with the given emoji to override the decision')
                userData[message.author.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[message.author.id].points -= 10;
                        if(!userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[2])) {
                            userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[2]);
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[message.author.id].points += 10;
                        if (userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[2])) {
                            userAnswers[message.author.id].splice(userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[2]));
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[message.author.id].link + ') \n\nReact with the given emoji to override the decision')
                userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[2]);
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[message.author.id].points += 10;
                        if (userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[message.author.id].splice(userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1]));
                        }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[message.author.id].points -= 10;
                        if(!userAnswers[message.author.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[message.author.id].push(selectedQuestions.bonuses[n].answers[1]);
                        }
                    });
                });
            }
            fs.writeFileSync('./data/userAnswers.json', JSON.stringify(userAnswers));
            userData[message.author.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            firstPart(message, prefix, userData, selectedQuestions, ratings, userAnswers);
            collector.stop()
        }
    });
}

module.exports = {firstPart}