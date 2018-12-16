var dao = require('../../dao/userdao');
var dto = require('../../dto/userdto');
var async = require('async');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mkdirp = require('mkdirp');
var fs = require('fs');
var crypto = require('crypto');
require('date-utils');

/********************
        GET
********************/
exports.logincheck = function (request, response) {
	if (typeof request.cookies.token != 'undefined') {
		var checkData = request.cookies.token.split('/');
		if (typeof request.session.check_status == 'undefined') {
			response.json({
				RESULT: "2"
			});
		} else if (checkData[0] == request.session.user_idx && checkData[2] == request.sessionID) {
			response.json({
				RESULT: "1",
				auth: request.session.user_auth
			});
		} else {
			response.json({
				RESULT: "0"
			});
		}
	} else {
		response.json({
			RESULT: "2"
		});
	}
};

exports.idcheck = function (request, response) {
	var req_user_id = request.param("user_id");
	async.waterfall([
		function (nextCallback) {
			dao.getidcheck(req_user_id, nextCallback);
		}
	], function (error, result) {
		if (error) {
			console.log(error);
			response.json({
				RESULT: "0"
			});
		} else if (result.length != 0) {
			response.json({
				RESULT: "1"
			});
		} else {
			response.json({
				RESULT: "2"
			});
		}
	});
};

exports.nicknamecheck = function (request, response) {
	var req_user_nickname = request.param("user_nickname");
	async.waterfall([
		function (nextCallback) {
			dao.getnicknamecheck(req_user_nickname, nextCallback);
		}
	], function (error, result) {
		if (error) {
			console.log(error);
			response.json({
				RESULT: "0"
			});
		} else if (result.length != 0) {
			response.json({
				RESULT: "1"
			});
		} else {
			response.json({
				RESULT: "2"
			});
		}
	});
};

exports.logout = function (request, response) {
	request.session.destroy(
		function (error) {
			if (error) {
				console.log(error);
				response.json({
					RESULT: "0"
				});
			} else {
				response.json({
					RESULT: "1"
				});
			}
		}
	)
};

/********************
        POST
********************/
exports.login = function (request, response) {
	var req_user_id = request.body.id;
	var req_user_pw = request.body.pw;
	var date = new Date();
	date = date.toFormat('YYYY-MM-DD HH24:MI:SS');

	async.waterfall([
		function (nextCallback) {
			dao.getuseridauth(req_user_id, nextCallback);
		}, function (data, nextCallback) {
			if (data.length == 0) {
				nextCallback("NO ID", null, 2)
			} else if (data[0].user_subscription == 0) {
				nextCallback("LEAVE", null, 4);
			} else {
				nextCallback(undefined, data);
			}
		}, function (data, nextCallback) {
			data[0].user_join_date = data[0].user_join_date.toFormat("YYYYMMDDHH24MISS");
			if (crypto.createHash('sha512').update(data[0].user_join_date + req_user_pw).digest('hex') == data[0].user_pw) {
				var tmp = data[0].user_idx + '/' + data[0].user_auth + '/' + request.sessionID;
				response.cookie('token', tmp, {
					maxAge: 60000 * 60 * 24
				});
				request.session.user_idx = data[0].user_idx;
				request.session.user_nickname = data[0].user_nickname;
				request.session.user_auth = data[0].user_auth;
				request.session.check_status = 1;
				dao.edituserconnectdate(date, data[0].user_idx, nextCallback);
			} else {
				nextCallback("WRONG PW", null, 3);
			}
		}
	], function (error, result, fail) {
		if (error) {
			response.json({
				RESULT: fail
			});
		} else {
			response.json({
				RESULT: "1"
			});
		}
	});
};

exports.signup = function (request, response) {
	var req_user_id = request.body.id;
	var req_user_pw = request.body.pw;
	var req_user_nickname = request.body.nickname;
	var date = new Date();
	date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
	var saltdate = new Date();
	saltdate = saltdate.toFormat("YYYYMMDDHH24MISS");
	var user_auth = 0;
	var user_subscription = 1;
	var dir = './public/' + req_user_nickname;

	async.waterfall([
		function (nextCallback) {
			mkdirp(dir, nextCallback);
		}, function (url, nextCallback) {
			dto.user(req_user_id, crypto.createHash('sha512').update(saltdate + req_user_pw).digest('hex'), req_user_nickname, date, user_subscription, user_auth, nextCallback);
		}, function (userdata, nextCallback) {
			dao.signup(userdata, nextCallback);
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

exports.mypagepwcheck = function (request, response) {
	var req_user_idx = request.session.user_idx;
	var req_user_pw = request.body.pw;

	async.waterfall([
		function (nextCallback) {
			dao.getuserinformation(req_user_idx, nextCallback);
		}
	], function (error, result) {
		result[0].user_join_date = result[0].user_join_date.toFormat("YYYYMMDDHH24MISS");
		if (error) {
			response.json({
				RESULT: "0"
			});
		} else if (result[0].user_pw == crypto.createHash('sha512').update(result[0].user_join_date + req_user_pw).digest('hex')) {
			response.json({
				RESULT: "1"
			});
		} else {
			response.json({
				RESULT: "2"
			});
		}
	});
};

/********************
        PUT
********************/
exports.editprofile = function (request, response) {
	var req_user_idx = request.session.user_idx
	var req_user_profile_imgae = request.body.image;
	var dirname = "./public/" + request.session.user_nickname;
	var dirdate = new Date();
	dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
	var newPath;

	async.waterfall([
		function (nextCallback) {
			var bitmap = new Buffer(req_user_profile_imgae, 'base64');
			newPath = dirname + "/" + request.session.user_nickname + "_profile_" + dirdate + ".jpg";
			fs.writeFile(newPath, bitmap, 'base64', nextCallback);
		}, function (nextCallback) {
			dao.editprofile(req_user_idx, newPath, nextCallback);
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
			});
		}
	});
};

exports.editpassword = function (request, response) {
	var req_user_idx = request.session.user_idx
	var req_user_pw = request.body.pw;

	async.waterfall([
		function (nextCallback) {
			dao.getuserinformation(req_user_idx, nextCallback);
		}, function (data, nextCallback) {
			data[0].user_join_date = data[0].user_join_date.toFormat("YYYYMMDDHH24MISS");
			dao.editpassword(req_user_idx, crypto.createHash('sha512').update(data[0].user_join_date + req_user_pw).digest('hex'), nextCallback);
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
			});
		}
	});
};