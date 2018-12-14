var preinspectiondao = require('../../dao/preinspectiondao');
var async = require('async');
var mkdirp = require('mkdirp');
var fs = require('fs');




/********************
        GET
********************/

exports.getpreinspectionblueprint = function (request, response) {
    var req_user_check = request.session.user_idx;
    var info = {};
    async.waterfall([
        function (nextCallback) {
            preinspectiondao.getpreinspectionblueprint(req_user_check, nextCallback);
        }, function (answerdata, nextCallback) {
            console.log(req_user_check);
            console.log(answerdata, "answer");
            fs.readFile(answerdata.preinspection_picture_path, nextCallback);
        }, function (data, nextCallback){
            var  encodedimage = [];
            encodedimage.push(new Buffer(data).toString('base64'));
            nextCallback(null);
        }
    ], function (error) {
        if (error) {
            console.log(error);
            response.json({
                RESULT:"0"
            });
        } else {
            response.json({
                RESULT: "1",
                INFO: info
            });
        }
    });
};


/********************
        POST
********************/
exports.addpreinspectionblueprint = function (request, response) {
    var req_user_nickname = request.session.user_nickname;
    var req_preinspection_image = request.body.image;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var dirname = "./public/" + req_user_nickname + "/blueprint";
    var newPath;

    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            dirname = dirname + "/" + dirdate;
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            var bitmap = new Buffer(req_preinspection_image, 'base64');
            newPath = dirname + "/" + req_user_nickname + ".jpg";
            fs.writeFile(newPath, bitmap, 'base64', nextCallback);    
        }, function (preinspection, nextCallback) {
            preinspection.addpreinspectionblueprint(preinspection, nextCallback);
        }
    ], function (error) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        }
        else {
            response.json({
                RESULT: "1"
            });
        }
    });
}