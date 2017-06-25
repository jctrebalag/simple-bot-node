const builder = require('botbuilder');

var helloName = (session) => {
    let name = session.message.text;
    session.userData.name = name;
    session.send(`Hello ${name}. What can I do for you ?`);
};

// var askLocation = [
//     function(session) {
//         builder.Prompts.text('Please, give me your location');
//     },
//     function(session, results) {
//         session.endDialogWithResult(results);
//     }
// ];

module.exports = {helloName};
