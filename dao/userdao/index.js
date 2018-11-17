var mysql = require('mysql');
var dto = require('../../dto/userdto');

var client = mysql.createConnection({
    host: 'stweb.ccmxaq6oosug.ap-northeast-2.rds.amazonaws.com'
    , port: 3306
    , user: 'stweb'
    , password: 'stwebstweb'
    , database: 'stweb'
});

/********************
        GET
********************/
exports.getuseridauth = function (id, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_id = ?', [id], function (error, result, fields) {
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.signup = function (user, callback) {
    client.query('INSERT INTO stweb.stweb_users (user_id, user_pw, user_nickname, user_join_date, user_subscription, user_auth VALUES (?, ?, ?, ?, ?, ?)', [user.id, user.pw, user.nickname, user.join_date, user.subscription, user_auth], function (error, result) {
        callback(error, result);
    });
};

/********************
        PUT
********************/
exports.edituserconnectdate = function (user_idx, date, callback) {
    client.query('UPDATE stweb.stweb_users set user_recent_date = ? where user_idx = ?', [date, user_idx], function (error, result, fields) {
        callback(error);
    });
};

/********************
       DELETE
********************/