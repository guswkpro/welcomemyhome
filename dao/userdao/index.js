var client = require('../dao.js');

/********************
        GET
********************/
exports.getuseridauth = function (id, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_id = ?', [id], function (error, result) {
        callback(error, result);
    });
};
exports.getuserinformation = function (useridx, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_idx = ?', [useridx], function (error, result) {
        callback(error, result);
    });
};
exports.getidcheck = function (user_id, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_id = ?', [user_id], function (error, result) {
        callback(error, result);
    });
};
exports.getnicknamecheck = function (user_nickname, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_nickname = ?', [user_nickname], function (error, result) {
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.signup = function (user, callback) {
    client.query('INSERT INTO stweb.stweb_users (user_id, user_pw, user_nickname, user_join_date, user_subscription, user_auth) VALUES (?, ?, ?, ?, ?, ?)', [user.id, user.pw, user.nickname, user.join_date, user.subscription, user.auth], function (error, result) {
        callback(error, result);
    });
};

/********************
        PUT
********************/
exports.edituserconnectdate = function (date, user_idx, callback) {
    client.query('UPDATE stweb.stweb_users set user_recent_date = ? where user_idx = ?', [date, user_idx], function (error) {
        callback(error);
    });
};
exports.editpassword = function (user_idx, user_pw, callback) {
    client.query('UPDATE stweb.stweb_users set user_pw = ? where user_idx = ?', [user_pw, user_idx], function (error) {
        callback(error);
    });
};
exports.editprofile = function (user_idx, user_picture_path, callback) {
    client.query('UPDATE stweb.stweb_users set user_picture_path = ?, user_picture_thumbnail_path = ? where user_idx = ?', [user_picture_path, user_picture_path, user_idx], function (error) {
        callback(error);
    });
};

/********************
       DELETE
********************/