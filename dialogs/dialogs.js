var helloName = (session) => {
    let name = session.message.text;
    session.userData.name = name;
    session.send(`Hello ${name}. What can I do for you ?`);
};

module.exports = {helloName};
