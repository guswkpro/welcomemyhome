var preinspectiondao = require('../../dao/preinspectiondao');
var async = require('async');
var mkdirp = require('mkdirp');
var fs = require('fs');




/********************
        GET
********************/

exports.getpreinspectionblueprint = function (request, response) {
    var req_user_check = request.session.user_auth;
    var info = {};
    async.waterfall([
        function (nextCallback) {
            preinspectiondao.getpreinspectionblueprint(req_user_check, nextCallback);
        }, function (answerdata, nextCallback) {
            var  encodedimage = [];
        }
    ])
}


/********************
        POST
********************/
exports.addpreinspectionblueprint = function (request, response) {
    var req_user_nickname = request.session.user_nickname;
    var req_preinspection_image = request.body.image;
    var dirname = "./public/" + req_user_nickname + "/blueprint";
    var newPath;

    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            var bitmap = new Buffer(req_preinspection_image, 'base64');
            newPath = dirname + "/" + req_user_idx + ".jpg";
            fs.writeFile(newPath, bitmap, 'base64', nextCallback);    
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