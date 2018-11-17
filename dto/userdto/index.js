exports.user = function (id, pw, nickname, join_date, recent_date, subscription, auth, callback) {
    var user = {};
    user.id = id;
    user.pw = pw;
    user.nickname = nickname;
    user.join_date = join_date;
    user.subscription = subscription;
    user.auth = auth;
    callback(null, user);
};