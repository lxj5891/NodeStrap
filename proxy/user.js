var models = require('../models');
var User = models.User;
var listCfg = require('config').list
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var render = require("../core/render");

exports.updateTravelCountAddOneByUId = function(id,user_travel_count,callback){
  exports.findByIdAndUpdate(id,{travel_count:user_travel_count + 1},callback);
};

exports.findByIdAndUpdate = function(id,update,callback){
  User.findByIdAndUpdate(id,update,callback);
};

exports.getUsersByQuery = function (query, callback) {
  User.find(query, callback);
};

exports.getUserById = function (id, callback) {
  User.findOne({_id: id}, callback);
};

exports.getUserListPaginate = function (page, callback) {
  var query = User.find();
  var options = {
    perPage: listCfg.pageSize,
    page: page
  };
  query.paginate(options, function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, []);
    }

    if (docs.length === 0) {
      return callback(null, [])
    }
    render.redner_user_status(docs);
    return callback(null, docs);
  });
}

/**
 * 用户保存User用户
 * @param name
 * @param callback
 */
exports.newAndSave = function (name, loginname, pass, email, qq, profile_image_url, province, city, area, company, address, tel, qq, is_admin, level, des, sign, is_active, object_id, callback) {
  var user = new User();
  if(object_id){
    user._id = ObjectId(object_id);
  }

  user.name = name;
  user.loginname = loginname;
  user.pass = pass;
  user.email = email;
  user.qq = qq;
  user.profile_image_url = profile_image_url;
  user.province = province;
  user.city = city;
  user.area = area;
  user.company = company;
  user.address = address;
  user.tel = tel;
  user.qq = qq;
  user.is_admin = is_admin;
  user.level = level;
  user.des = des;
  user.sign = sign;
  user.is_active = is_active;
  user.save(callback);
};

exports.getUserListByLevel = function (level, callback) {

  var query = User.find({level: level}).select('_id loginname');
  query.exec(function (err, docs) {
    return callback(null, docs);
  });

}


exports.getUserByLoginName = function (loginname, callback) {
  User.findOne({loginname: loginname}, callback);
};