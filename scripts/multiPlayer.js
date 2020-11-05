const fs = require('fs');
const Discord = require('discord.js');
const dice = require('dice-coefficient');
const replace = require('./replace');
const wikipedia = require('./wikipedia');

function firstPart(message, prefix, player, userData, userQuestions, selectedQuestions, userAnswers) {
    let n = Math.floor((Math.random() * selectedQuestions.bonuses.length));
    replace.strings(n, selectedQuestions);
    wikipedia.search(selectedQuestions.bonuses[n].answers[0], player, userData);
    let firstEmbed = new Discord.MessageEmbed()
        .setColor(userData[player.id].color.bar.value)
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus One')
        .addField('For ' + player.displayName, userData[player.id].color.part1 + selectedQuestions.bonuses[n].formatted_leadin + ' ' + selectedQuestions.bonuses[n].formatted_texts[0] + userData[player.id].color.part2)
        .setFooter(userData[player.id].points + ' points in ' + userData[player.id].parts + ' bonus parts');
    message.channel.send(firstEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === player.id);
    collector.on('collect', message => {
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions, userAnswers);
        } else if (userData[player.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[player.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[player.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content.startsWith('_ ')) {
        } else if (message.content.includes(prefix + 'color')) {
            message.channel.send('You cannot change colors while in a pk!');
        } else if (userData[player.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[0].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[player.id].link + ') \n\nReact with the given emoji to override the decision')
                userData[player.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[player.id].points -= 10;
                        if (!userAnswers[player.id].indexOf(selectedQuestions.bonuses.answers[0])) {
                            userAnswers[player.id].push(selectedQuestions.bonuses.answers[0]);
                        }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[player.id].points += 10;
                        if (userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[0])) {
                            userAnswers[player.id].splice(userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[0]));
                        }
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[player.id].link + ') \n\nReact with the given emoji to override the decision')
                userAnswers[player.id].push(selectedQuestions.bonuses[n].answers[0]);
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[player.id].points += 10;
                        if (userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[0])) {
                            userAnswers[player.id].splice(userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[0]));
                        }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[player.id].points -= 10;
                        if (!userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[0])) {
                            userAnswers[player.id].push(selectedQuestions.bonuses[n].answers[0]);
                        }
                    });
                });
            }
            userData[player.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            secondPart(message, prefix, player, userData, userQuestions, n, selectedQuestions, userAnswers);
            collector.stop();
        }
    });
}

function secondPart(message, prefix, player, userData, userQuestions, n, selectedQuestions, userAnswers) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[1], player, userData);
    let secondEmbed = new Discord.MessageEmbed()
        .setColor(userData[player.id].color.bar.value)
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Two')
        .addField('For ' + player.displayName, userData[player.id].color.part1 + selectedQuestions.bonuses[n].formatted_texts[1] + userData[player.id].color.part2)
        .setFooter(userData[player.id].points + ' points in ' + userData[player.id].parts + ' bonus parts');
    message.channel.send(secondEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === player.id);
    collector.on('collect', message => {
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions, userAnswers);
        } else if (userData[player.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[player.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[player.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content.startsWith('_ ')) {
        } else if (message.content.includes(prefix + 'color')) {
            message.channel.send('You cannot change colors while in a pk!');
        } else if (userData[player.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[1].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[player.id].link + ') \n\nReact with the given emoji to override the decision')
                userData[player.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[player.id].points -= 10;
                        if (!userAnswers[player.id].indexOf(selectedQuestions.bonuses.answers[1])) {
                            userAnswers[player.id].push(selectedQuestions.bonuses.answers[1]);
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[player.id].points += 10;
                        if (userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[player.id].splice(userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[1]));
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[player.id].link + ') \n\nReact with the given emoji to override the decision')
                userAnswers[player.id].push(selectedQuestions.bonuses[n].answers[1]);
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[player.id].points += 10;
                        if (userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[player.id].splice(userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[1]));
                        }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[player.id].points -= 10;
                        if (!userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[1])) {
                            userAnswers[player.id].push(selectedQuestions.bonuses[n].answers[1]);
                        }
                    });
                });
            }
            userData[player.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            thirdPart(message, prefix, player, userData, userQuestions, n, selectedQuestions, userAnswers);
            collector.stop();
        }
    });
}

function thirdPart(message, prefix, player, userData, userQuestions, n, selectedQuestions, userAnswers) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[2], player, userData);
    let thirdEmbed = new Discord.MessageEmbed()
        .setColor(userData[player.id].color.bar.value)
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Three')
        .addField('For ' + player.displayName, userData[player.id].color.part1 + selectedQuestions.bonuses[n].formatted_texts[2] + userData[player.id].color.part2)
        .setFooter(userData[player.id].points + ' points in ' + userData[player.id].parts + ' bonus parts');
    message.channel.send(thirdEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === player.id);
    collector.on('collect', message => {
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions, userAnswers);
        } else if (userData[player.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[player.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[player.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content.startsWith('_ ')) {
        } else if (message.content.includes(prefix + 'color')) {
            message.channel.send('You cannot change colors while in a pk!');
        } else if (userData[player.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[2].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[player.id].link + ') \n\nReact with the given emoji to override the decision')
                userData[player.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[player.id].points -= 10;
                        if (!userAnswers[player.id].indexOf(selectedQuestions.bonuses.answers[2])) {
                            userAnswers[player.id].push(selectedQuestions.bonuses.answers[2]);
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[player.id].points += 10;
                        if (userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[2])) {
                            userAnswers[player.id].splice(userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[2]));
                        }
                        fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[player.id].link + ') \n\nReact with the given emoji to override the decision')
                userAnswers[player.id].push(selectedQuestions.bonuses[n].answers[2]);
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter, {dispose: true});
                    reactionCollector.on('collect', (reaction, user) => {
                        userData[player.id].points += 10;
                        if (userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[2])) {
                            userAnswers[player.id].splice(userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[2]));
                        }
                    });
                    reactionCollector.on('remove', (reaction, user) => {
                        userData[player.id].points -= 10;
                        if (!userAnswers[player.id].indexOf(selectedQuestions.bonuses[n].answers[2])) {
                            userAnswers[player.id].push(selectedQuestions.bonuses[n].answers[2]);
                        }
                    });
                });
            }
            userData[player.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions, userAnswers);
            collector.stop()
        }
    });
}

module.exports = {firstPart}