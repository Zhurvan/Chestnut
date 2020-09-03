const fs = require('fs');
const Discord = require('discord.js');
const dice = require('dice-coefficient');
const replace = require('./replace');
const wikipedia = require('./wikipedia');

function firstPart(message, prefix, player, userData, userQuestions, selectedQuestions) {
    let n = Math.floor((Math.random() * selectedQuestions.bonuses.length));
    replace.strings(n, selectedQuestions);
    wikipedia.search(selectedQuestions.bonuses[n].answers[0], player, userData);
    let firstEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus One')
        .addField('For ' + player.displayName, selectedQuestions.bonuses[n].formatted_leadin + ' ' + selectedQuestions.bonuses[n].formatted_texts[0])
        .setFooter(userData[player.id].points + ' points in ' + userData[player.id].parts + ' bonus parts');
    message.channel.send(firstEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === player.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions);
        } else if (userData[player.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (userData[message.author.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[0].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                userData[player.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '❌') {
                            userData[player.id].points -= 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            userData[player.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            }
            userData[player.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            secondPart(message, prefix, player, userData, userQuestions, n, selectedQuestions);
            collector.stop();
        }
    });
}

function secondPart(message, prefix, player, userData, userQuestions, n, selectedQuestions) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[1], player, userData);
    let secondEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Two')
        .addField('For ' + player.displayName, selectedQuestions.bonuses[n].formatted_texts[1])
        .setFooter(userData[player.id].points + ' points in ' + userData[player.id].parts + ' bonus parts');
    message.channel.send(secondEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === player.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions);
        } else if (userData[player.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (userData[message.author.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[1].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                userData[player.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '❌') {
                            userData[player.id].points -= 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });

            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            userData[player.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            }
            userData[player.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            thirdPart(message, prefix, player, userData, userQuestions, n, selectedQuestions);
            collector.stop();
        }
    });
}

function thirdPart(message, prefix, player, userData, userQuestions, n, selectedQuestions) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[2], player);
    let thirdEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Three')
        .addField('For ' + player.displayName, selectedQuestions.bonuses[n].formatted_texts[2])
        .setFooter(userData[player.id].points + ' points in ' + userData[player.id].parts + ' bonus parts');
    message.channel.send(thirdEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === player.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions);
        } else if (userData[player.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (userData[message.author.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[2].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                userData[player.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '❌') {
                            userData[player.id].points -= 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === player.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            userData[player.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            }
            userData[player.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            player = userData[player.id].playing.with;
            player.id = player.userID;
            selectedQuestions = userQuestions[player.id];
            firstPart(message, prefix, player, userData, userQuestions, selectedQuestions);
            collector.stop()
        }
    });
}

module.exports = {firstPart}