var magazinedao = require('../../dao/magazinedao');
var dto = require('../../dto/magazinedto');
var userdao = require('../../dao/userdao')
var async = require('async');
var session = require('express-session');
var mkdirp = require('mkdirp');
var fs = require('fs');
require('date-utils');

/********************
        GET
********************/
exports.getmagazinelist = function (request, response) {
    var req_user_idx = request.session.user_idx;
    console.log(req_user_idx);
    var req_offset = request.param('offset');
    var info = [];
    var total_count;
    async.waterfall([
        function (nextCallback) {
            magazinedao.getmagazinecount(nextCallback);
        }, function (cnt, nextCallback) {
            total_count = cnt[0].cnt;
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
                nextCallback(error);
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
                , COUNT: total_count
            });
        }
    });
};
exports.getmagazinedetail = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_mag_idx = request.param('magazine_idx');
    var info = {};
    async.waterfall([
        function (nextCallback) {
            magazinedao.editmagazinehitcount(req_mag_idx, nextCallback);
        }, function (nextCallback) {
            magazinedao.getmagazinedetail(req_mag_idx, nextCallback);
        }, function (magazinedata, nextCallback) {
            var encodedimage = [];
            var count = 0;
            magazinedata[0].magazine_picture_path = magazinedata[0].magazine_picture_path.split(',');
            async.whilst(function () {
                return count < (magazinedata[0].magazine_picture_path.length);
            }, function (callback) {
                fs.readFile(magazinedata[0].magazine_picture_path[count], function (error, data) {
                    if (error) {
                        console.log(error);
                        response.json({
                            RESULT: "0"
                        });
                    } else {
                        encodedimage.push(new Buffer(data).toString('base64'));
                        count++;
                        callback();
                    }
                });
            }, function (err) {
                magazinedata[0].likecheck = 0;
                magazinedata[0].commentcheck = 0;
                magazinedata[0].encodedimage = encodedimage;
                async.waterfall([
                    function (secondnextCallback) {
                        magazinedata[0].magazine_post_date = magazinedata[0].magazine_post_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                        magazinedao.getmagazinelikecheck(magazinedata[0].magazine_idx, req_user_idx, secondnextCallback);
                    }, function (checkdata, secondnextCallback) {
                        if (checkdata.length == 0) {
                            magazinedata[0].likecheck = 0;
                            magazinedao.getmagazinecommentcheck(magazinedata[0].magazine_idx, req_user_idx, secondnextCallback);
                        } else {
                            magazinedata[0].likecheck = 1;
                            magazinedao.getmagazinecommentcheck(magazinedata[0].magazine_idx, req_user_idx, secondnextCallback);
                        }
                    }
                ], function (error) {
                    if (error) {
                        console.log(error);
                        response.json({
                            RESULT: "0"
                        });
                    } else {
                        magazinedata[0].magazine_hit_count = Number(magazinedata[0].magazine_hit_count) + 1;
                        info = magazinedata[0];
                        nextCallback(null, null);
                    }
                });
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
                , INFO: info
            });
        }
    });
};

exports.getmagazinecomment = function (request, response) {
    var req_magazine_idx = request.param('magazine_idx');
    var info = [];
    async.waterfall([
        function (nextCallback) {
            magazinedao.getmagazinecomment(req_magazine_idx, nextCallback);
        }, function (magazinecommentdata, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < magazinecommentdata.length;
            }, function (callback) {
                var magazinecommentinfodetail = {};
                async.waterfall([
                    function (nextCallback) {
                        userdao.getuserinformation(magazinecommentdata[count].user_idx, nextCallback);
                    }, function (magazinecommentuserdata, nextCallback) {
                        magazinecommentinfodetail.user_nickname = magazinecommentuserdata[0].user_nickname;
                        if (magazinecommentuserdata[0].user_picture_thumbnail_path + '' == "null") {
                            magazinecommentinfodetail.user_profile_image = "null";
                            magazinecommentinfodetail.magazine_comment_user_idx = magazinecommentdata[count].user_idx;
                            magazinecommentinfodetail.magazine_comment_idx = magazinecommentdata[count].comment_idx;
                            magazinecommentinfodetail.test = "ASDFASDFSADF";
                            magazinecommentinfodetail.magazine_comment_content = magazinecommentdata[count].comment_content;
                            magazinecommentinfodetail.magazine_comment_post_date = magazinecommentdata[count].comment_post_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                            info.push(magazinecommentinfodetail);
                            count++;
                            callback();
                        } else {
                            fs.readFile(magazinecommentuserdata[0].user_picture_thumbnail_path, nextCallback);
                        }
                    }, function (data) {
                        magazinecommentinfodetail.user_profile_image = new Buffer(data).toString('base64');
                        magazinecommentinfodetail.magazine_comment_user_idx = magazinecommentdata[count].user_idx;
                        magazinecommentinfodetail.magazine_comment_idx = magazinecommentdata[count].comment_idx;
                        magazinecommentinfodetail.test = "ASDFASDFSADF";
                        magazinecommentinfodetail.magazine_comment_content = magazinecommentdata[count].comment_content;
                        magazinecommentinfodetail.magazine_comment_post_date = magazinecommentdata[count].comment_post_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                        info.push(magazinecommentinfodetail);
                        count++;
                        callback();
                    }
                ])
            }, function (error) {
                nextCallback(error, null);
            });
        }
    ], function (error, result) {
        console.log(info);
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
exports.addmagazinelike = function (request, response) {
    var req_user_idx = request.session.user_idx
    var req_mag_idx = request.body.magazine_idx;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    async.waterfall([
        function (nextCallback) {
            dto.magazinelike(req_user_idx, req_mag_idx, date, nextCallback);
        }, function (like, nextCallback) {
            magazinedao.addmagazinelike(like, date, nextCallback);
        }, function (nextCallback) {
            magazinedao.editmagazinelikecount(req_mag_idx, 1, nextCallback);
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

exports.addmagazinecomment = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_mag_idx = request.body.magazine_idx;
    var req_comment_content = request.body.content;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    async.waterfall([
        function (nextCallback) {
            dto.magazinecomment(req_user_idx, req_mag_idx, req_comment_content, date, nextCallback);
        }, function (comment, nextCallback) {
            magazinedao.addmagazinecomment(comment, nextCallback);
        }, function (nextCallback) {
            magazinedao.editmagazinecommentcount(req_mag_idx, 1, nextCallback);
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

/********************
       DELETE
********************/
exports.deletemagazinelike = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_mag_idx = request.body.magazine_idx;
    async.waterfall([
        function (nextCallback) {
            magazinedao.deletemagazinelike(req_mag_idx, req_user_idx, nextCallback);
        }, function (nextCallback) {
            magazinedao.editmagazinelikecount(req_mag_idx, -1, nextCallback);
        }
    ], function (error) {
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

exports.deletemagazinecomment = function (request, response) {
    var req_mag_idx = request.body.magazine_idx;
    var req_com_idx = request.body.comment_idx;
    async.waterfall([
        function (nextCallback) {
            magazinedao.deletemagazinecomment(req_com_idx, nextCallback);
        }, function (nextCallback) {
            magazinedao.editmagazinecommentcount(req_mag_idx, -1, nextCallback);
        }
    ], function (error) {
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
