var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/190110910321');

const schema = {
    username: String,
    password: String,
    admin: Boolean
}

const us = mongoose.model('User', schema);


function signup(username, password, admin) {
    console.log('module singup');

    console.log(username, password, admin);


    const uss = new us({
        username: username,
        password: password,
        admin: admin
    })

    uss.save().then(() => console.log('write'));
}

function login(username, password) {

    uss = null

    us.find({ 'username': username }, (err, data) => {
        console.log(data);
        uss = data;
        return uss;
    })

}

module.exports = {
    signup,
    login
}