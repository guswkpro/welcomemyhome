var client= require('../dao.js');

/********************
        GET
********************/
exports.getestimatelist = function (offset, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates order by estimate_idx DESC limit ?, 5', [Number(offset)], function (error, result) {
        callback(error, result);
    });
};
exports.getestimatelistforuser = function (offset, user_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates where user_idx = ? order by estimate_idx DESC limit ?, 5', [user_idx, Number(offset)], function (error, result) {
        callback(error, result);
    });
};
exports.getestimateanswerforuser = function(offset, user_idx, callback){
    client.query('SELECT * FROM stweb.stweb_estimate_answers where user_idx = ? order by estimate_idx DESC limit ?, 5', [user_idx, Number(offset)], function (error, result) {
        callback(error, result);
    });
};
exports.getestimatedetail = function (estimate_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimates where estimate_idx = ?', [estimate_idx], function (error, result) {
        callback(error, result);
    });
};
exports.getestimateanswer = function (offset, estimate_idx, callback) {
    client.query('SELECT * FROM stweb.stweb_estimate_answers where estimate_idx = ? order by answer_idx DESC limit ?, 5', [estimate_idx, Number(offset)], function (error, result) {
        callback(error, result);
    });
};
exports.getestimateanswerdetail = function (answer_idx, callback){
    client.query('SELECT * FROM stweb.stweb_estimate_answers where answer_idx = ?', [answer_idx], function(error, result){
        callback(error, result);
    });
};
exports.getestimatecount = function (callback){
    client.query('SELECT count(*) as cnt FROM stweb.stweb_estimates', [], function(error, result){
        callback(error, result);
    });
};
exports.getestimateanswercount = function (callback){
    client.query('SELECT count(*) as cnt FROM stweb.stweb_estimate_answers', [], function(error, result){
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.addestimate = function (estimate, callback) {
    client.query('INSERT INTO stweb.stweb_estimates (estimate_title, estimate_picture_path, estimate_content, estimate_date, estimate_address, estimate_answer_count, user_idx) VALUES (?, ?, ?, ?, ?, ?, ?)', [estimate.estimate_title, estimate.estimate_picture_path, estimate.estimate_content, estimate.estimate_date, estimate.estimate_address, Number(estimate.estimate_answer_count), estimate.user_idx], function (error) {
        callback(error);
    });
};
exports.addestimateanswer = function (estimateanswer, callback) {
    client.query('INSERT INTO stweb.stweb_estimate_answers (answer_title, answer_picture_path, answer_content, answer_date, estimate_idx, user_idx) VALUES (?, ?, ?, ?, ?, ?)', [estimateanswer.answer_title, estimateanswer.answer_picture_path, estimateanswer.answer_content, estimateanswer.answer_post_date, estimateanswer.estimate_idx, estimateanswer.user_idx], function (error) {
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

/********************
       DELETE
********************/