const fs = require('fs');
const ntc = require('ntc');

module.exports = {
    name: 'color',
    description: "Displays or changes the user's selected color.",
    execute(message, args, userData) {
        if (args[0]) {
            args[0] = args[0].toLowerCase();
            if (args[0] === 'bar' || args[0] === 'b') {
                if(args[1]) {
                  if(/^#([0-9A-F]{3}){1,2}$/i.test(args[1])) {
                      userData[message.author.id].color.bar.name = ntc.name(args[1])[1];
                      userData[message.author.id].color.bar.value = args[1];
                      fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                      message.channel.send('Bar Color changed to ' + ntc.name(args[1])[1]);
                  }
                  else {
                      message.channel.send('That is not a valid HEX color code.')
                  }
                }
                else {
                 message.channel.send('Current Bar Color is ' + userData[message.author.id].color.bar.name)   ;
                }
            }
            switch (args[0]) {
                case 'blue':
                    userData[message.author.id].color.name = 'Blue';
                    userData[message.author.id].color.part1 = '```ini\n[';
                    userData[message.author.id].color.part2 = ']```';
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    message.channel.send('Color changed to ' + userData[message.author.id].color.name);
                    break;
                case 'cyan':
                    userData[message.author.id].color.name = 'Cyan';
                    userData[message.author.id].color.part1 = '```json\n"';
                    userData[message.author.id].color.part2 = '"```';
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    message.channel.send('Color changed to ' + userData[message.author.id].color.name);
                    break;
                case 'yellow':
                    userData[message.author.id].color.name = 'Yellow';
                    userData[message.author.id].color.part1 = '```fix\n';
                    userData[message.author.id].color.part2 = '```';
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    message.channel.send('Color changed to ' + userData[message.author.id].color.name);
                    break;
                case 'red':
                    userData[message.author.id].color.name = 'Red';
                    userData[message.author.id].color.part1 = '```diff\n-';
                    userData[message.author.id].color.part2 = '```';
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    message.channel.send('Color changed to ' + userData[message.author.id].color.name);
                    break;
                case 'green':
                    userData[message.author.id].color.name = 'Green';
                    userData[message.author.id].color.part1 = '```diff\n+';
                    userData[message.author.id].color.part2 = '```';
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    message.channel.send('Color changed to ' + userData[message.author.id].color.name);
                    break;
                case 'gray':
                    userData[message.author.id].color.name = 'Gray';
                    userData[message.author.id].color.part1 = '';
                    userData[message.author.id].color.part2 = '';
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                    message.channel.send('Color changed to ' + userData[message.author.id].color.name);
            }
        } else {
            message.channel.send('Your current color is ' + userData[message.author.id].color.name);
        }
    },
};