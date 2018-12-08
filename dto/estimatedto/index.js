exports.estimate = function(user_idx, title, content, date, imagepath, address, count, callback){
    var estimate = {};
    estimate.user_idx = user_idx;
    estimate.estimate_title = title;
    estimate.estimate_content = content;
    estimate.estimate_date = date;
    estimate.estimate_picture_path = imagepath;
    estimate.estimate_address = address;
    estimate.estimate_answer_count = count;
    callback(null, estimate);
};

exports.estimateanswer = function (user_idx, estimate_idx, title, content, date, imagepath, callback) {
    var answer = {};
    answer.user_idx = user_idx;
    answer.estimate_idx = estimate_idx;
    answer.answer_title = title;
    answer.answer_content = content;
    answer.answer_post_date = date;
    answer.answer_picture_path = imagepath;
    callback(null, answer);
};
