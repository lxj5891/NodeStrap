/**
 * Created with JetBrains WebStorm.
 * User: chenyingxi
 * Date: 13-10-5
 * Time: 下午1:06
 * To change this template use File | Settings | File Templates.
 */
var models = require('../models');
var Product = models.Product;
var Travel = models.Travel;
var Channel = models.Channel;
var proxy = require('../proxy');
var ProductProxy = proxy.Product;
var listCfg = require('config').list;
var render = require("../core/render");



exports.updateTravelAndUpdateById = function (travel_id, travel, callback) {
  var query = Travel.findByIdAndUpdate(travel_id, travel);
  query.exec(function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {

      return callback(null, {});
    }
//    render.render_updatedate(docs);
    return callback(null, docs);
  });
};

exports.getAllTravel = function (page, user,callback) {
  Channel.find({_user:user._id , valid:1},function(err,docs){
    var channelIds = [];
    for(var i in docs){
      channelIds[i] = docs[i]._id;
    }
    var options = {
      perPage: listCfg.pageSize,
      page: page
    };
    var query = Travel.find({_channel:{$in:channelIds}}).populate("_product");
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
      render.render_travelGoBack(docs);
      render.render_traveldays(docs);
      render.render_resultAdultChild(docs);
      render.render_travelStartEnd(docs);
      render.render_travelElses(docs);
      render.render_travel_btn(docs);
      render.render_travelValid(docs);


      return callback(null, docs);
    });
  });
}

exports.getTravelAndProductByTravelId = function (travel_id, callback) {
  var query = Travel.findById(travel_id).populate("_product _channel");
  query.exec(function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, {});
    }
//    render.render_updatedate(docs);
    return callback(null, docs);
  });
};

exports.getTravelListByChannel = function (page, channel, addr, callback) {
  var query = Travel.find({_channel: channel ,valid: 1}).sort({traveldate:1}).populate("_product");
  var options = {
    perPage: listCfg.pageSize,
    page: page
  };


  if (!addr) {
//    callback = addr;
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
//    render.render_updatedate(docs);
      return callback(null, docs);
    });
  } else {
    ProductProxy.getProductIdsBy(addr, function (err, result) {
      console.log(result);
      query = Travel.find({_channel: channel, _product: {"$in": result} }).populate("_product");
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
//    render.render_updatedate(docs);
        return callback(null, docs);
      });
    });
  }

}
exports.getTravelDaylineByDate = function (_product, day_line, callback) {
  var din = [];
  for (var i in day_line) {
    din.push(day_line[i].date);
  }
  var query = Travel.find({_product: _product, traveldate: {"$in": din},valid:1}).populate("_product");;
  query.exec(function (err, docs) {
    console.log(docs);
    for (var i in docs) {
      for (var j in day_line) {
        if (docs[i].traveldate == day_line[j].date) {
          day_line[j].price = docs[i]._product.adult_price;
          day_line[j]._id = docs[i]._id;
        }
      }
    }
    callback(err, day_line);
  });
};

exports.getTravelById = function (id, callback) {
  var query = Travel.findById(id).populate("_product");
  query.exec(callback);
  return;
}


exports.remove = function (id, callback) {
  console.log(id);
  var query = Travel.remove({ _id: id });
  query.exec();
  return callback(null);
};
