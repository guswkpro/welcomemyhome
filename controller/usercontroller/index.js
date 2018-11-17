var dao = require('../../dao/userdao');
var dto = require('../../dto/userdto');
var async = require('async');
var session = require('express-session');
var mkdirp = require('mkdirp');

/********************
        GET
********************/

/********************
        POST
********************/
exports.login = function (request, response) {
	var req_user_id = request.body.id;
	var req_user_pw = request.body.pw;
	var data = new Date();
	date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
	session = request.session;
	async.waterfall([
		function (nextCallback) {
			dao.getuseridauth(req_user_id, nextCallback);
		}, function (data, nextCallback) {
			if (data.length == 0) {
				nextCallback("NO ID", null, 2)
			} else if (data[0].user_subscription == 0) {
				nextCallback("LEAVE", null, 4);
			} else {
				nextCallback(null, data);
			}
		}, function (data, nextCallback) {
			if (data[0].user_pw == req_user_pw) {
				session.user_idx = data[0].user_idx;
				dao.edituserconnectdate(date, data[0].user_idx, nextCallback);
			} else {
				nextCallback("WRONG PW", null, 3);
			}
		}
	], function (error, result, fail) {
		if (error) {
			response.json({
				RESULT : fail
			});
		} else {
			response.json({
				RESULT : "1"
			});
		}
	});
};

exports.signup = function (request, response){
	var req_user_id = request.body.id;
	var req_user_pw = request.body.pw;
	var req_user_nickname = request.body.nickname;
	var date = new Date();
	date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
	var user_auth = 0;
	var user_subscription = 1;
	var dir = './public/' + req_user_nickname;

	async.waterfall([
		function(nextCallback){
			mkdirp(dir, nextCallback);
		}, function(url, nextCallback){
			async.waterfall([
				function (nextCallback){
					dto.user(req_user_id, req_user_pw, req_user_nickname, date, date, user_subscription, user_auth, nextCallback)
				}, function(userdata, nextCallback){
					dao.signup(userdata, nextCallback);
				}
			], function(error){
				if(error){
					console.log(error);
					response.json({
						RESULT : "0"
					});
				} else {
					nextCallback(null);
				}
			});
		}
	], function(error){
		response.json({
			RESULT : "1"
		});
	});
};

// exports.test = function (request, response){
// 	session = request.
// 	session.userid = 'sw';
// };