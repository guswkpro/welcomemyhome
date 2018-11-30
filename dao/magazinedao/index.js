var client= require('../dao.js');

/********************
        GET
********************/
exports.getmagazinelist = function (offset, callback) {
    client.query('SELECT * FROM stweb.stweb_magazines order by magazine_idx DESC limit ?, 15', [Number(offset)], function (error, result) {
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
    client.query('SELECT * FROM stweb.stweb_magazine_likes where magazine_idx = ? AND user_idx = ?', [magazine_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getmagazinecommentcheck = function (magazine_idx, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_magazine_comments where magazine_idx = ? AND user_idx = ?', [magazine_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.addmagazinelike = function (like, date, callback) {
    client.query('INSERT INTO stweb.stweb_magazine_likes (like_date, magazine_idx, user_idx) VALUES (?, ?, ?)', [date, like.magazine_idx, like.user_idx], function (error) {
        callback(error);
    });
};
exports.addmagazinecomment = function (comment, callback) {
    client.query('INSERT INTO stweb.stweb_magazine_comments (comment_content, comment_post_date, user_idx, magazine_idx) VALUES(?, ?, ?, ?)', [comment.comment_content, comment.comment_post_date, comment.user_idx, comment.magazine_idx], function (error) {
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
