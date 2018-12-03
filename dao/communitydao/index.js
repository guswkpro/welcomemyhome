var client = require('../dao.js');

/********************
        GET
********************/
exports.getcommunitylist = function (offset, callback) {
    client.query('SELECT * FROM stweb.stweb_communities order by community_idx DESC limit ?, 5', [Number(offset)], function (error, result) {
        callback(error, result);
    });
};
exports.getcommunitydetail = function (community_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_communities where community_idx = ?', [community_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getcommunitycomment = function (community_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_community_comments where community_idx = ?', [community_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getcommunitylikecheck = function (community_idx, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_community_likes where community_idx = ? AND user_idx = ?', [community_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getcommunitycommentcheck = function (community_idx, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_community_comments where community_idx = ? AND user_idx = ?', [community_idx, user_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getcommunitycount = function (callback) {
    client.query('SELECT count(*) as cnt FROM stweb.stweb_communities', [], function (error, result) {
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.addcommunity = function (community, callback) {
    client.query('INSERT INTO stweb.stweb_communities (community_title, community_content, community_post_date, community_picture_path, community_thumbnail_path, user_idx) VALUES (?, ? ,?, ?, ?, ?)', [community.community_title, community.community_content, community.community_post_date, community.community_picture_path, community.community_thumbnail_path, community.user_idx], function (error) {
        callback(error);
    });
};
exports.addcommunitylike = function (like, callback) {
    client.query('INSERT INTO stweb.stweb_community_likes (like_date, community_idx, user_idx) VALUES (?, ?, ?)', [like.like_date, like.community_idx, like.user_idx], function (error) {
        callback(error);
    });
};
exports.addcommunitycomment = function (comment, callback) {
    client.query('INSERT INTO stweb.stweb_community_comments (comment_content, comment_post_date, user_idx, community_idx) VALUES(?, ?, ?, ?)', [comment.comment_content, comment.comment_post_date, comment.user_idx, comment.community_idx], function (error) {
        callback(error);
    });
};

/********************
        PUT
********************/
exports.editcommunity = function (community, community_idx, callback) {
    client.query('UPDATE stweb.stweb_communities set community_title = ?, community_content = ?, community_edit_date = ?, community_picture_path = ?, community_thumbnail_path = ? where community_idx = ?', [community.community_title, community.community_content, community.community_edit_date, community.community_picture_path, community.community_thumbnail_path, community_idx], function (error) {
        callback(error);
    });
};
exports.editcommunityhitcount = function (community_idx, callback) {
    client.query('UPDATE stweb.stweb_communities set community_hit_count = community_hit_count + 1 where community_idx = ?', [community_idx], function (error) {
        callback(error);
    });
};
exports.editcommunitylikecount = function (community_idx, count, callback) {
    client.query('UPDATE stweb.stweb_communities set community_like_count = community_like_count + ? where community_idx = ?', [Number(count), community_idx], function (error) {
        callback(error);
    });
};
exports.editcommunitycommentcount = function (community_idx, count, callback) {
    client.query('UPDATE stweb.stweb_communities set community_comment_count = community_comment_count + ? where community_idx = ?', [Number(count), community_idx], function (error) {
        callback(error);
    });
};

/********************
       DELETE
********************/
exports.deletecommunity = function (community_idx, callback) {
    client.query('DELETE FROM stweb.stweb_communities WHERE community_idx= ?', [community_idx], function (error) {
        callback(error);
    });
};
exports.deletecommunitylike = function (community_idx, user_idx, callback) {
    client.query('DELETE FROM stweb.stweb_community_likes WHERE community_idx= ? and user_idx= ?', [community_idx, user_idx], function (error) {
        callback(error);
    });
};
exports.deletecommunitycomment = function (comment_idx, callback) {
    client.query('DELETE FROM stweb.stweb_community_comments WHERE comment_idx = ?', [comment_idx], function (error) {
        callback(error);
    });
};
