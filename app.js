var express = require('express');
var http = require('http');
var app = express();
var usercontroller = require('./controller/usercontroller')
var magazinecontroller = require('./controller/magazinecontroller');
var estimatecontroller = require('./controller/estimatecontroller');
var communitycontroller = require('./controller/communitycontroller');
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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

/* ----------- GET ----------- */
app.get('/', function (request, response) {
        response.render('main.html');
});
app.get('/login', function (request, response) {
        response.render('login.html');
});
app.get('/signup', function (request, response) {
        response.render('signup.html');
});
app.get('/mypage', function (request, response) {
        response.render('mypagepwcheck.html');
});
app.get('/mypageset', function (request, response) {
        response.render('mypagesetting.html');
});

app.get('/logincheck', usercontroller.logincheck);
app.get('/idcheck', usercontroller.idcheck);
app.get('/nicknamecheck', usercontroller.nicknamecheck);
app.get('/logout', usercontroller.logout);

/* Community */
app.get('/community', function (request, response) {
        response.render('community.html');
});
app.get('/communityposting', function (request, response) {
        response.render('communityposting.html');
});
app.get('/communitydetail', function (request, response) {
        response.render('communitydetail.html');
});

app.get('/getcommunitylist', communitycontroller.getcommunitylist);
app.get('/getcommunitydetail', communitycontroller.getcommunitydetail);
app.get('/getcommunitycomment', communitycontroller.getcommunitycomment);

/* Magazine */
app.get('/magazines', function (request, response) {
        response.render('magazines.html');
});
app.get('/magazinedetail', function (request, response) {
        response.render('magazinedetail.html');
});

app.get('/getmagazinelist', magazinecontroller.getmagazinelist);
app.get('/getmagazinedetail', magazinecontroller.getmagazinedetail);
app.get('/getmagazinecomment', magazinecontroller.getmagazinecomment);

/* Estimate */
app.get('/estimate', function (request, response) {
        response.render('estimate.html');
});
app.get('/estimateanswer', function (request, response) {
        response.render('estimateanswer.html');
});
app.get('/estimatedetail', function (request, response) {
        response.render('estimatedetail.html');
});
app.get('/estimateanswerdetail', function (request, response) {
        response.render('estimateanswerdetail.html');
});
app.get('/estimatelist', function (request, response) {
        response.render('estimatelist.html');
});

app.get('/getestimatelist', estimatecontroller.getestimatelist);
app.get('/getestimatedetail', estimatecontroller.getestimatedetail);
app.get('/getestimateanswerlist', estimatecontroller.getestimateanswerlist);
app.get('/getestimateanswerdetail', estimatecontroller.getestimateanswerdetail);

/* Preinspection */
app.get('/preinspection', function (request, response) {
        response.render('preinspection.html');
});
app.get('/preinspectioncreate', function (request, response) {
        response.render('preinspectioncreate.html');
});
app.get('/preinspectionpopup', function (request, response) {
        response.render('preinspectionpopup.html');
});


/* ----------- POST ----------- */
app.post('/login', usercontroller.login);
app.post('/signup', usercontroller.signup);

app.post('/addmagazinelike', magazinecontroller.addmagazinelike);
app.post('/addmagazinecomment', magazinecontroller.addmagazinecomment);

app.post('/addestimate', estimatecontroller.addestimate);
app.post('/addestimateanswer', estimatecontroller.addestimateanswer);

app.post('/addcommunity', communitycontroller.addcommunity);
app.post('/addcommunitylike', communitycontroller.addcommunitylike);
app.post('/addcommunitycomment', communitycontroller.addcommunitycomment);

/* ---------- DELETE ---------- */
app.delete('/deletemagazinelike', magazinecontroller.deletemagazinelike);
app.delete('/deletemagazinecomment', magazinecontroller.deletemagazinecomment);

app.delete('/deletecommunity', communitycontroller.deletecommunity);
app.delete('/deletecommunitylike', communitycontroller.deletecommunitylike);
app.delete('/deletecommunitycomment', communitycontroller.deletecommunitycomment);

/* ----------- PUT ------------ */
app.put('/putcommunity', communitycontroller.putcommunity);

/* ----------- TEST ----------- */
app.get('/test', function (request, response) {
        response.json({
                RESULT: "12"
        });
});
