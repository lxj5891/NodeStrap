var EventProxy = require('eventproxy');

var models = require('../models');
var Channel = models.Channel;
var User = models.User;
var listCfg = require('config').list
var util = require("../core/util");
var render = require("../core/render");

exports.removeChannelById = function (channel_id, callback) {
  var data = {
    valid: 0
  }
  Channel.findByIdAndUpdate(channel_id, data, callback);
}

exports.updateOrderUpTop = function (channel_id, callback) {

  Channel.findOne({_id: channel_id}, function (err, channel_docs) {
    if (err) {
      callback(err);
      return;
    }
    var query = Channel.find().sort({sort: -1}).limit(1);
    query.exec(function (err, maxsort) {
      channel_docs.sort = 1 + maxsort[0].sort;
      channel_docs.save(callback);
    });
  });
};

exports.getTopChannelById = function (callback) {
  var query = Channel.find().sort({sort: -1}).limit(1).populate("_user");
  query.exec(function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, {});
    }
    return callback(null, docs[0]);
  });
}

exports.getChannelById = function (id, callback) {
  var query = Channel.findById(id).populate("_user");
  query.exec(function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, {});
    }
    return callback(null, docs);
  });

}


exports.getChannelByIdAndUpdate = function (id, channel_opt, callback) {
  var query = Channel.findByIdAndUpdate(id, channel_opt);
  query.exec(function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, {});
    }
    return callback(null, docs);
  });
}
/**
 *  User:李浩
 *  通过user 获取数据库中所有的专线信息. 做分页处理
 * @param callback
 */
exports.getChannelAllListByUser = function (page, user, callback) {
  var options = {
    perPage: listCfg.pageSize,
    page: page
  };
  var query = Channel.find({_user: user._id ,valid:1}).populate("_user", 'name company');
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
    render.render_updatedate(docs);
    return callback(null, docs);
  });
}
/**
 * User:chenyingxi
 *  获取数据库中所有的专线信息.
 * @param callback
 */
exports.getChannelAllList = function (page, callback) {

  var options = {
    perPage: listCfg.pageSize,
//    perPage: 100,
    page: page
  };
  var query = Channel.find({valid: 1}).sort({sort: -1}).populate("_user", 'name company');

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
    render.render_channels_btn(docs);
    render.render_updatedate(docs);
    return callback(null, docs);
  });
}

/**
 *  获取专线名称用户首页显示
 * @param callback
 */
exports.getFrontAllList = function (user,callback) {
  if(user!= "all") {
    var query = Channel.find({valid:1,_user:user._id}).select('_id title').limit(10);
    query.exec(function (err, docs) {
      return callback(null, docs);
    });
  } else {
    var query = Channel.find({valid:1}).select('_id title').limit(10);
    query.exec(function (err, docs) {
      return callback(null, docs);
    });
  }


}

/**
 *
 */
exports.newAndSave = function (user_id, createby, title, callback) {
  console.log("this is  controller");
  var channel = new Channel();
  channel._user = user_id;
  channel.title = title;
  channel.crateby = createby;
  channel.save(callback);
  return;
};


exports.remove = function (id, callback) {
  console.log(id);
  var query = Channel.remove({ _id: id });
  query.exec();
  return callback(null);


};


function initModal(modal) {
  switch (modal) {
    case "channel":
      return  new Channel();
      break;
  }
  return null
}






