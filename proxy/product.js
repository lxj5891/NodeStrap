var models = require('../models');
var Product = models.Product;
var Channel = models.Channel;
var listCfg = require('config').list
var render = require("../core/render");



exports.findByIdAndUpdate = function(id,update,callback){
  Product.findByIdAndUpdate(id,update,callback);
};

exports.getProductIdsBy = function(addr,callback){
  console.log("addr  : " + addr);
  var query = Product.find({address: addr}).select('_id');
  query.exec(function(err,result){
    if(err){
      return callback(null,[]);
    }
    if(!result){
      return callback(null,[]);
    }
    var ids = [];
    for(var i in result){
      ids.push(result[i]._id);
    }
    callback(null,ids);
  });
}

exports.remove = function (id, callback) {

  var data = {
    valid: 0
  }
  Product.findByIdAndUpdate(id, data, callback);
//  var query = Product.remove({ _id: id });
//  query.exec();
//  return callback(null);

};

exports.getProductAddrByChannel = function (channel_id, callback) {
  var query = Product.find({_channel: channel_id}).select('address');
  query.exec(callback);
}

exports.getProductByChannel = function (id, callback) {
  var query = Product.find({channel_id: id});
  query.exec(callback);
  return;
}

exports.getProductById = function (id, callback) {
  var query = Product.findById(id).populate("_channel");
  query.exec(callback);
  return;
}


exports.getInfoById = function (id, callback) {
  var query = Product.findById(id);
  query.exec(callback);
  return;
}

exports.getListPaginate = function (page,user, callback) {
  Channel.find({_user:user._id,valid:1},function(err,docs){
    var channelIds = [];
    for(var i in docs){
      channelIds[i] = docs[i]._id;
    }
    var query = Product.find({valid: 1 , _channel:{$in:channelIds}}).populate("_channel");
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
        console.log(docs);
      render.render_goBack(docs);
      render.render_startEnd(docs);
      render.render_adultChild(docs);
      render.render_days(docs);
      return callback(null, docs);
    });
  });

}
