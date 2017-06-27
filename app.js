const restify = require('restify');
const builder = require('botbuilder');

const {hello, weather, getRssFeeds} = require('./dialogs/dialogs');

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

bot.dialog('/', hello);

bot.dialog('weather', weather)
    .triggerAction({
        matches: /^weather$/i
});

bot.dialog('news', getRssFeeds)
    .triggerAction({
        matches: /^news$/i
    });
