var preinspectiondao = require('../../dao/preinspectiondao');
var preinspectiondto = require('../../dto/preinspectiondto');
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
            console.log("1");
            preinspectiondao.getpreinspectionblueprint(req_user_check, nextCallback);
            console.log("2");
        }, function (preinspection, nextCallback) {
            console.log("3");
            console.log(preinspection);
            fs.readFile(preinspection.preinspection_picture_path, nextCallback);
            console.log("4");
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
    var req_user_idx = request.session.user_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_preinspection_image = request.body.image;
    var req_preinspection_width = request.body.width;
    var req_preinspection_height = request.body.height;
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
        //}, function (error) {
            // if(error) {
            //     console.log(error);
            //     response.json({
            //         RESULT: "0"
            //     });
            // }
            // else {
            //    preinspectiondto.preinspection(req_user_idx, date, imagepath, req_preinspection_width, req_preinspection_height, nextCallback);
            // }
        }, function (nextCallback) {
            preinspectiondto.preinspection(req_user_idx, date, newPath, req_preinspection_width, req_preinspection_height, nextCallback);
        }, function (preinspection, nextCallback) {
            preinspectiondao.addpreinspectionblueprint(preinspection, nextCallback);
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