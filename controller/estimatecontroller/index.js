var estimatedao = require('../../dao/estimatedao');
var estimatedto = require('../../dto/estimatedto');
var userdao = require('../../dao/userdao')
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
require('date-utils');

/********************
        GET
********************/
exports.getestimatelist = function (request, response) {
    var req_user_check = request.session.user_auth;
    var req_offset = request.param('offset');
    var total_count;
    async.waterfall([
        function (nextCallback) {
            estimatedao.getestimatecount(nextCallback);
        }, function (cnt, nextCallback) {
            total_count = cnt[0].cnt;
            if (req_user_check == "0") {
                estimatedao.getestimatelistforuser(req_offset, request.session.user_idx, nextCallback);
            } else {
                estimatedao.getestimatelist(req_offset, nextCallback);
            }
        }, function (estimatelist, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < estimatelist.length;
            }, function (callback) {
                userdao.getuserinformation(estimatelist[count].user_idx, function (error, estimateuserdata) {
                    estimatelist[count].user_nickname = estimateuserdata[0].user_nickname;
                    count++;
                    callback();
                });
            }, function (error) {
                nextCallback(error, estimatelist);
            });
        }
    ], function (error, result) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
                , INFO: result
                , COUNT: total_count
            });
        }
    });
};

exports.gettest = function (request, response) {
    var req_offset = request.param('offset');
    var total_count;
    var test;
    async.waterfall([
        function (nextCallback) {
            test = estimatedao.getestimatecount(nextCallback);
            console.log(estimatedao.getestimatecount(nextCallback));
            console.log(test);
        }, function (cnt, nextCallback) {
            total_count = cnt[0].cnt;
            estimatedao.getestimatelistforuser(req_offset, request.session.user_idx, nextCallback);
        }, function (estimatelist, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < estimatelist.length;
            }, function (callback) {
                userdao.getuserinformation(estimatelist[count].user_idx, function (error, estimateuserdata) {
                    estimatelist[count].user_nickname = estimateuserdata[0].user_nickname;
                    count++;
                    callback();
                });
            }, function (error) {
                nextCallback(error, estimatelist);
            });
        }
    ], function (error, result) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
                , INFO: result
                , COUNT: total_count
            });
        }
    });
}

exports.getestimatedetail = function (request, response) {
    var req_estimate_idx = request.param('estimate_idx');
    var info = {};
    async.waterfall([
        function (nextCallback) {
            estimatedao.getestimatedetail(req_estimate_idx, nextCallback);
        }, function (estimatedata, nextCallback) {
            var encodedimage = [];
            var count = 0;
            estimatedata[0].estimate_picture_path = estimatedata[0].estimate_picture_path.split(',');
            async.whilst(function () {
                return count < (estimatedata[0].estimate_picture_path.length - 1);
            }, function (callback) {
                fs.readFile(estimatedata[0].estimate_picture_path[count], function (error, data) {
                    encodedimage.push(new Buffer(data).toString('base64'));
                    count++;
                    callback();
                });
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    estimatedata[0].estimate_date = estimatedata[0].estimate_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                    estimatedata[0].encodedimage = encodedimage;
                    info = estimatedata[0];
                    nextCallback();
                }
            });
        }
    ], function (error) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
                , INFO: info
            });
        }
    });
};

exports.getestimateanswerlist = function (request, response) {
    var req_estimate_idx = request.param('estimate_idx');
    var req_offset = request.param('offset');
    var total_count;
    async.waterfall([
        function (nextCallback) {
            estimatedao.getestimateanswercount(nextCallback);
        }, function (cnt, nextCallback) {
            total_count = cnt;
            estimatedao.getestimateanswer(req_offset, req_estimate_idx, nextCallback);
        },  function (estimatelist, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < estimatelist.length;
            }, function (callback) {
                userdao.getuserinformation(estimatelist[count].user_idx, function (error, estimateuserdata) {
                    estimatelist[count].user_nickname = estimateuserdata[0].user_nickname;
                    count++;
                    callback();
                });
            }, function (error) {
                nextCallback(error, estimatelist);
            });
        }
    ], function (error, result) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
                , INFO: result
                , COUNT: total_count
            });
        }
    });
};

exports.getestimateanswerdetail = function (request, response) {
    var req_answer_idx = request.param('answer_idx');
    var info = {};
    async.waterfall([
        function (nextCallback) {
            estimatedao.getestimateanswerdetail(req_answer_idx, nextCallback);
        }, function (answerdata, nextCallback) {
            var encodedimage = [];
            var count = 0;
            answerdata[0].answer_picture_path = answerdata[0].answer_picture_path.split(',');
            async.whilst(function () {
                return count < (answerdata[0].answer_picture_path.length - 1);
            }, function (callback) {
                fs.readFile(answerdata[0].answer_picture_path[count], function (error, data) {
                    encodedimage.push(new Buffer(data).toString('base64'));
                    count++;
                    callback();
                });
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    answerdata[0].answer_date = answerdata[0].answer_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                    answerdata[0].encodedimage = encodedimage;
                    info = answerdata[0];
                    nextCallback();
                }
            });
        }
    ], function (error) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
                , INFO: info
            });
        }
    });
};

/********************
        POST
********************/
exports.addestimate = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_estimate_title = request.body.title;
    var req_estimate_content = request.body.content;
    var req_estimate_image = request.body.image;
    var req_estimate_address = request.body.address;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath = '';
    var thumbnailpath = '';
    var dirname = "./public/" + req_user_nickname + "/estimate";
    var newPath;
    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            dirname = dirname + "/" + dirdate;
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            count = 0;
            async.whilst(function () {
                console.log(req_estimate_image);
                return count < req_estimate_image.length;
            }, function (callback) {
                var bitmap = new Buffer(req_estimate_image[count].image, 'base64');
                newPath = dirname + "/" + dirdate + "_" + count + ".jpg";
                imagepath = imagepath + newPath + ',';
                count++;
                fs.writeFile(newPath, bitmap, 'base64', callback);
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    estimatedto.estimate(req_user_idx, req_estimate_title, req_estimate_content, date, imagepath, req_estimate_address, 0, nextCallback);
                }
            });
        }, function (estimate, nextCallback) {
            estimatedao.addestimate(estimate, nextCallback);
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
};

exports.addestimateanswer = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_estimate_idx = request.body.estimate_idx;
    var req_answer_content = request.body.content;
    var req_answer_image = request.body.image;
    var req_answer_title = request.body.title;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath = '';
    var dirname = "./public/" + req_user_nickname + "/estimateanswer";
    var newPath;
    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            dirname = dirname + "/" + dirdate;
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < req_answer_image.length;
            }, function (callback) {
                var bitmap = new Buffer(req_answer_image[count].image, 'base64');
                newPath = dirname + "/" + dirdate + "_" + count + ".jpg";
                imagepath = imagepath + newPath + ',';
                count++;
                fs.writeFile(newPath, bitmap, 'base64', callback);
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    estimatedto.estimateanswer(req_user_idx, req_estimate_idx, req_answer_title, req_answer_content, date, imagepath, nextCallback);
                }
            });
        }, function (answer, nextCallback) {
            estimatedao.addestimateanswer(answer, nextCallback);
        }, function (nextCallback) {
            estimatedao.editanswercount(req_estimate_idx, nextCallback);
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
};