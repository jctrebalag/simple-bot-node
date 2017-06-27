var getImgFeedparser = (text) => {
    let regex = /<img src="(.*?)"/;

    let found = text.match(regex)[1];

    return found;
};

module.exports = {getImgFeedparser};
