var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/190110910321');

const schema = {
    username: String,
    psssword: String
}


const user = mongoose.model('Users', schema);

const users = new user({
    username: username,
    password: password
})

users.save().then(() => console.log('write'));