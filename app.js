const restify = require('restify');
const builder = require('botbuilder');

const {helloName, askLocation, weather} = require('./dialogs/dialogs');

// Setup Restify Server
const app = restify.createServer();
app.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', app.name, app.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
app.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

bot.dialog('/', (session, args) => {
    if (!session.userData.greeting) {
        session.send('Hello. What is your name ?');
        session.userData.greeting = true;
    } else if (!session.userData.name) {
        helloName(session);
    } else {
        session.userData = null;
    }
    session.endDialog();
});

bot.dialog('weather', weather)
    .triggerAction({
        matches: /^weather$/i
});

bot.dialog('askLocation', askLocation);
