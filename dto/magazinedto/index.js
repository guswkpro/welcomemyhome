exports.magazinecomment = function (user_idx, magazine_idx, content, date, callback) {
    var comment = {};
    comment.user_idx = user_idx;
    comment.magazine_idx = magazine_idx;
    comment.comment_content = content;
    comment.post_date = date;
    callback(null, comment);
};

exports.magazinelike = function (user_idx, magazine_idx, date, callback) {
    var like = {};
    like.user_idx = user_idx;
    like.magazine_idx = magazine_idx;
    like.like_date = date;
    callback(null, like);
};