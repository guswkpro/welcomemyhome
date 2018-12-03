var communitydao = require('../../dao/communitydao');
var communitydto = require('../../dto/communitydto');
var userdao = require('../../dao/userdao')
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
require('date-utils');

/********************
        GET
********************/
exports.getcommunitylist = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_offset = request.param('offset');
    var info = [];
    var total_count;
    async.waterfall([
        function (nextCallback) {
            communitydao.getcommunitycount(nextCallback);
        }, function (cnt, nextCallback) {
            total_count = cnt;
            if (req_user_check == "0") {
                communitydao.getcommunitycount(req_offset, request.session.user_idx, nextCallback);
            } else {
                estimatedao.getestimatelist(req_offset, nextCallback);
            }
        }, function (communitylist, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < communitylist.length;
            }, function (callback) {
                userdao.getuserinformation(communitylist[count].user_idx, function (error, communityuserdata) {
                    communitylist[count].user_nickname = communityuserdata[0].user_nickname;
                    count++;
                    callback();
                });
            }, function (error) {
                nextCallback(error, communitylist);
            });
        }, function (communitylist, nextCallback) {
            var count = 0;
            async.whilst(function () {
                return count < communitylist.length;
            }, function (callback) {
                async.waterfall([
                    function (secondNextCallback) {
                        communitylist[count].community_post_date = communitylist[count].community_post_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                        fs.readFile(communitylist[count].community_thumbnail_path, function (error, data) {
                            communitylist[count].encodedimage = new Buffer(data).toString('base64');
                            secondNextCallback(error);
                        });
                    }, function (secondNextCallback) {
                        communitylist[count].likecheck = 0;
                        communitylist[count].commentcheck = 0;
                        communitydao.getcommunitylikecheck(communitylist[count].community_idx, req_user_idx, secondNextCallback);
                    }, function (checkdata, nextCallback) {
                        if (checkdata.length == 0) {
                            communitylist[count].likecheck = 0;
                            nextCallback(null);
                        } else {
                            communitylist[count].likecheck = 1;
                            nextCallback(null);
                        }
                    }, function (nextCallback) {
                        communitydao.getcommunitycommentcheck(communitylist[count].community_idx, req_user_idx, nextCallback);
                    }, function (checkdata, nextCallback) {
                        if (checkdata.length == 0) {
                            communitylist[count].commentcheck = 0;
                            nextCallback(null);
                        } else {
                            communitylist[count].commentcheck = 1;
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
                        info.push(communitylist[count]);
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
                , COUNT: total_count
            });
        }
    });
};

exports.getcommunitydetail = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_community_idx = request.param('community_idx');
    var info = {};
    async.waterfall([
        function (nextCallback) {
            communitydao.editcommunityhitcount(req_community_idx, nextCallback);
        }, function (nextCallback) {
            communitydao.getcommunitydetail(req_community_idx, nextCallback);
        }, function (communitydata, nextCallback) {
            userdao.getuserinformation(communitydata[0].user_idx, function (error, communityuserdata) {
                communitydata[0].user_nickname = communityuserdata[0].user_nickname;
                nextCallback(error, communitydata);
            });
        }, function (communitydata, nextCallback) {
            var encodedimage = [];
            var count = 0;
            communitydata[0].community_picture_path = communitydata[0].community_picture_path.split(',');
            async.whilst(function () {
                return count < (communitydata[0].community_picture_path.length - 1);
            }, function (callback) {
                fs.readFile(communitydata[0].community_picture_path[count], function (error, data) {
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
                communitydata[0].likecheck = 0;
                communitydata[0].commentcheck = 0;
                communitydata[0].encodedimage = encodedimage;
                async.waterfall([
                    function (secondnextCallback) {
                        communitydata[0].community_post_date = communitydata[0].community_post_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                        communitydao.getcommunitylikecheck(communitydata[0].community_idx, req_user_idx, secondnextCallback);
                    }, function (checkdata, secondnextCallback) {
                        if (checkdata.length == 0) {
                            communitydata[0].pincheck = 0;
                            communitydao.getcommunitycommentcheck(communitydata[0].community_idx, req_user_idx, secondnextCallback);
                        } else {
                            communitydata[0].pincheck = 1;
                            communitydao.getcommunitycommentcheck(communitydata[0].community_idx, req_user_idx, secondnextCallback);
                        }
                    }
                ], function (error) {
                    if (error) {
                        console.log(error);
                        response.json({
                            RESULT: "0"
                        });
                    } else {
                        communitydata[0].community_hit_count = Number(communitydata[0].community_hit_count) + 1;
                        info = communitydata[0];
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

exports.getcommunitycomment = function (request, response) {
    var req_community_idx = request.param('community_idx');
    var info = [];
    async.waterfall([
        function (nextCallback) {
            communitydao.getcommunitycomment(req_community_idx, nextCallback);
        }, function (communitycommentdata, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < communitycommentdata.length;
            }, function (callback) {
                var communitycommentinfodetail = {};
                userdao.getuserinformation(communitycommentdata[count].user_idx, function (error, communitycommentuserdata) {
                    communitycommentinfodetail.user_nickname = communitycommentuserdata[0].user_nickname;
                    if (communitycommentuserdata[0].user_picture_thumbnail_path + '' == "null") {
                        communitycommentinfodetail.user_profile_image = "null";
                    } else {
                        fs.readFile(communitycommentuserdata[0].user_picture_thumbnail_path, function (error, data) {
                            communitycommentinfodetail.user_profile_image = new Buffer(data).toString('base64');
                        });
                    }
                    communitycommentinfodetail.community_comment_user_idx = communitycommentdata[count].user_idx;
                    communitycommentinfodetail.community_comment_idx = communitycommentdata[count].comment_idx;
                    communitycommentinfodetail.community_comment_content = communitycommentdata[count].comment;
                    communitycommentinfodetail.community_comment_post_date = communitycommentdata[count].comment_post_date.toFormat('YYYY-MM-DD HH24:MI:SS');
                    info.push(communitycommentinfodetail);
                    count++;
                    callback();
                });
            }, function (error) {
                nextCallback(error, null);
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


/********************
        POST
********************/
exports.addcommunity = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_community_title = request.body.title;
    var req_community_content = request.body.content;
    var req_community_image = request.body.image;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath = '';
    var thumbnailpath = '';
    var dirname = "./public/" + req_user_nickname + "/community";
    var newPath;
    var random_number = Math.floor(Math.random() * 10) + 1;
    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            dirname = dirname + "/" + dirdate;
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            if (req_community_image == 'null') {
                thumbnailpath = "./public/community/default/" + random_number + ".jpg";
                communitydto.community(req_user_idx, req_community_title, req_community_content, date, undefined, undefined, thumbnailpath, nextCallback);
            } else {
                count = 0;
                async.whilst(function () {
                    return count < req_community_image.length;
                }, function (callback) {
                    var bitmap = new Buffer(req_community_image[count].image, 'base64');
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
                        thumbnailpath = imagepath.split(',')[0];
                        communitydto.community(req_user_idx, req_community_title, req_community_content, date, undefined, imagepath, thumbnailpath, nextCallback);
                    }
                });
            }
        }, function (community, nextCallback) {
            communitydao.addcommunity(community, nextCallback);
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


exports.addcommunitylike = function (request, response) {
    var req_user_idx = request.session.user_idx
    var req_community_idx = request.body.community_idx;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    async.waterfall([
        function (nextCallback) {
            communitydto.communitylike(req_user_idx, req_community_idx, date, nextCallback);
        }, function (like, nextCallback) {
            communitydao.addcommunitylike(like, nextCallback);
        }, function (nextCallback) {
            communitydao.editcommunitylikecount(req_community_idx, 1, nextCallback);
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

exports.addcommunitycomment = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_community_idx = request.body.community_idx;
    var req_comment_content = request.body.content;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    async.waterfall([
        function (nextCallback) {
            communitydto.communitycomment(req_user_idx, req_community_idx, req_comment_content, date, nextCallback);
        }, function (comment, nextCallback) {
            communitydao.addcommunitycomment(comment, nextCallback);
        }, function (nextCallback) {
            communitydao.editcommunitycommentcount(req_community_idx, 1, nextCallback);
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
exports.deletecommunity = function (request, response) {
    var req_community_idx = request.body.community_idx;
    async.waterfall([
        function (nextCallback) {
            communitydao.deletecommunity(req_community_idx, nextCallback);
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

exports.deletecommunitylike = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_community_idx = request.body.community_idx;
    async.waterfall([
        function (nextCallback) {
            communitydao.deletecommunitylike(req_community_idx, req_user_idx, nextCallback);
        }, function (nextCallback) {
            communitydao.editcommunitylikecount(req_community_idx, -1, nextCallback);
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

exports.deletecommunitycomment = function (request, response) {
    var req_community_idx = request.body.community_idx;
    var req_comment_idx = request.body.comment_idx;
    async.waterfall([
        function (nextCallback) {
            communitydao.deletecommunitycomment(req_comment_idx, nextCallback);
        }, function (nextCallback) {
            communitydao.editcommunitycommentcount(req_community_idx, -1, nextCallback);
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

/********************
        PUT
********************/
exports.putcommunity = function (request, response) {
    var req_user_nickname = request.session.user_nickname;
    var req_community_idx = request.body.community_idx;
    var req_community_title = request.body.title;
    var req_community_content = request.body.content;
    var req_community_image = request.body.image;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath = '';
    var thumbnailpath = '';
    var dirname = "./public/" + req_user_nickname + "/community";
    var newPath;
    var random_number = Math.floor(Math.random() * 10) + 1;
    async.waterfall([
        function (nextCallback) {
            if (req_community_image == 'null') {
                thumbnailpath = "./publie/community/default/" + random_number + ".jpg";
                communitydto.community(undefined, req_community_title, req_community_content, undefined, date, undefined, thumbnailpath, nextCallback);
            } else {
                count = 0;
                async.whilst(function () {
                    return count < req_community_image.length;
                }, function (callback) {
                    var bitmap = new Buffer(req_community_image[count].image, 'base64');
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
                        thumbnailpath = imagepath.split(',')[0];
                        communitydto.community(undefined, req_community_title, req_community_content, undefined, date, imagepath, thumbnailpath, nextCallback);
                    }
                });
            }
        }, function (community, nextCallback) {
            communitydao.editcommunity(community, req_community_idx, nextCallback);
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
