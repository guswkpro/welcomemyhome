exports.preinspection = function(user_idx, date, imagepath, width, height, callback){
    var preinspection = {};
    preinspection.user_idx = user_idx;
    preinspection.preinspection_date = date;
    preinspection.preinspection_picture_path = imagepath;
    preinspection.preinspection_width = width;
    preinspection.preinspection_height = height;
    callback(null, preinspection);
};