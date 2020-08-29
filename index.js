const fs = require('fs');
const dice = require('dice-coefficient');
const fetch = require('node-fetch');
const Discord = require('discord.js');

let questionsData = fs.readFileSync('./data/questions.json');
let questions = JSON.parse(questionsData);
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

function reloadUserData() {
  userFile = fs.readFileSync('./data/users.json');
  userData = JSON.parse(userFile);
}

function reloadGuildData() {
  guildFile = fs.readFileSync('./data/guilds.json');
  guildData = JSON.parse(guildFile);
}

const client = new Discord.Client();

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

  if (message.channel instanceof Discord.DMChannel) {} else {

    reloadUserData();
    reloadGuildData();

    function initUserData() {
      userData[message.author.id] = {};
      userData[message.author.id].points = 0;
      userData[message.author.id].parts = 0;
      userData[message.author.id].playing = "no";
      fs.writeFileSync('./data/users.json', JSON.stringify(userData));
      reloadUserData();
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
    }

    const prefix = guildData[message.guild.id].prefix;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const isCommand = message.content.startsWith(prefix);

    function wikipediaSearch(answer, player) {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${answer}`;
      return fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          const results = data.query.search;
          let result = results[0]
          const url = encodeURI(`https://en.wikipedia.org/wiki/${result.title}`);
          userData[player.id].link = url;
          fs.writeFileSync('./data/users.json', JSON.stringify(userData));
          reloadUserData();
        })
        .catch(() => console.log('An error occurred'));
    }

    function replaceStrings(n, selectedQuestions) {
      selectedQuestions.bonuses[n].formatted_answers[0] = selectedQuestions.bonuses[n].formatted_answers[0].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/<\/?u>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '').trim();
      selectedQuestions.bonuses[n].formatted_answers[1] = selectedQuestions.bonuses[n].formatted_answers[1].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/<\/?u>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '').trim();
      selectedQuestions.bonuses[n].formatted_answers[2] = selectedQuestions.bonuses[n].formatted_answers[2].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/<\/?u>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '').trim();
      selectedQuestions.bonuses[n].answers[0] = selectedQuestions.bonuses[n].answers[0].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '').trim();
      selectedQuestions.bonuses[n].answers[1] = selectedQuestions.bonuses[n].answers[1].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '').trim();
      selectedQuestions.bonuses[n].answers[2] = selectedQuestions.bonuses[n].answers[2].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '').trim();
      selectedQuestions.bonuses[n].formatted_leadin = selectedQuestions.bonuses[n].formatted_leadin.replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
      selectedQuestions.bonuses[n].formatted_texts[0] = selectedQuestions.bonuses[n].formatted_texts[0].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
      selectedQuestions.bonuses[n].formatted_texts[1] = selectedQuestions.bonuses[n].formatted_texts[1].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
      selectedQuestions.bonuses[n].formatted_texts[2] = selectedQuestions.bonuses[n].formatted_texts[2].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*');
    }

    function firstPart(selectedQuestions) {
      let n = Math.floor((Math.random() * selectedQuestions.bonuses.length));
      replaceStrings(n, selectedQuestions);
      wikipediaSearch(selectedQuestions.bonuses[n].answers[0], message.author);
      let firstEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus One')
        .setDescription(selectedQuestions.bonuses[n].formatted_leadin + ' ' +
          selectedQuestions.bonuses[n].formatted_texts[0])
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
      message.channel.send(firstEmbed);
      let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
      collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
          collector.stop();
        } else if (message.content == prefix + 'skip') {
          collector.stop();
          firstPart(selectedQuestions);
        } else if (userData[message.author.id].playing === 'no') {
          collector.stop();
        } else if (collectorArgs[0] === '_') {} else {
          if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[0].toLowerCase()) > 0.4) {
            var correctEmbed = new Discord.MessageEmbed()
              .setColor('#53d645')
              .setTitle('🟢 Correct')
              .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
            userData[message.author.id].points += 10;
            message.channel.send(correctEmbed).then(embedMessage => {
              embedMessage.react('✅');
              embedMessage.react('❌');
              let filter = (reaction, user) => {
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
              };
              let reactionCollector = embedMessage.createReactionCollector(filter);
              reactionCollector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '❌') {
                  userData[message.author.id].points -= 10;
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
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
              };
              let reactionCollector = embedMessage.createReactionCollector(filter);
              reactionCollector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '✅') {
                  userData[message.author.id].points += 10;
                  fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                }
                reactionCollector.stop();
              });
            });
          }
          userData[message.author.id].parts++
          fs.writeFileSync('./data/users.json', JSON.stringify(userData));
          secondPart(n, selectedQuestions);
          collector.stop()
        }
      });
    }

    function secondPart(n, selectedQuestions) {
      wikipediaSearch(selectedQuestions.bonuses[n].answers[1], message.author);
      let secondEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Two')
        .setDescription(selectedQuestions.bonuses[n].formatted_texts[1])
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
      message.channel.send(secondEmbed);

      let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
      collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
          collector.stop();
        } else if (message.content == prefix + 'skip') {
          collector.stop();
          firstPart(selectedQuestions);
        } else if (userData[message.author.id].playing === 'no') {
          collector.stop();
        } else if (collectorArgs[0] === '_') {} else {
          if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[1].toLowerCase()) > 0.4) {
            var correctEmbed = new Discord.MessageEmbed()
              .setColor('#53d645')
              .setTitle('🟢 Correct')
              .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
            userData[message.author.id].points += 10;
            message.channel.send(correctEmbed).then(embedMessage => {
              embedMessage.react('✅');
              embedMessage.react('❌');
              let filter = (reaction, user) => {
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
              };
              let reactionCollector = embedMessage.createReactionCollector(filter);
              reactionCollector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '❌') {
                  userData[message.author.id].points -= 10;
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
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
              };
              let reactionCollector = embedMessage.createReactionCollector(filter);
              reactionCollector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '✅') {
                  userData[message.author.id].points += 10;
                  fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                }
                reactionCollector.stop();
              });
            });
          }
          userData[message.author.id].parts++
          fs.writeFileSync('./data/users.json', JSON.stringify(userData));
          thirdPart(n, selectedQuestions);
          collector.stop()
        }
      });
    }

    function thirdPart(n, selectedQuestions) {
      wikipediaSearch(selectedQuestions.bonuses[n].answers[2], message.author);
      let thirdEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Three')
        .setDescription(selectedQuestions.bonuses[n].formatted_texts[2])
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
      message.channel.send(thirdEmbed);
      let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
      collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
          collector.stop();
        } else if (message.content == prefix + 'skip') {
          collector.stop();
          firstPart(selectedQuestions);
        } else if (userData[message.author.id].playing === 'no') {
          collector.stop();
        } else if (collectorArgs[0] === '_') {} else {

          if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[2].toLowerCase()) > 0.4) {
            var correctEmbed = new Discord.MessageEmbed()
              .setColor('#53d645')
              .setTitle('🟢 Correct')
              .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
            userData[message.author.id].points += 10;
            message.channel.send(correctEmbed).then(embedMessage => {
              embedMessage.react('✅');
              embedMessage.react('❌');
              let filter = (reaction, user) => {
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
              };
              let reactionCollector = embedMessage.createReactionCollector(filter);
              reactionCollector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '❌') {
                  userData[message.author.id].points -= 10;
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
                return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
              };
              let reactionCollector = embedMessage.createReactionCollector(filter);
              reactionCollector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '✅') {
                  userData[message.author.id].points += 10;
                  fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                }
                reactionCollector.stop();
              });
            });
          }
          userData[message.author.id].parts++
          fs.writeFileSync('./data/users.json', JSON.stringify(userData));
          firstPart(selectedQuestions);
          collector.stop()
        }
      });
    }

    function firstPartMulti(selectedQuestions, player) {
      let n = Math.floor((Math.random() * selectedQuestions.bonuses.length));
      replaceStrings(n, selectedQuestions);
      wikipediaSearch(selectedQuestions.bonuses[n].answers[0], player);
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
          firstPartMulti(selectedQuestions, player);
        } else if (userData[player.id].playing === 'no') {
          collector.stop();
        } else if (collectorArgs[0] === '_') {} else {
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
          secondPartMulti(n, selectedQuestions, player);
          collector.stop()
        }
      });
    }

    function secondPartMulti(n, selectedQuestions, player) {
      wikipediaSearch(selectedQuestions.bonuses[n].answers[1], player);
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
          firstPartMulti(selectedQuestions, player);
        } else if (userData[player.id].playing === 'no') {
          collector.stop();
        } else if (collectorArgs[0] === '_') {} else {
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
          thirdPartMulti(n, selectedQuestions, player);
          collector.stop()
        }
      });
    }

    function thirdPartMulti(n, selectedQuestions, player) {
      wikipediaSearch(selectedQuestions.bonuses[n].answers[2], player);
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
          firstPartMulti(selectedQuestions, player);
        } else if (userData[player.id].playing === 'no') {
          collector.stop();
        } else if (collectorArgs[0] === '_') {} else {
          if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[2].toLowerCase()) > 0.4) {
            var correctEmbed = new Discord.MessageEmbed()
              .setColor('#53d645')
              .setTitle('🟢 Correct')
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
          firstPartMulti(selectedQuestions, player);
          collector.stop()
        }
      });
    }

    function categoryNames(args, num) {
      args[num] = args[num].toLowerCase();
      switch (args[num]) {
        case 'ce':
          args[num] = 'Current Events';
          break;
        case 'fa':
          args[num] = 'Fine Arts';
          break;
        case 'sosc':
          args[num] = 'Social Science';
          break;
        case 'geo':
          args[num] = 'Geography';
          break;
        case 'hist':
          args[num] = 'History';
          break;
        case 'lit':
          args[num] = 'Literature';
          break;
        case 'myth':
          args[num] = 'Mythology';
          break;
        case 'philo':
          args[num] = 'Philosophy';
          break;
        case 'rel':
          args[num] = 'Religion';
          break;
        case 'sci':
          args[num] = 'Science';
      }
    }

    if (isCommand) {

      if (command == 'prefix') {
        if (args[0]) {
          if (message.member.hasPermission("ADMINISTRATOR")) {
            if (args[0] == 'reset') {
              guildData[message.guild.id].prefix = '+';
              fs.writeFileSync('./data/guilds.json', JSON.stringify(guildData));
              reloadGuildData();
              message.channel.send('Prefix has been reset to `+`');
            } else {
              guildData[message.guild.id].prefix = args[0]
              fs.writeFileSync('./data/guilds.json', JSON.stringify(guildData));
              reloadGuildData();
              message.channel.send('Prefix has been set to `' + args[0] + '`');
            }
          } else {
            message.channel.send("You don't have the correct permissions to do that!")
          }
        } else {
          message.channel.send('The current prefix is `' + prefix + '`');
        }
      }

      if (command == 'params') {
        if (userData[message.author.id].playing === 'yes') {
          message.channel.send("You can't change parameters while inside a pk!");
        } else {
          if (args[0] == 'reset') {
            userQuestions[message.author.id].bonuses = [];
            userQuestions[message.author.id].bonusesTemp = [];
            message.channel.send('Parameters reset!');
            fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
          } else if (args[0] == 'all') {
            userQuestions[message.author.id].bonuses.push('all');
            message.channel.send('Selected ' + questions.data.bonuses.length + ' questions!');
            fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
          } else if (args[0] == 'diff') {
            if (!args[1]) {
              message.channel.send('Please add a difficulty (from 1 to 2) after the command');
            } else if (args[1]) {
              userQuestions[message.author.id].bonuses = []
              questions.data.bonuses.forEach(bonus => {
                if (bonus.tournament.difficulty_num == args[1]) {
                  userQuestions[message.author.id].bonuses.push(bonus);
                }
              });
              if (userQuestions[message.author.id].bonuses.length === 0) {
                message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty.');

              } else {
                message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
              }
            }
          } else if (args[0] == 'cat') {
            if (!args[1]) {
              message.channel.send('Please add a category after the command');
            } else if (args[1]) {
              categoryNames(args, 1);
              userQuestions[message.author.id].bonuses = []
              questions.data.bonuses.forEach(bonus => {
                if (bonus.category.name.toLowerCase() == args[1].toLowerCase()) {
                  userQuestions[message.author.id].bonuses.push(bonus);
                }
              });
              if (userQuestions[message.author.id].bonuses.length === 0) {
                message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty and be sure to check your spelling.');

              } else {
                message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
              }
            }
          } else if (args[0] == 'add') {
            if (args[1] && args[2]) {
              categoryNames(args, 1)

              questions.data.bonuses.forEach(bonus => {
                if (bonus.category.name.toLowerCase() == args[1].toLowerCase() && bonus.tournament.difficulty_num == args[2]) {
                  userQuestions[message.author.id].bonuses.push(bonus);
                }
              });
              if (userQuestions[message.author.id].bonuses.length === 0) {
                message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty and be sure to check your spelling.');

              } else {
                message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
              }
            } else {
              message.channel.send('Please include both a category and difficulty in the command.');
            }

          } else {
            if (args[0] && args[1]) {
              if (Number.isInteger(args[0]) && !Number.isInteger(args[1])) {
                message.channel.send('The first argument sent must be the name or shortened name of a category. The second must be a number from 1 to 9 denoting difficulty. Try `' + prefix + 'help` and click the link for `' + prefix + 'params` for more information.')
              } else {
                categoryNames(args, 0);
                userQuestions[message.author.id].bonuses = []
                questions.data.bonuses.forEach(bonus => {
                  if (bonus.category.name.toLowerCase() == args[0].toLowerCase() && bonus.tournament.difficulty_num == args[1]) {
                    userQuestions[message.author.id].bonuses.push(bonus);
                  }
                });
                if (userQuestions[message.author.id].bonuses.length === 0) {
                  message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty and be sure to check your spelling.');

                } else {
                  message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                  fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
                }
              }
            } else {
              message.channel.send('Please include both a category and difficulty in the command.');
            }
          }
        }
      }

      if (command == 'help') {
        var helpEmbed = new Discord.MessageEmbed()
          .setTitle('Commands')
          .setDescription('[`' + prefix + 'help`](https://github.com/Bubblebyb/pk-bot/wiki/Help): Gives a list of commands \n [`' + prefix + 'prefix`](https://github.com/Bubblebyb/pk-bot/wiki/prefix): Displays or changes the current prefix \n  [`' + prefix + 'params`](https://github.com/Bubblebyb/pk-bot/wiki/Parameters): Sets a filter and selects bonuses for a pk \n [`' + prefix + 'pk`](https://github.com/Bubblebyb/pk-bot/wiki/pk): Starts the pk \n [`' + prefix + 'skip`](https://github.com/Bubblebyb/pk-bot/wiki/skip): Skips to the next question \n [`' + prefix + 'end`](https://github.com/Bubblebyb/pk-bot/wiki/End): Ends the pk')
          .setFooter('Click on any of the commands to go to their wiki page')
        message.channel.send(helpEmbed);
      }

      if (command == 'pk') {
        if (args[0]) {
          if (message.mentions.members.first()) {
            if (message.mentions.members.first().user.bot) {
              message.channel.send("You can't pk with a bot!");
            }
            if (message.author.id === message.mentions.members.first().id) {
              message.channel.send("To pk by yourself, use just `' + prefix + 'pk`");
            } else {
              if (!userData[message.mentions.members.first().id] || !userData[message.mentions.members.first().id]) {
                userData[message.mentions.members.first().id] = {};
                userData[message.mentions.members.first().id].points = 0;
                userData[message.mentions.members.first().id].parts = 0;
                userData[message.mentions.members.first().id].playing = "no";
                userQuestions[message.mentions.members.first().id] = {};
                userQuestions[message.mentions.members.first().id].bonuses = [];
                userQuestions[message.mentions.members.first().id].bonusesTemp = [];
                fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                fs.writeFileSync('./data/userQuestions.json', JSON.stringify(userQuestions));
                reloadUserData();
              }
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
                          userData[message.mentions.members.first().id].playing = {};
                          userData[message.mentions.members.first().id].playing.with = message.guild.members.cache.get(message.author.id);
                          fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                          let player = message.guild.members.cache.get(message.author.id)
                          let selectedQuestions = userQuestions[player.id];
                          firstPartMulti(selectedQuestions, player);
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
              if (userQuestions[message.author.id].bonuses[0] == 'all') {
                let selectedQuestions = questions.data.bonuses;
                firstPart(selectedQuestions);
              } else {
                let selectedQuestions = userQuestions[message.author.id];
                firstPart(selectedQuestions);
              }
            }
          } else {
            message.channel.send("It looks like you don't have any bonuses selected. Try selecting some with `" + prefix + 'params`')
          }
        }
      }

      if (command == 'end') {
        if (userData[message.author.id].playing === "yes") {
          let ppb = userData[message.author.id].points / userData[message.author.id].parts * 3;
          if (isNaN(ppb)) {
            ppb = 0;
          }
          var endEmbed = new Discord.MessageEmbed()
            .setTitle('Pk ended')
            .setDescription(Math.round(ppb * 100) / 100 + ' ppb')
          message.channel.send(endEmbed);
          userData[message.author.id].points = 0;
          userData[message.author.id].parts = 0;
          userData[message.author.id].playing = "no";
          fs.writeFileSync('./data/users.json', JSON.stringify(userData));
          reloadUserData();
        } else if (userData[message.author.id].playing.with) {
          let ppb = userData[message.author.id].points / userData[message.author.id].parts * 3;
          let otherPpb = userData[userData[message.author.id].playing.with.userID].points / userData[userData[message.author.id].playing.with.userID].parts * 3
          if (isNaN(ppb)) {
            ppb = 0;
          }
          if (isNaN(otherPpb)) {
            otherPpb = 0;
          }
          var endEmbed = new Discord.MessageEmbed()
            .setTitle('Pk ended')
            .setDescription(message.author.username + ': ' + Math.round(ppb * 100) / 100 + ' ppb \n' + userData[message.author.id].playing.with.displayName + ': ' + Math.round(otherPpb * 100) / 100 + ' ppb')
          message.channel.send(endEmbed);
          userData[userData[message.author.id].playing.with.userID].points = 0;
          userData[userData[message.author.id].playing.with.userID].parts = 0;
          userData[userData[message.author.id].playing.with.userID].playing = "no"
          userData[message.author.id].points = 0;
          userData[message.author.id].parts = 0;
          userData[message.author.id].playing = "no";
          fs.writeFileSync('./data/users.json', JSON.stringify(userData));
          reloadUserData();
        } else if (userData[message.author.id].playing === "no") {
          message.channel.send("You're not in a pk.")
        }
      }
    } else {
      if (command == 'prefix') {
        message.channel.send('The current prefix is `' + prefix + '`');
      }
      if (command == 'help') {
        var helpEmbed = new Discord.MessageEmbed()
          .setTitle('Commands')
          .setDescription('[`' + prefix + 'help`](https://github.com/Bubblebyb/pk-bot/wiki/Help): Gives a list of commands \n [`' + prefix + 'prefix`](https://github.com/Bubblebyb/pk-bot/wiki/prefix): Displays the current prefix or changes the prefix \n [`' + prefix + 'params`](https://github.com/Bubblebyb/pk-bot/wiki/Parameters): Sets a filter and selects bonuses for a pk \n [`' + prefix + 'pk`](https://github.com/Bubblebyb/pk-bot/wiki/pk): Starts the pk \n [`' + prefix + 'skip`](https://github.com/Bubblebyb/pk-bot/wiki/skip): Skips to the next question \n [`' + prefix + 'end`](https://github.com/Bubblebyb/pk-bot/wiki/End): Ends the pk')
          .setFooter('Click on any of the commands to go to their wiki page')
        message.channel.send(helpEmbed);
      }
    }
  }
});


client.login(TOKEN);
