var express = require('express');
var http = require('http');
var app = express();
var usercontroller = require('./controller/usercontroller')
var magazinecontroller = require('./controller/magazinecontroller');
var estimatecontroller = require('./controller/estimatecontroller');
var server = app.listen(3000, function () {
        console.log("Express server has started on port 3000")
});
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.use(logger('dev'));
app.use(session({
        secret: '##@%SWJHWJ#%&&!',
        resave: false,
        saveUninitialized: true
}));
app.use(cookieParser());
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
app.get('/logincheck', usercontroller.logincheck);

app.get('/talks', function (req, res) {
        res.render('talks.html');
});

app.get('/magazines', function (req, res) {
        res.render('magazines.html');
});
app.get('/magazinedetail', function (req, res) {
        res.render('magazinedetail.html');
});
app.get('/talks', function (req, res) {
        res.render('magazinedetail.html');
});
app.get('/getmagazinelist', magazinecontroller.getmagazinelist);
app.get('/getmagazinedetail', magazinecontroller.getmagazinedetail);
app.get('/getmagazinecomment', magazinecontroller.getmagazinecomment);

app.get('/estimate', function(req, res){
        res.render('estimate.html');
});
app.get('/estimatedetail', function(req, res){
        res.render('estimatedetail.html');
});
app.get('/estimatelist', function(req, res){
        res.render('estimatelist.html');
});

app.get('/getestimatelist', estimatecontroller.getestimatelist);
app.get('/getestimatedetail', estimatecontroller.getestimatedetail);
app.get('/getestimateanswerlist', estimatecontroller.getestimateanswerlist);

/* ----------- POST ----------- */
app.post('/login', usercontroller.login);
app.post('/signup', usercontroller.signup);
app.post('/addmagazinelike', magazinecontroller.addmagazinelike);
app.post('/addmagazinecomment', magazinecontroller.addmagazinecomment);
app.post('/addestimate', estimatecontroller.addestimate);
app.post('/addestimateanswer', estimatecontroller.addestimateanswer);

/* ---------- DELETE ---------- */
app.delete('/deletemagazinelike', magazinecontroller.deletemagazinelike);
app.delete('/deletemagazinecomment', magazinecontroller.deletemagazinecomment);

/* ----------- TEST ----------- */
app.get('/test', function(req, res){
        res.render('test.html');
});
