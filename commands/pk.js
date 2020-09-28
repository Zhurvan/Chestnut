const fs = require('fs');
const Discord = require('discord.js');
const single = require('../scripts/singlePlayer');
const multi = require('../scripts/multiPlayer');

module.exports = {
    name: 'pk',
    description: 'Starts the pk',
    execute(message, args, prefix, questions, userData, userQuestions, ratings, userAnswers) {
        if (args[0]) {
            if (message.mentions.members) {
                if (message.mentions.members.first()) {
                    if (message.mentions.members.first().user.bot) {
                        message.channel.send("You can't pk with a bot!");
                    }
                    if (message.author.id === message.mentions.members.first().id) {
                        message.channel.send("To pk by yourself, use just `" + prefix + 'pk`');
                    } else {
                        if (userQuestions[message.author.id].bonuses.length && userQuestions[message.mentions.members.first().id].bonuses.length) {
                            if (userData[message.author.id].playing === 'yes' || userData[message.mentions.members.first().id].playing === 'yes' || userData[message.author.id].playing.with || userData[message.mentions.members.first().id].playing.with) {
                                message.channel.send("One of the two selected players is already in a pk!");
                            } else if (userData[message.author.id].playing === 'no' && userData[message.mentions.members.first().id].playing === 'no') {
                                if (userQuestions[message.author.id].bonuses[0] == 'all') {
                                    message.channel.send('You cannot pk with multiple people with all bonuses selected!');
                                } else {
                                    let pkWithEmbed = new Discord.MessageEmbed()
                                        .setTitle('pk Request')
                                        .setDescription(`${message.mentions.members.first().toString()}, ${message.author.toString()} wants to pk with you. \n React 👍 to accept and 👎 to decline`)
                                    message.channel.send(pkWithEmbed).then(embedMessage => {
                                        embedMessage.react('👍');
                                        embedMessage.react('👎');
                                        let pkWithFilter = (reaction, user) => {
                                            return (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') && user.id === message.mentions.members.first().id;
                                        };
                                        let pkWithReactionCollector = embedMessage.createReactionCollector(pkWithFilter);
                                        pkWithReactionCollector.on('collect', (reaction, user) => {
                                            if (reaction.emoji.name === '👍') {
                                                userData[message.author.id].playing = {};
                                                userData[message.author.id].playing.with = message.guild.members.cache.get(message.mentions.members.first().id);
                                                userData[message.author.id].playing.id = message.mentions.members.first().id;
                                                userData[message.mentions.members.first().id].playing = {};
                                                userData[message.mentions.members.first().id].playing.with = message.guild.members.cache.get(message.author.id);
                                                userData[message.mentions.members.first().id].playing.id = message.author.id;
                                                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                                                let player = message.guild.members.cache.get(message.author.id)
                                                let selectedQuestions = userQuestions[player.id];
                                                multi.firstPart(message, prefix, player, userData, userQuestions, selectedQuestions, userAnswers);
                                            }
                                            pkWithReactionCollector.stop();
                                        });
                                    });
                                }
                            }
                        } else {
                            message.channel.send("It looks like someone doesn't have any bonuses selected. Try selecting some with `" + prefix + 'params`')
                        }
                    }
                }
            } else {
                message.channel.send("Try just `" + prefix + "pk` instead. Don't forget to set parameters with `" + prefix + 'params` beforehand!');
            }
        } else {
            if (userQuestions[message.author.id].bonuses.length) {
                if (userData[message.author.id].playing === "yes" || userData[message.author.id].playing.with) {
                    message.channel.send("You're already in a pk!");
                } else if (userData[message.author.id].playing === "no") {
                    userData[message.author.id].playing = "yes";
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    if (userQuestions[message.author.id].bonuses[0] === 'all') {
                        console.log('ok')
                        let selectedQuestions = questions.data;
                        single.firstPart(message, prefix, userData, selectedQuestions, ratings, userAnswers);
                    } else {
                        let selectedQuestions = userQuestions[message.author.id];
                        single.firstPart(message, prefix, userData, selectedQuestions, ratings, userAnswers);
                    }
                }
            } else {
                message.channel.send("It looks like you don't have any bonuses selected. Try selecting some with `" + prefix + 'params`')
            }
        }
    },
};