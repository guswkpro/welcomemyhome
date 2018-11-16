var mysql = require('mysql');
var client = mysql.createConnection({
    host: 'stweb.ccmxaq6oosug.ap-northeast-2.rds.amazonaws.com'
    , port: 3306
    , user: 'stweb'
    , password: 'stwebstweb'
    , database: 'ridingEveryone'
});

exports.login = function(id, pw, callback){
	client.query('SELECT * FROM ridingEveryone.users_table where user_id = ? AND user_pw = ?', [id, pw], function(error, result, fields){
		console.log(result);
		callback(error, result);
	});
};

exports.getuseridauth = function ()
