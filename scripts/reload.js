const fs = require('fs');

function reloadUserData() {
    userFile = fs.readFileSync('./data/users.json');
    userData = JSON.parse(userFile);
}

function reloadGuildData() {
    guildFile = fs.readFileSync('./data/guilds.json');
    guildData = JSON.parse(guildFile);
}

module.exports = {reloadUserData, reloadGuildData}