const fs = require('fs');

function reloadUserData() {
    userFile = fs.readFileSync('./data/users.json');
    userData = JSON.parse(userFile);
}

function reloadGuildData() {
    guildFile = fs.readFileSync('./data/guilds.json');
    guildData = JSON.parse(guildFile);
}

function reloadRatingData() {
    ratingsData = fs.readFileSync('./data/ratings.json');
    ratings = JSON.parse(ratingsData);
}

module.exports = {reloadUserData, reloadGuildData, reloadRatingData}