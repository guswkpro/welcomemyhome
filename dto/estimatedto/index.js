exports.estimate = function(user_idx, content, date, imagepath, callback){
    var estimate = {};
    estimate.user_idx = user_idx;
    estimate.estimate_content = content;
    estimate.estimate_date = date;
    estimate.estimate_picture_path = imagepath;
    callback(null, estimate);
};

exports.estimateanswer = function (user_idx, estimate_idx, content, date, imagepath, callback) {
    var answer = {};
    amswer.user_idx = user_idx;
    answer.estimate_idx = estimate_idx;
    answer.answer_content = content;
    answer.answer_post_date = date;
    answer.answer_picture_path = imagepath;
    callback(null, answer);
}; 