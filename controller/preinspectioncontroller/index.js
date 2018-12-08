var preinspectiondao = require('../../dao/');
var preinspectiondto = require('../../dto/');
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
            preinspectiondao.get
        }
    ])
}


/********************
        POST
********************/
exports.addpreinspectionblueprint = function (request, response) {
    var req_user_nickname = request.session.user_nickname;
    var req_preinspection_title = request.body.title;
    var req_preinspection_content = request.body.content;
    var req_preinspection_image = request.body.image;
    var dirname = "./public/" + req_user_nickname + "/blueprint";
    var newPath;

    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            async.waterfall([
                function (callback) {
                    var bitmap = new Buffer(req_preinspection_image, 'base64');
                    newPath = dirname + "/" + req_user_nickname + ".jpg";
                    fs.writeFile(newPath, bitmap, 'base64', callback);
                    nextCallback(null);
                }
            ], function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                }
            });
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