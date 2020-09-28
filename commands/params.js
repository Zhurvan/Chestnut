const fs = require('fs');
const names = require('../scripts/names');

module.exports = {
    name: 'params',
    description: 'Sets parameters and selects questions.',
    execute(message, args, questions, userData, userQuestions) {

        function singleFilter(num) {
            if (parseInt(args[num])) {
                args[num] = parseInt(args[num]);
            }
            if (typeof args[num] === 'number') {
                if (args[num] < 10) {
                    questions.data.bonuses.forEach(bonus => {
                        if (bonus.tournament.difficulty_num === args[num]) {
                            userQuestions[message.author.id].bonuses.push(bonus);
                        }
                    });
                    if (userQuestions[message.author.id].bonuses.length === 0) {
                        message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty.');
                    } else {
                        message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                    }
                } else if (args[num] < 2021 || args[num] > 2005) {
                    questions.data.bonuses.forEach(bonus => {
                        if (bonus.tournament.year === args[num]) {
                            userQuestions[message.author.id].bonuses.push(bonus);
                        }
                    });
                    if (userQuestions[message.author.id].bonuses.length === 0) {
                        message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty.');

                    } else {
                        message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                    }
                } else {
                    message.channel.send('Send a number from 1 to 9 for a difficulty and a number from 2005 to 2020 for a year.')
                }
            } else if (typeof args[num] === 'string') {
                names.change(args, num);
                questions.data.bonuses.forEach(bonus => {
                        if (bonus.category.name.toLowerCase() === args[num].toLowerCase()) {
                            userQuestions[message.author.id].bonuses.push(bonus);
                            userData[message.author.id].categories.push(args[num])
                        } else if (bonus.subcategory.name && bonus.subcategory.name.toLowerCase() === args[num].toLowerCase()) {
                            userQuestions[message.author.id].bonuses.push(bonus);
                            userData[message.author.id].categories.push(args[num])
                        }
                });
                if (userQuestions[message.author.id].bonuses.length === 0) {
                    message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty.');

                } else {
                    message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                    userData[message.author.id].categories = [...new Set(userData[message.author.id].categories)];
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                }
            } else {
                message.channel.send('Send a number from 1 to 9 to select a difficulty and the name of a category to select a category.')
            }
        }

        function multipleFilters(num1, num2) {
            if (parseInt(args[num2])) {
                args[num2] = parseInt(args[num2])
            }
            if (typeof args[num1] === 'number' || typeof args[num2] === 'string') {
                message.channel.send('Please include the category first and then the difficulty');
            } else {
                names.change(args, num1);
                questions.data.bonuses.forEach(bonus => {
                    if (bonus.category.name && bonus.category.name.toLowerCase() === args[num1].toLowerCase() && bonus.tournament.difficulty_num === args[num2]) {
                        userQuestions[message.author.id].bonuses.push(bonus);
                        userData[message.author.id].categories.push(args[num1])
                    } else if (bonus.subcategory.name && bonus.subcategory.name === args[num1] && bonus.tournament.difficulty_num === args[num2]) {
                        userQuestions[message.author.id].bonuses.push(bonus);
                        userData[message.author.id].categories.push(args[num1])
                    }
                });
                if (userQuestions[message.author.id].bonuses.length === 0) {
                    message.channel.send('It seems that that filter returned no bonuses. Try setting a different category or difficulty.');
                } else {
                    message.channel.send('Selected ' + userQuestions[message.author.id].bonuses.length + ' questions!');
                    userData[message.author.id].categories = [...new Set(userData[message.author.id].categories)];
                    fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                }
            }
        }

        function tournament(num1, num2) {
            if (parseInt(args[num2])) {
                args[num2] = parseInt(args[num2]);
            }
            if(typeof num1 === 'number' && typeof num2 === 'string') {
                message.channel.send('The first phrase should be the name of the tournament and the second phrase should be the year.');
            }
        }

        if (userData[message.author.id].playing === 'yes') {
            message.channel.send("You can't change parameters while inside a pk!");
        } else {
            if (args[0] === 'add' || args[0] === 'a') {
                if (args[1] && !args[2]) {
                    singleFilter(1);
                }
                if (args[1] && args[2]) {
                    multipleFilters(1, 2);
                }
            } else if (args[0] && !args[1]) {
                userQuestions[message.author.id].bonuses = [];
                if (args[0] === 'reset' || args[0] === 'r') {
                    message.channel.send('Parameters reset.');
                } else if (args[0] === 'all') {
                    userQuestions[message.author.id].bonuses.push("all");
                    message.channel.send('Selected ' + questions.data.bonuses.length + ' questions.');
                } else {
                    singleFilter(0);
                }
            } else if (args[0] && args[1]) {
                userQuestions[message.author.id].bonuses = [];
                multipleFilters(0, 1)
            }
        }
    },
};
