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
exports.getestimatelist = function (offset, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates order by estimate_idx DESC limit ?, 5', [Number(offset)], function (error, result) {
        callback(error, result);
    });
};
exports.getestimatelistforuser = function (offset, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates order by estimate_idx DESC limit ?, 5 where user_idx = ?', [Number(offset), user_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getestimatedetail = function (estimate_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates where estimate_idx = ?', [estimate_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getestimatecomment = function (estimate_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimate_comments where estimate_idx = ?', [estimate_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getestimatelikecheck = function (estimate_idx, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates_likes where estimate_idx = ? AND user_idx = ?', [estimate_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getestimatecommentcheck = function (estimate_idx, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates_comments where estimate_idx = ? AND user_idx = ?', [estimate_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.addestimate = function (estimate, callback) {
    client.query('INSERT INTO stweb.stweb_estimates (estimate_title, estimate_picture_path, estimate_content, estimate_date, estimate_answer_count, user_idx) VALUES (?, ?, ?, ?, ?, ?)', [estimate.estimate_title, estimate.estimate_picture_path, estimate.estimate_content, estimate.estimate_date, Number(estimate.estimate_answer_count), estimate.user_idx], function (error) {
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
exports.editanswercount = function (estimate_idx, callback) {
    client.query('UPDATE stweb.stweb_estimates set estimate_answer_count = estimate_answer_count + 1 where estimate_idx = ?', [estimate_idx], function (error) {
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