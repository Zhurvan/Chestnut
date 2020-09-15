const fs = require('fs');
const fetch = require('node-fetch');
const reload = require('./reload');

function search(answer, player, userData) {
    userData[player.id].link = ''
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${answer}`;
    return fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const results = data.query.search;
            let result = results[0]
            userData[player.id].link = encodeURI(`https://en.wikipedia.org/wiki/${result.title}`);
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            reload.reloadUserData();
        })
        .catch(() => {
            console.log('An error occurred')
        });
}

module.exports = { search }