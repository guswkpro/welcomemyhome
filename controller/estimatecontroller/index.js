var magazinedao = require('../../dao/magazinedao');
var dto = require('../../dto/magazinedto');
var userdao = require('../../dao/userdao')
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
    var req_usr_nickname = request.body.nickname;
    var req_estimate_content = request.body.content;
    var req_estimate_hashtag = request.body.hashtag;
    var req_estimate_image = request.body.image;
    var req_estimate_edit = request.body.edit;
    var req_estimate_idx = request.body.estimateidx;
    var req_estimate_hit_count = request.body.hit;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath = '';
    var path = [];
    var thumbnailpath = '';
    var dirname = "./public/" + req_usr_nickname + "/" + dirdate;
    var newPath;
    if (typeof req_estimate_image != 'undefined') {
        var count = 0;
        async.whilst(function () {
            return count < req_estimate_image.length;
        }, function (callback) {
            async.waterfall([
                function (nextCallback) {
                    mkdirp(dirname, nextCallback);
                }, function (maybeurl, nextCallback) {
                    var dirname = "./public/" + req_usr_nickname + "/" + dirdate;
                    var bitmap = new Buffer(req_estimate_image[count].image, 'base64');
                    newPath = dirname + "/" + dirdate + "_" + count + ".png";
                    path.push(dirname + "/" + dirdate + "_" + count);
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
                    imagepath = imagepath + newPath + ',';
                    count++;
                    callback();
                }
            });
        }, function (err) {
            var count = 0;
            async.whilst(function () {
                return count < req_estimate_image.length;
            }, function (callback) {
                gm(path[count] + '.png').resize(150, 150).write(path[count] + '_thumb.png', function (err) {
                    if (err) {
                        console.log(error);
                        response.json({
                            RESULT: "0"
                        });
                    }
                    else {
                        console.log('done');
                    }
                });
                thumbnailpath = thumbnailpath + path[count] + '_thumb.png,';
                count++;
                callback();
            }, function (err) {
                if (req_estimate_image.length == 0) {
                    imagepath = 'null';
                    thumbnailpath = 'null';
                }
                async.waterfall([
                    function (nextCallback) {
                        dto.estimate(req_estimate_content, date, req_estimate_hashtag, imagepath, thumbnailpath, req_estimate_hit_count, req_usr_idx, nextCallback);
                    }, function (estimate, nextCallback) {
                        if (req_estimate_edit == "1") {
                            dao.editestimate(req_estimate_idx, estimate, nextCallback);
                        } else {
                            dao.addestimate(estimate, nextCallback);
                        }
                    }, function (nextCallback) {
                        if (req_estimate_edit == "1") {
                            nextCallback(null, null);
                        } else {
                            dao.editpostcount(req_usr_idx, 1, nextCallback);
                        }
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
            });
        });
    }
};

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
    ], function (error, result) {
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
        function(nextCallback){
            dao.editpincount(req_usr_idx, -1, nextCallback);
        },function (nextCallback) {
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
        function(nextCallback){
            dao.editcommentcount(req_usr_idx, -1, nextCallback);
        },function (nextCallback) {
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
        function(nextCallback){
            dao.editpostcount(req_usr_idx, -1, nextCallback);
        },function (nextCallback) {
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