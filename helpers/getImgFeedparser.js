var getImgFeedparser = (text) => {
    let regex = /<img src="(.*?)"/;

    let found = text.match(regex);

    if (found) {
        return found[1];
    } else {
        return null;
    }

};

module.exports = {getImgFeedparser};
