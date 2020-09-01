const fs = require('fs');
const reload = require('../scripts/reload')

module.exports = {
    name: 'prefix',
    description: 'Displays or changes the prefix.',
    execute(message, args, guildData, prefix) {
        if (args[0]) {
            if (message.member.hasPermission("ADMINISTRATOR")) {
                if (args[0] == 'reset') {
                    guildData[message.guild.id].prefix = '+';
                    fs.writeFileSync('./data/guilds.json', JSON.stringify(guildData));
                    reload.reloadGuildData();
                    message.channel.send('Prefix has been reset to `+`');
                } else {
                    guildData[message.guild.id].prefix = args[0]
                    fs.writeFileSync('./data/guilds.json', JSON.stringify(guildData));
                    reload.reloadGuildData();
                    message.channel.send('Prefix has been set to `' + args[0] + '`');
                }
            } else {
                message.channel.send("You don't have the correct permissions to do that!")
            }
        } else {
            message.channel.send('The current prefix is `' + prefix + '`');
        }
    },
};