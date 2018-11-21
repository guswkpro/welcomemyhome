var dao = require('../../dao/userdao');
var dto = require('../../dto/userdto');
var async = require('async');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mkdirp = require('mkdirp');
require('date-utils');

/********************
        GET
********************/
exports.logincheck = function (request, response) {
	console.log(request.cookies);
	console.log(request.session);
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
			if (data[0].user_pw == req_user_pw) {
				var tmp = data[0].user_idx + request.sessionID;
				response.cookie('token', tmp, {
					maxAge: 60000 * 60 * 24
				});
				request.session.user_idx = data[0].user_idx;
				request.session.user_auth = data[0].user_auth;
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
	console.log(request.body);
	var req_user_id = request.body.id;
	var req_user_pw = request.body.pw;
	console.log(req_user_id + 'aaa');
	var req_user_nickname = request.body.nickname;
	var date = new Date();
	date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
	var user_auth = 0;
	var user_subscription = 1;
	var dir = './public/' + req_user_nickname;

	async.waterfall([
		function (nextCallback) {
			mkdirp(dir, nextCallback);
		}, function (url, nextCallback) {
			async.waterfall([
				function (nextCallback) {
					dto.user(req_user_id, req_user_pw, req_user_nickname, date, user_subscription, user_auth, nextCallback)
				}, function (userdata, nextCallback) {
					dao.signup(userdata, nextCallback);
				}
			], function (error) {
				if (error) {
					console.log(error);
					response.json({
						RESULT: "0"
					});
				} else {
					nextCallback(null);
				}
			});
		}
	], function (error) {
		response.json({
			RESULT: "1"
		});
	});
};

exports.test = function (request, response) {
	console.log('aaaaa');
	console.log(request.session.user_idx);
	console.log(request.session.user_auth);
	console.log(request.sessionID);
	console.log(request.session.cookie.sessionID);
	response.json({
		RESULT: 1
	});
};