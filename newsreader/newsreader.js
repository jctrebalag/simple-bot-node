const {parse: feedparser} = require('feedparser-promised');
const {XmlEntities} = require('html-entities');
const striptags = require('striptags');

// const {feeds} = require('./feeds');
const {getImgFeedparser} = require('./../helpers/getImgFeedparser');

var newsReader = async (url) => {
        var feedsInfos = await feedparser(url);
        var articleArr = [];
        console.log(feedsInfos[0]);
        feedsInfos.forEach(item => {
            let article = {
                title: XmlEntities.decode(item.title),
                summary: XmlEntities.decode(striptags(item.summary)),
                image: getImgFeedparser(item.description),
                link: item.link
            };
            articleArr.push(article);
        });
        return articleArr;
};


module.exports = {newsReader};
