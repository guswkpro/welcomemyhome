var mysql = require('mysql');

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
exports.getmagazinelist = function (offset, callback) {
    client.query('SELECT * FROM stweb.stweb_magazines order by magazine_idx DESC limit ?, 6', [Number(offset)], function (error, result) {
        callback(error, result);
    });
};
exports.getmagazinedetail = function (magazine_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_magazines where magazine_idx = ?', [magazine_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getmagazinecomment = function (magazine_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_magazine_comments where magazine_idx = ?', [magazine_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getmagazinelikecheck = function (magazine_idx, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_magazines_likes where magazine_idx = ? AND user_idx = ?', [magazine_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getmagazinecommentcheck = function (magazine_idx, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_magazines_comments where magazine_idx = ? AND user_idx = ?', [magazine_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.addestimate = function (estimate, callback) {
    client.query('INSERT INTO stweb.stweb_estimates (estimate_picture_path, estimate_content, estimate_date, user_idx) VALUES (?, ?, ?, ?)', [estimate.estimate_picture_path, estimate.estimate_content, estimate.estimate_date, estimate.user_idx], function (error) {
        callback(error);
    });
};
exports.addestimateanswer = function (estimateanswer, callback) {
    client.query('INSERT INTO stweb.stweb_estimate_answers (answer_picture_path, answer_content, answer_date, estimate_idx, user_idx) VALUES (?, ?, ?, ?, ?)', [estimateanswer.answer_picture_path, estimateanswer.answer_content, estimateanswer.answer_post_date, estimateanswer.estimate_idx, estimateanswer.user_idx], function (error) {
        callback(error);
    });
};

/********************
        PUT
********************/
exports.editmagazinehitcount = function (magazine_idx, callback) {
    client.query('UPDATE stweb.stweb_magazines set magazine_hit_count = magazine_hit_count + 1 where magazine_idx = ?', [magazine_idx], function (error) {
        callback(error);
    });
};
exports.editmagazinelikecount = function (magazine_idx, count, callback) {
    client.query('UPDATE stweb.stweb_magazines set magazine_like_count = magazine_like_count + ? where magazine_idx = ?', [Number(count), magazine_idx], function (error) {
        callback(error);
    });
};
exports.editmagazinecommentcount = function (magazine_idx, count, callback) {
    client.query('UPDATE stweb.stweb_magazines set magazine_comment_count = magazine_comment_count + ? where magazine_idx = ?', [Number(count), magazine_idx], function (error) {
        callback(error);
    });
};

/********************
       DELETE
********************/
exports.deletemagazinelike = function (magazine_idx, user_idx, callback) {
    client.query('DELETE FROM stweb.stweb_magazine_likes WHERE magazine_idx= ? and user_idx= ?', [magazine_idx, user_idx], function (error) {
        callback(error);
    });
};
exports.deletemagazinecomment = function (comment_idx, callback) {
    client.query('DELETE FROM stweb.stweb_magazine_comments WHERE comment_idx = ?', [comment_idx], function (error) {
        callback(error);
    });
};