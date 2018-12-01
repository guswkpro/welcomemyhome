exports.community = function (user_idx, title, content, post_date, edit_date, picture_path, thumbnail_path, callback) {
    var community = {};
    community.user_idx = user_idx;
    community.community_title = title;
    community.community_content = content;
    community.community_post_date = post_date;
    community.community_edit_date = edit_date;
    community.community_picture_path = picture_path;
    community.community_thumbnail_path = thumbnail_path;
    callback(null, community);
};

exports.communitycomment = function (user_idx, community_idx, content, date, callback) {
    var comment = {};
    comment.user_idx = user_idx;
    comment.community_idx = community_idx;
    comment.comment_content = content;
    comment.comment_post_date = date;
    callback(null, comment);
};

exports.communitylike = function (user_idx, community_idx, date, callback) {
    var like = {};
    like.user_idx = user_idx;
    like.community_idx = community_idx;
    like.like_date = date;
    callback(null, like);
};