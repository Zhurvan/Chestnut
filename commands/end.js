const fs = require('fs');
const Discord = require('discord.js');
const reload = require('../scripts/reload')

module.exports = {
    name: 'end',
    description: "Ends the pk and sends an embed with the player's ppg",
    execute(message, userData) {
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
            userData[message.author.id].paused = 'no';
            userData[message.author.id].link = '';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            reload.reloadUserData();
        } else if (userData[message.author.id].playing.with) {
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            reload.reloadUserData();
            let ppb = userData[message.author.id].points / userData[message.author.id].parts * 3;
            let otherPpb = userData[userData[message.author.id].playing.id].points / userData[userData[message.author.id].playing.id].parts * 3
            if (isNaN(ppb)) {
                ppb = 0;
            }
            if (isNaN(otherPpb)) {
                otherPpb = 0;
            }
            var endEmbed = new Discord.MessageEmbed()
                .setTitle('Pk ended')
                .setDescription(message.guild.members.cache.get(message.author.id).nickname + ': ' + Math.round(ppb * 100) / 100 + ' ppb \n' + userData[message.author.id].playing.with.displayName + ': ' + Math.round(otherPpb * 100) / 100 + ' ppb')
            message.channel.send(endEmbed);
            userData[userData[message.author.id].playing.id].points = 0;
            userData[userData[message.author.id].playing.id].parts = 0;
            userData[userData[message.author.id].playing.id].playing = 'no'
            userData[userData[message.author.id].playing.id].paused = 'no'
            userData[userData[message.author.id].playing.id].link = ''
            userData[message.author.id].points = 0;
            userData[message.author.id].parts = 0;
            userData[message.author.id].playing = 'no';
            userData[message.author.id].paused = 'no';
            userData[message.author.id].link = '';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            reload.reloadUserData();
        } else if (userData[message.author.id].playing === "no") {
            message.channel.send("You're not in a pk.")
        }
    },
};