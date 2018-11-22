var estimatedao = require('../../dao/magazinedao');
var estimatedto = require('../../dto/estimatedto');
var async = require('async');
var fs = require('fs');
require('date-utils');

/********************
        GET
********************/
exports.getmagazinelist = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_offset = request.param('offset');
    var info = [];
    async.waterfall([
        function (nextCallback) {
            magazinedao.getmagazinelist(req_offset, nextCallback);
        }, function (magazinelist, nextCallback) {
            var count = 0;
            async.whilst(function () {
                return count < magazinelist.length;
            }, function (callback) {
                async.waterfall([
                    function (secondNextCallback) {
                        magazinelist[count].magazine_post_date = magazinelist[count].magazine_post_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                        fs.readFile(magazinelist[count].magazine_thumbnail_path, function (error, data) {
                            magazinelist[count].encodedimage = new Buffer(data).toString('base64');
                            secondNextCallback(error);
                        });
                    }, function (secondNextCallback) {
                        magazinelist[count].likecheck = 0;
                        magazinelist[count].commentcheck = 0;
                        magazinedao.getmagazinelikecheck(magazinelist[count].magazine_idx, req_user_idx, secondNextCallback);
                    }, function (checkdata, nextCallback) {
                        if (checkdata.length == 0) {
                            magazinelist[count].likecheck = 0;
                            nextCallback(null);
                        } else {
                            magazinelist[count].likecheck = 1;
                            nextCallback(null);
                        }
                    }, function (nextCallback) {
                        magazinedao.getmagazinecommentcheck(magazinelist[count].magazine_idx, req_user_idx, nextCallback);
                    }, function (checkdata, nextCallback) {
                        if (checkdata.length == 0) {
                            magazinelist[count].commentcheck = 0;
                            nextCallback(null);
                        } else {
                            magazinelist[count].commentcheck = 1;
                            nextCallback(null);
                        }
                    }
                ], function (error) {
                    if (error) {
                        console.log(error);
                        response.json({
                            RESULT: "0"
                        });
                    } else {
                        info.push(magazinelist[count]);
                        count++;
                        callback();
                    }
                });
            }, function (error) {
                nextCallback();
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
    var req_estimate_content = request.body.content;
    var req_estimate_image = request.body.image;
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
                return count < req_estimate_image.length;
            }, function (callback) {
                console.log(req_estimate_image[count].image);
                var bitmap = new Buffer(req_estimate_image[count].image, 'base64');
                newPath = dirname + "/" + dirdate + "_" + count + ".png";
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
                    estimatedto.estimate(req_user_idx, req_estimate_content, date, imagepath, nextCallback);
                }
            });
        }, function(estimate, nextCallback){
            estimatedao.addestimate(estimate, nextCallback);
        }
    ], function(error){
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
    var req_estimate_idx = request.body.estimate_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_estimate_content = request.body.content;
    var req_estimate_image = request.body.image;
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
                return count < req_estimate_image.length;
            }, function (callback) {
                var bitmap = new Buffer(req_estimate_image[count].image, 'base64');
                newPath = dirname + "/" + dirdate + "_" + count + ".png";
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
                    estimatedto.estimateanswer(req_user_idx, req_estimate_idx, req_estimate_content, date, imagepath, nextCallback);
                }
            });
        }, function(estimate, nextCallback){
            estimatedao.addestimateanswer(estimate, nextCallback);
        }
    ], function(error){
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

/********************
        PUT
********************/
exports.addestimatecomment = function (request, response) {
    var req_usr_idx = request.body.useridx;
    var req_estimate_idx = request.body.estimateidx;
    var req_comment_content = request.body.content;
    var req_estimate_comment_count = request.body.count;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    async.waterfall([
        function (nextCallback) {
            dao.editcommentcount(req_usr_idx, 1, nextCallback);
        }, function (nextCallback) {
            dto.comment(req_usr_idx, req_estimate_idx, req_comment_content, date, null, nextCallback);
        }, function (comment, nextCallback) {
            dao.addestimatecomment(comment, nextCallback)
        }, function (nextCallback) {
            dao.editestimatecommentcount(req_estimate_idx, req_estimate_comment_count, nextCallback);
        }
    ], function (error) {
        if (error) {
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

exports.addestimatelike = function (request, response) {
    var req_usr_idx = request.body.useridx;
    var req_estimate_idx = request.body.estimateidx;
    var req_estimate_like_count = request.body.count;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    async.waterfall([
        function (nextCallback) {
            dao.editpincount(req_usr_idx, 1, nextCallback);
        }, function (nextCallback) {
            dto.foreignkey(req_usr_idx, req_estimate_idx, nextCallback);
        }, function (like, nextCallback) {
            dao.addestimatelike(like, date, nextCallback);
        }, function (nextCallback) {
            dao.editestimatelikecount(req_estimate_idx, req_estimate_like_count, nextCallback);
        }
    ], function (error, result) {
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
exports.deleteestimatelike = function (request, response) {
    var req_usr_idx = request.body.useridx;
    var req_estimate_idx = request.body.estimateidx;
    var req_estimate_like_count = request.body.count;
    async.waterfall([
        function (nextCallback) {
            dao.editpincount(req_usr_idx, -1, nextCallback);
        }, function (nextCallback) {
            dto.foreignkey(req_usr_idx, req_estimate_idx, nextCallback);
        }, function (like, nextCallback) {
            dao.deleteestimatelike(like, nextCallback);
        }, function (nextCallback) {
            dao.editestimatelikecount(req_estimate_idx, req_estimate_like_count, nextCallback);
        }
    ], function (error, result) {
        if (error) {
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
            });
        }
    });
};

exports.deleteestimatecomment = function (request, response) {
    var req_usr_idx = request.body.user_idx;
    var req_comment_idx = request.body.commentidx;
    var req_estimate_idx = request.body.estimateidx;
    var req_estimate_comment_count = request.body.count;
    async.waterfall([
        function (nextCallback) {
            dao.editcommentcount(req_usr_idx, -1, nextCallback);
        }, function (nextCallback) {
            dao.deleteestimatecomment(req_comment_idx, nextCallback);
        }, function (nextCallback) {
            dao.editestimatecommentcount(req_estimate_idx, req_estimate_comment_count, nextCallback);
        }
    ], function (error, result) {
        if (error) {
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
            });
        }
    })
};

exports.deleteestimate = function (request, response) {
    var req_estimate_idx = request.body.estimateidx;
    async.waterfall([
        function (nextCallback) {
            dao.editpostcount(req_usr_idx, -1, nextCallback);
        }, function (nextCallback) {
            dao.deleteestimateallcomment(req_estimate_idx, nextCallback);
        }, function (nextCallback) {
            dao.deleteestimatealllike(req_estimate_idx, nextCallback);
        }, function (nextCallback) {
            dao.deleteallshare(req_estimate_idx, nextCallback);
        }, function (nextCallback) {
            dao.deleteestimate(req_estimate_idx, nextCallback);
        }
    ], function (error, result) {
        if (error) {
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
            });
        }
    });
};