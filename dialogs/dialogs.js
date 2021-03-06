const builder = require('botbuilder');

const {getWeather} = require('./../weather-api/weather-api');
const {feeds} = require('./../newsreader/feeds');
const {newsReader} = require('./../newsreader/newsreader');

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

var news = [
    (session, args) => {
        if (args && args.reprompt) {
            session.send('Unable to retrieve data.');
        }
        let options = {listStyle: builder.ListStyle.button};
        builder.Prompts.choice(session, "Topics:", feeds.categories, options);
    },
    async (session, results) => {
        try {
            let feedCategory = feeds.categories[results.response.entity][0];
            let articles = await newsReader(feedCategory);
            let msg = new builder.Message(session);
            var articleCards = [];

            for (var i = 0; i < 20; i++) {
                let card;

                card = new builder.HeroCard(session)
                    .title(articles[i].title)
                    .images([builder.CardImage.create(session, articles[i].image)])
                    .text(articles[i].summary)
                    .buttons([
                        builder.CardAction.openUrl(session, articles[i].link, "Read")
                    ]);

                articleCards.push(card);
            }

            msg.attachmentLayout(builder.AttachmentLayout.carousel);
            msg.attachments(articleCards);
            session.send(msg).endDialog();
        } catch(e) {
            console.log(e);
            session.replaceDialog('news', {reprompt: true});
        }
    }
];


module.exports = {hello, weather, news};
