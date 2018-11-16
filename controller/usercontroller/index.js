var dao = require('../../dao/userdao');
var async = require('async');

exports.login = function(request, response) {
	var req_user_id = request.body.id;
	var req_user_pw = request.body.pw;
	async.waterfall([
		function(nextCallback){
			dao.login(id, pw, nextCallback);
		}
	], function(error, result){
		if(error){
			consloe.log(error);
			callback("0");
		} else if(result.length == 0) {
			callback("2");
		} else {
			callback("1");
		}
	});
/*	dao.login(id, pw, function(error, result) {
		console.log(result.user_idx);
		if(result.user_idx != null){
			callback("1");
		} else {
			callback("0");
		}
	});
*/
};

exports.login = function(id, pw, callback){}