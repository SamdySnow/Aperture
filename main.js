const express = require("express")
const app = express()

const db = require('./database_operation')
const ejs = require('ejs')
const bodyParser = require('body-parser')


const moogoose = require('mongoose')

//db.signup('test01', '123456')

app.use('/', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/login', (req, res) => {
    console.log('login');
    qu = req.body
    console.log(qu)
    username = qu.usm
    password = qu.psd
    uss = db.login(username, password)
})

app.post('/signup', (req, res) => {
    console.log('signup');
    qu = req.body;
    username = qu.usm
    password = qu.psd
    psdcf = qu.psdcf
    admin = (qu.signupasadmin == 'on')
    console.log(qu)

    if (password != psdcf) {
        ejs.renderFile('public/signup_ejs.html', { result: '输入不一致' }, function(err, str) {
            if (err) console.log(err);
            res.send(str);
        })
    } else {
        console.log('sing up');
        db.signup(username, password, admin);
        console.log('sing up done');
        ejs.renderFile('public/signup_ejs.html', { result: '注册成功' }, function(err, str) {
            if (err) console.log(err);
            res.send(str);
        })
    }
})

console.log('app listen at port 12500');

app.listen(12500);