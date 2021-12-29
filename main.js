const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util')

Date.prototype.Format = function(fmt) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'S+': this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {

        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {

            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
};

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'data', 'img'));
    },
    filename: function(req, file, cb) {
        const extname = path.extname(file.originalname)
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var date = now.getDate();
        var hour = now.getHours();
        var minu = now.getMinutes();
        //month = month + 1;
        // if (month < 10) month = "0" + month;
        // if (date < 10) date = "0" + date;
        var number = now.getSeconds() % 43;
        var time = String(year) + String(month) + String(date) + String(hour) + String(minu);
        filename = time + "_" + String(number) + extname;

        cb(null, filename);
    }
})

const uploader = multer({
    storage: storage
})


// const uploader = multer({
//     dest: path.join(__dirname, 'data', 'img')
// })

//const db = require('./database_operation')
const ejs = require('ejs')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

var session = require('express-session');


app.use(cookieParser('sessiontest'));
app.use(session({
    secret: 'sessiontest', //与cookieParser中的一致
    resave: true,
    saveUninitialized: true
}));

const moogoose = require('mongoose')

//db.signup('test01', '123456')
;
app.use('/', express.static('public'))
app.use('/img', express.static('data/img'));
app.use(bodyParser.urlencoded({ extended: false }))

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/190110910321');

const schema = {
    username: String,
    password: String,
    admin: Boolean
}

const schemaIMG = {
    path: String,
    owner: String,
    originalname: String,
    updatetime: String
}

const img = mongoose.model('imgs', schemaIMG);
const us = mongoose.model('Users', schema);


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

app.post('/login', (req, res) => {
    console.log('login');
    qu = req.body
    console.log(qu)
    username = qu.usm
    password = qu.psd
    us.find({ 'username': username }, (err, data) => {
        console.log(data);
        uss = data[0];
        ////return uss;
        if (uss == undefined) {
            //info = '用户不存在或账号密码错误';

            ejs.renderFile('public/login_ejs.html', { result: '用户不存在' }, function(err, str) {
                if (err) console.log(err);
                res.send(str);
            })
        } else if (uss.password != password) {
            ejs.renderFile('public/login_ejs.html', { result: '密码错误' }, function(err, str) {
                if (err) console.log(err);
                res.send(str);
            })
        } else {
            info = '欢迎！' + username;
            req.session.username = username;

            ejs.renderFile('public/welcome.html', { result: info, username: username }, function(err, str) {
                if (err) console.log(err);
                res.send(str);
            })
        }
    })

})

app.post('/signup', (req, res) => {
    //注册操作
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
        signup(username, password, admin);
        console.log('sing up done');
        ejs.renderFile('public/signup_ejs.html', { result: '注册成功' }, function(err, str) {
            if (err) console.log(err);
            res.send(str);
        })
    }
})

app.use('/upload', (req, res) => {
    if (req.session.username == undefined) {
        //TODO 请先登录
        res.send('不登录还想用？给老子登录！');
        console.log(req.session);
    } else {
        username = req.session.username
        ejs.renderFile('public/upload.html', { username: username }, function(err, str) {
                if (err) console.log(err);
                res.send(str);
            })
            //res.send('欢迎！' + req.session.username)
            //res.send(req.session.username)
    }
})

app.post('/fileupload', uploader.single('uploadIMG'), (req, res) => {
    username = req.session.username;

    if (username == undefined) {
        res.send('请先登录');
    } else {
        console.log(req.file)
        console.log(req.body)

        const path = req.file.path;
        const originalname = req.file.originalname;
        const owner = username;

        console.log('write img info to database..');

        console.log(path, originalname, owner);

        var upt = new Date();
        upt.Format('yyyy-MM-dd HH:mm:ss');
        console.log(upt);

        const im = new img({
            path: path,
            owner: owner,
            originalname: originalname,
            updatetime: upt
        })

        im.save().then(() => console.log('write img info to database ... DONE!!'));

        ejs.renderFile('public/upload_ejs.html', { result: 'Success!' }, function(err, str) {
            if (err) console.error(err);
            res.send(str);
        })
    }

    //*res.send('确认收到来自' + username + '的文件上传请求')
})

app.use('/view', (req, res) => {
    console.log('view imgs');
    const username = req.session.username;

    renderstr = ''

    if (username == undefined) {
        res.send('请先登录');
    } else {
        console.log('view request by >> ' + username);
        strscm = ''

        fs.readFile("templet.txt", 'utf-8', (err, data) => {

            if (err) throw err;
            console.log(data);
            strscm = data;

            img.find({ owner: username }, (err, data) => {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    var mel = data[i];
                    var imgpath = mel.path;
                    var filename = mel.originalname;
                    var owner = mel.owner;
                    var upt = mel.updatetime;
                    var pathname = imgpath.split('/')[imgpath.split('/').length - 1];
                    var src = 'img/' + pathname;

                    var rest = util.format(strscm, src, imgpath, filename, owner, upt);
                    renderstr += rest;
                    console.log(rest);
                    console.log('\n-----------\n');
                    console.log(renderstr);

                }
                ejs.renderFile('public/view_ejs.html', { render: renderstr }, function(err, str) {
                    if (err) console.log(err)
                    res.send(str);
                })
            })
        });


    }

})


console.log('app listen at port 12500');

app.listen(12500);