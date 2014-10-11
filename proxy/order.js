var EventProxy = require('eventproxy');

var models = require('../models');
var Travel = require('./travel');
var Order = models.Order;
var listCfg = require('config').list;
var render = require("../core/render");

exports.findOneAndUpdate = function (order_id, update, callback) {
  Order.findOneAndUpdate(order_id, update, callback);
};

exports.getOrderOneById = function (order_id, callback) {
  var query = Order.findById(order_id)
  query.exec(function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, {});
    }
    return callback(null, docs);
  });
};

exports.getCustomerOrderList = function (user_id, page, callback) {
  var query = Order.find({_user: user_id }).populate("_travel").populate("_channel").populate("_product").sort({updatedate: -1});
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
    render.redner_order_customer_detaillink(docs);
    render.render_order_status(docs);
    render.render_amount(docs);
    render.render_peoplecount(docs);
    render.render_updatedate(docs);
    return callback(null, docs);
  });
}

exports.getAgentOrderList = function (agent_id, page, status, callback) {
  var query = Order.find({_agent: agent_id }).populate("_travel").populate("_channel").populate("_product").sort({updatedate: -1});
  if (typeof(status) == 'function') {
    callback = status;
  } else {
    query = Order.find({_agent: agent_id, status: status}).populate("_travel").populate("_channel").populate("_product").sort({updatedate: -1});
  }

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
    render.redner_order_detaillink(docs);
    render.render_order_status(docs);
    render.render_amount(docs);
    render.render_peoplecount(docs);
    render.render_updatedate(docs);
    return callback(null, docs);
  });

};


exports.newAndSave = function (agent_id, product_id, travel_id, channel_id, user_id, child_count, adult_count, amount, user_name, user_tel, tips, status, email_record, user_list, callback) {
  var order = new Order();
  order._travel = travel_id;
  order._product = product_id;
  order._channel = channel_id;
  order._user = user_id;
  order._agent = agent_id;
  order.child_count = child_count;
  order.adult_count = adult_count;
  order.amount = amount;
  order.user_name = user_name;
  order.user_tel = user_tel;
  order.tips = tips;
  order.status = 1;
  order.reason = '';
  order.email_record = email_record;
  order.user_list = user_list;
  order.save(callback);
};
