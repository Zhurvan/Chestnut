const Discord = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Sends a list of all commands with wiki links.',
    execute(message, prefix) {
        var helpEmbed = new Discord.MessageEmbed()
            .setTitle('Commands')
            .setDescription('[`' + prefix + 'help`](https://github.com/Bubblebyb/pk-bot/wiki/Help): Gives a list of commands \n' +
                '[`' + prefix + 'prefix`](https://github.com/Bubblebyb/pk-bot/wiki/prefix): Displays or changes the current prefix \n' +
                '[`' + prefix + 'params`](https://github.com/Bubblebyb/pk-bot/wiki/Parameters): Sets a filter and selects bonuses for a pk \n' +
                '[`' + prefix + 'pk`](https://github.com/Bubblebyb/pk-bot/wiki/pk): Starts the pk \n' +
                '[`' + prefix + 'skip`](https://github.com/Bubblebyb/pk-bot/wiki/skip): Skips to the next question \n ' +
                '[`' + prefix + 'pause`](https://github.com/Bubblebyb/pk-bot/wiki/Pause): Pauses the pk \n ' +
                '[`' + prefix + 'play`](https://github.com/Bubblebyb/pk-bot/wiki/Play): Unpauses the pk \n ' +
                '[`' + prefix + 'end`](https://github.com/Bubblebyb/pk-bot/wiki/End): Ends the pk')
            .setFooter('Click on any of the commands to go to their wiki page')
        message.channel.send(helpEmbed);
    },
};