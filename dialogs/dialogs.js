const builder = require('botbuilder');
const {getWeather} = require('./../weather-api/weather-api');

var hello = [
    (session, args, next) => {
        if (!session.userData.name) {
            builder.Prompts.text(session, 'Hi! What is your name?');
        } else {
            next();
        }
    },
    (session, results) => {
        session.userData.name = results.response || session.userData.name;
        session.endDialog(`Hello ${session.userData.name}. What can I do for you ?`);
    }
];

var weather = [
    (session, args) => {
        if (args && args.reprompt) {
            builder.Prompts.text(session, 'Unable to retrieve data, please, give me your location again');
        } else {
            builder.Prompts.text(session, 'Please, give me your location');
        }
    },
    async (session, results) => {
        try {
            session.dialogData.location = results.response;
            let weatherStatus = await getWeather(session.dialogData.location);
            session.endDialog(weatherStatus);
        } catch(e) {
                if (e.code === 'ENOTFOUND') {
                    console.log('Unable to connect to API.');
                } else {
                    console.log(e.message);
                }
            session.replaceDialog('weather', {reprompt: true});
        }
    }
];


module.exports = {hello, weather};
