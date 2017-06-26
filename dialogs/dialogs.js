const builder = require('botbuilder');
const {getWeather} = require('./../weather-api/weather-api');

var helloName = (session) => {
    let name = session.message.text;
    session.userData.name = name;
    session.send(`Hello ${name}. What can I do for you ?`);
};

var weather = [
    function(session) {
        session.beginDialog('askLocation');
    },
    async (session, results) => {
        try {
            session.dialogData.location = results.response;
            let weatherStatus = await getWeather(session.dialogData.location);
            session.endDialog(weatherStatus);
        } catch(e) {
            console.log(e);
        }
    }
];

var askLocation = [
    (session) => {
        builder.Prompts.text(session, 'Please, give me your location');
    },
    (session, results) => {
        session.endDialogWithResult(results);
    }
];

module.exports = {helloName, weather, askLocation};
