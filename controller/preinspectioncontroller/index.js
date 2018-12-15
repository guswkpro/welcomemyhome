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
            preinspectiondao.getpreinspectionblueprint(req_user_check, nextCallback);
        },  function (preinspectiondata, nextCallback) {
            var encodedimage = [];
            var count = 0;
            preinspectiondata[0].preinspection_picture_path = preinspectiondata[0].preinspection_picture_path.split(',');
            async.whilst(function () {
                return count < (preinspectiondata[0].preinspection_picture_path.length);
            }, function (callback) {
                fs.readFile(preinspectiondata[0].preinspection_picture_path[0], function (error, data) {
                    encodedimage.push(new Buffer(data).toString('base64'));
                    count++;
                    console.log(encodedimage);
                    callback();
                });
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    preinspectiondata[0].preinspection_date = preinspectiondata[0].preinspection_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                    preinspectiondata[0].encodedimage = encodedimage;
                    preinspectiondata[0].preinspection_width = preinspectiondata[0].preinspection_width;
                    preinspectiondata[0].preinspection_height = preinspectiondata[0].preinspection_height;
                    info = preinspectiondata[0];
                    nextCallback();
                }
            });
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

exports.addpreinspectionmodal = function (request, response) {
    var req_preinspection_idx = request.body.preinspection_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_pin_X = request.body.pin_x;
    var req_pin_Y = request.body.pin_y;
    var req_pin_type = request.body.type;
    var req_pin_image = request.body.image;
    var req_pin_content = request.body.content;
    var date = new Date();
    date = date.toFormat('YYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath='';
    var dirname = "./public/" + req_user_nickname + "/blueprint";
    var newPath;
    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
            console.log("1");
        }, function (url, nextCallback) {
            dirname = dirname + "/" + dirdate;
            mkdirp(dirname, nextCallback);
            console.log("2");
        }, function (url, nextCallback) {
            count = 0;
            console.log("3");
            async.whilst(function() {
                console.log(req_pin_image);
                console.log("4");
                return count < req_pin_image.length;
            }, function (nextCallback) {
                console.log("5");
                var bitmap = new Buffer(req_pin_image, 'base64');
                newPath = dirname + "/" + req_user_nickname + ".jpg";
                imagepath = imagepath + newPath + ',';
                count++;
                fs.writeFile(newPath, bitmap, 'base64', nextCallback);
                console.log("6");
            }, function(error) {
                if(error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    preinspectiondto.preinspectionpin(req_preinspection_idx, imagepath, req_pin_type, req_pin_X, req_pin_Y, req_pin_content, nextCallback);
                }
            });
        }, function (pin, nextCallback) {
            console.log("7");
            console.log(pin);
            preinspectiondao.addpreinspectionmodal(pin, nextCallback);
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