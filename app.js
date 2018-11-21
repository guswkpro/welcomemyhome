var express = require('express');
var http = require('http');
var app = express();
var usercontroller = require('./controller/usercontroller')
var server = app.listen(3000, function () {
        console.log("Express server has started on port 3000")
});
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');

app.use(logger('dev'));
app.use(session({
        secret: '##@%SWJHWJ#%&&!',
        resave: false,
        saveUninitialized: true
        cookie: {
          maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
        }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

/* ----------- GET ----------- */
app.get('/', function (req, res) {
        res.render('main.html');
});
app.get('/login', function (req, res) {
        res.render('login.html');
});
app.get('/signup', function (req, res) {
        res.render('signup.html');
});
app.get('/talks', function (req, res) {
        res.render('talks.html');
});
app.get('/magazines', function (req, res) {
        res.render('magazines.html');
});
/* ----------- POST ----------- */
app.post('/login', usercontroller.login);
app.post('/signup', usercontroller.signup);

/* ----------- TEST ----------- */
app.post('/test', usercontroller.test);
