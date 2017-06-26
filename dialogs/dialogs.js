const builder = require('botbuilder');
const {getWeather} = require('./../weather-api/weather-api');

var helloName = (session) => {
    let name = session.message.text;
    session.userData.name = name;
    session.send(`Hello ${name}. What can I do for you ?`);
};

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
            console.log(weatherStatus);
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

// var askLocation = [
//     (session) => {
//     },
//     (session, results) => {
//         session.endDialogWithResult(results);
//     }
// ];

module.exports = {helloName, weather};
