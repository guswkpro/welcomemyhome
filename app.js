var express = require('express');
var http = require('http');
var app = express();
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res){
    res.send('Hello Worldaabbb');
});
/*
app.get('/main', function(req, res){
        res.render('main.html');
});
app.get('/userprofile', function(req, res){
        res.render('user.html');
});

app.post('/main', function(req, res) {
        var req_mem_id = req.body.id;
        var req_mem_pw = req.body.pw;

        controller.login(req_mem_id, req_mem_pw, function(result) {
                res.json({
                        "RESULT" : result
                });
        });
});*/

