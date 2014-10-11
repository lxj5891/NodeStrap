var EventProxy = require('eventproxy');

var crypto = require('crypto');
var Paper = require('../proxy').Paper;
var News =require('../proxy').News;
var Channel = require('../proxy').Channel;
var Order = require('../proxy').Order;
var Travel = require('../proxy').Travel;
var Product = require('../proxy').Product;
var User = require('../proxy').User;
var config = require('../config').config;
var error = require('../core/error');
var Util = require('../core/util');

var socket = require('../socket');




exports.updateUser = function (req, res, next) {
  var user = req.session.user;
  res.render('qcheng/user/user_edit', {
    user_id: user._id,
    isAdmin :user.is_admin,
    layout: req._layout
  });
}



exports.updatePass = function (req, res, next) {
  var user = req.session.user;

  res.render('website/updatePwd', {
    layout: req._layout
  });

}

exports.updatePassword = function (req, res, next) {
  var data = req.nsData;
  console.log("+++++");
  console.log(data);
  if (data.pass != data.comPass) {
    res.setHeader('Content-Type', "application/json");
    res.json({status: 10004, success: false, msg: '两次输入的密码不一致'});
    return;
  }

  else{
    var user=req.session.user;
    var pass= md5(data.pass);
    User.findByIdAndUpdate(user._id, { pass:pass },function(err,User){
      res.setHeader('Content-Type', "application/json");

      if(req._layout=='layout/admin'){
                   var redirect="/admin";
      } else if(req._layout=='layout/agent'){
        var redirect="/agent";
      }  else if(req._layout=='layout/customer'){
        var redirect="/customer";
      }

      res.json({status: 10001, success: true, msg: '修改成功',redirect:redirect});
      return;
    });

  }
}

exports.join=function(req,res,next){
  res.render('website/joinUsAppleStyle'  ,{
     layout:false
    }
  )
}

exports.ieInfo=function(req,res,next){
  res.render('website/ieInfoAppleStyle'  ,{
      layout:false
    }
  )
}

exports.signup = function (req, res, next) {
  res.render('website/signupAppleStyle', {
    layout: false
  });
}

exports.detailCustomerOrder = function (req, res, next) {
  var order_id = req.query.order_id;

  if (!order_id || order_id.length == 0) {
    res.render('common/error', {layout: req._layout, status: 40003, err: '系统错误'});
    return;
  }
  Order.getOrderOneById(order_id, function (err, order) {
    res.render('qcheng/order/customer_order_detail', {layout: req._layout, travel_id: order._travel, order_id: order_id });
  });

}

exports.detailOrder = function (req, res, next) {
  var order_id = req.query.order_id;

  if (!order_id || order_id.length == 0) {
    res.render('common/error', {layout: req._layout, status: 40003, err: '系统错误'});
    return;
  }
  Order.getOrderOneById(order_id, function (err, order) {
    res.render('qcheng/order/agent_order_detail', {layout: req._layout, travel_id: order._travel, order_id: order_id });
  });
}

exports.addCustomerOrder = function (req, res, next) {

  var travel_id = req.query.t_id;
  var user = req.session.user;
  if (!travel_id || travel_id.length == 0) {
    res.render('common/error', {layout: 'layout/customer', status: 40003, err: '系统错误'});
    return;
  }
  res.render('qcheng/order/customer_order_add', {layout: 'layout/customer', travel_id: travel_id });
};

exports.addOrder = function (req, res, next) {
  var travel_id = req.query.t_id;

  if (!travel_id || travel_id.length == 0) {
    res.render('common/error', {layout: req._layout, status: 40003, err: '系统错误'});
    return;
  }
  res.render('qcheng/order/agent_order_add', {layout: req._layout, travel_id: travel_id });
};

exports.customerOrders = function (req, res, next) {
  var page = req.query.page || 1;
  var user = req.session.user;
  res.render('qcheng/order/customer_order_list', {
    layout: 'layout/customer',
    user: 'tobi',
    pageNum: page
  });
};

exports.orders = function (req, res, next) {
  var page = req.query.page || 1;

  res.render('qcheng/order/agent_order_list', {
    layout: 'layout/agent',
    user: 'tobi',
    pageNum: page
  });
};



exports.getOrderDetail = function (req, res, next) {
  var order_id = req.query.order_id;
  Order.getOrderOneById(order_id, function (err, order) {
    return res.json({status: 10002, data: order});
  });
};



exports.getCustomerOrderList = function (req, res, next) {
  var page = req.session.page || 1;
  var user_id = req.session.user._id;
  Order.getCustomerOrderList(user_id, page, function (err, order_list) {
    return res.json({data: {pagination: order_list}});
  });
}

exports.getCustomerOrderCancel = function (req, res, next) {
  var order_id = req.body.order_id;
  var reason = req.body.reason;
  var user_id = req.session.user._id;
  // 1 等待  2 订单成功 3 被旅行社取消 4 被用户取消 5 过期
  var update = {
    status: '4',
    reason: reason
  };
  Order.getOrderOneById(order_id, function (err, order) {
    if (order.status == '1') {
      Order.findOneAndUpdate({_id: order_id, _user: user_id}, update, function (err, result) {
        if (!result) {
          return res.json({status: 30004, err: "订单不存在或无权修改" });
        }
        Travel.getTravelById(order._travel, function (err, travel) {
          var travel_update = {
            elses: "" + parseInt(travel.elses) + parseInt(order.child_count) + parseInt(order.adult_count)
          };
          Travel.updateTravelAndUpdateById(order._travel, travel_update, function (err, travel_update) {
            res.json({status: 10004, data: result, msg: "订单已被取消。"});
          });
        });

      });
    } else {
      res.json({status: 30004, err: "订单已经操作，不能重复操作。"});
    }
  });
};

exports.getAgentOrderCancel = function (req, res, next) {
  var order_id = req.body.order_id;
  var reason = req.body.reason;
  var agent_id = req.session.user._id;
  // 1 等待  2 订单成功 3 被旅行社取消 4 被用户取消 5 过期
  var update = {
    status: '3',
    reason: reason
  };
  Order.getOrderOneById(order_id, function (err, order) {
    if (order.status == '1') {
      Order.findOneAndUpdate({_id: order_id, _agent: agent_id}, update, function (err, result) {
        if (!result) {
          return res.json({status: 30004, err: "订单不存在或无权修改" });
        }
        Travel.getTravelById(order._travel, function (err, travel) {
          var travel_update = {
            elses: "" + (parseInt(travel.elses) + parseInt(order.child_count) + parseInt(order.adult_count))
          };
          Travel.updateTravelAndUpdateById(order._travel, travel_update, function (err, travel_update) {
            res.json({status: 10004, data: result, msg: "订单已被取消。",redirect: "/agent"});
          });
        });

      });
    } else {
      res.json({status: 30004, err: "订单已经操作，不能重复操作。"});
    }
  });
};

exports.getAgentOrderConfirm = function (req, res, next) {
  var order_id = req.body.order_id;
  var agent_id = req.session.user._id;
  // 1 等待  2 订单成功 3 被旅行社取消 4 被用户取消 5 过期
  var update = {
    status: '2'
  };
  Order.getOrderOneById(order_id, function (err, order) {
    if (order.status == '1') {
      Order.findOneAndUpdate({_id: order_id, _agent: agent_id}, update, function (err, result) {
        if (!result) {
          return res.json({status: 30004, err: "订单不存在或无权修改" });
        }
        res.json({status: 10004, data: result, msg: "订单确认成功。"});
      });
    } else {
      res.json({status: 30004, err: "订单已经确认，不能重复确认。"});
    }
  });
};

exports.getAgentOrderList = function (req, res, next) {
  var page = req.session.page || 1;
  var user_id = req.session.user._id;

  Order.getAgentOrderList(user_id, page, function (err, order_list) {
    return res.json({data: {pagination: order_list}});
  });

};

exports.createOrder = function (req, res, next) {
  var user_id = req.session.user._id;
  var level = req.session.user.level;
  var user_email = req.session.user.email;
  var data = req.nsData;
  var travel_id = data.travel_id;
  var travel_code = data.travel_code;
  var user_name = data.name;
  var user_tel = data.tel;
  var tips = data.tips;
  var child_count = data.child_count;
  var adult_count = data.adult_count;
  var status = '0';
  var amount = data.amount;
  var email_record = '0';
  var user_list = [];
  var index = [];
  for (var i in req.body.data) {
    if (req.body.data[i].name == 'ID') {
      index.push(i);
    }
  }
  for (var i = 0; i < index.length; i++) {
    var j = parseInt(index[i]) + 1;

    var collect = {

      name: req.body.data[j++].value,
      sex: req.body.data[j++].value,
      age_type: req.body.data[j++].value,
      tel: req.body.data[j++].value,
      id: req.body.data[j++].value,
      tips: req.body.data[j++].value
    };
    user_list.push(collect);
  }
  Travel.getTravelAndProductByTravelId(travel_id, function (err, travel) {

    var elses = parseInt(travel.elses);
    var allcount = parseInt(child_count) + parseInt(adult_count);
    if (elses > allcount) {


      travel.elses = elses - parseInt(allcount);
      var obj = {elses: elses - parseInt(allcount)};
      Travel.updateTravelAndUpdateById(travel_id, obj, function (err, travel_update) {
        Channel.getChannelById(travel_update._channel, function (err, channel) {
          Order.newAndSave(channel._user._id, travel_update._product, travel_id, channel._id, user_id, child_count, adult_count, amount, user_name, user_tel, tips, status, email_record, user_list, function (err, order) {
            res.setHeader('Content-Type', "application/json");
            socket.noticeOrderList(channel._user._id);
            if (level == '2') {
              return res.json({status: 10001, data: order, redirect: "/agent/orders"});
            }
            if (level == '3') {
              return res.json({status: 10001, data: order, redirect: "/customer/orders"});
            }

          });
        });

      });

    } else {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 30001, error: true, msg: '添加失败'});
    }
  });

};

exports.getInitOrderInfo = function (req, res, next) {
  var travel_id = req.query.travel_id;
  Travel.getTravelAndProductByTravelId(travel_id, function (err, docs) {
    res.json({status: 10003, success: true, data: docs});
  });
}
exports.getDashboardInfo = function (req, res, next) {
  var user_id = req.session.user._id;
  var channel_id = req.query.channel_id;
  var channel_page = req.query.cpage || 1;
  var level = req.session.user.level;
  var page = req.query.page || 1;

  var addr = req.query.addr;

//  var events = ['travel_list', 'channel_list', 'address_list', 'channel', 'product', 'agent_user'];
//
//  var ep = EventProxy.create(events, function (travel_list, channel_list, address_list, channel, product, agent_user) {
//
//    return res.json({status: 10002, data: {
//      user_id: user_id,
//      level: level,
//      travel_list: travel_list,
//      channel_list: channel_list,
//      address_list: address_list,
//      channel: channel,
//      product: product,
//      page: 1,
//      agent_user: agent_user
//    }});
//  });
  var events = [ 'channel_list', 'channel', 'travel_list', 'addr_list'];

  var ep = EventProxy.create(events, function (channel_list, channel, travel_list, addr_list) {

    return res.json({status: 10002, data: {
      user_id: user_id,
      level: level,
      travel_list: travel_list,
      channel_list: channel_list,
      addr_list: addr_list,
      channel: channel,
//      product: product,
      page: 1
//      agent_user: agent_user
    }});
  });
  Channel.getChannelAllList(channel_page, ep.done("channel_list"));
  Channel.getChannelById(channel_id, function (err, channel) {
    if (!channel || !channel._id) {
      Channel.getTopChannelById(function (err, channel) {
        if (err) {
          console.log("主页 err  " + err);
          return;
        }
        if (!channel) {
          ep.emit("channel", []);
          ep.emit("travel_list", []);
          ep.emit("addr_list", []);
          return;
        }
        ep.emit("channel", channel);
        Travel.getTravelListByChannel(page, channel._id, addr, function (err, travel_list) {
          ep.emit("travel_list", travel_list);
        });
        Product.getProductAddrByChannel(channel._id, function (err, addr_list) {
          ep.emit("addr_list", addr_list);
        });
      });
      return;
    }
    ep.emit("channel", channel);
    Travel.getTravelListByChannel(page, channel._id, addr, function (err, travel_list) {
      ep.emit("travel_list", travel_list);
    });
    Product.getProductAddrByChannel(channel._id, function (err, addr_list) {
      ep.emit("addr_list", addr_list);
    });
  });

};

//var config = require('config');
exports.getChannelById = function (req, res, next) {
  var channel_id = req.query.channel_id;
  Channel.getChannelById(channel_id, function (err, docs) {
    if (error.out(err, req)) {
      return next();
    }

    return res.json({status: 10002, data: docs});
  })
};


exports.getUserById = function (req, res, next) {
  var user_id = req.query.user_id;
  User.getUserById(user_id, function (err, docs) {
    if (error.out(err, req)) {
      return next();
    }

    return res.json({status: 10002, data: docs});
  });
};

exports.indexNews = function(req, res, next) {
  var newsId = req.query.nid;

  News.getNewsDetail(newsId,function (err, news) {

    if (err) {

    }
    console.log(news);
    res.render('website/newsAppleStyle', {
      layout: false ,
      news : news[0]
    });
  });

};

exports.index = function (req, res, next) {

  var events = ['new_list', 'channel_list'];
  var ep = EventProxy.create(events, function (new_list, channel_list) {
    res.render('website/indexAppleStyle', {
      new_list: new_list,
      channel_list: channel_list,
      image_news_list: [],
      layout: false
    });
    return;
  });
  ep.fail(next);

  News.getNewsList(1,function (err, news) {

    if (err) {
      return  ep.emit('new_list', []);
    }

    ep.emit('new_list', news.results);
  });

  Channel.getFrontAllList("all",function (err, channels) {

    if (err) {
      return  ep.emit('channel_list', []);
    }
    ep.emit('channel_list', channels);
  });
}

exports.logout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/index');
}
/**
 * 用户用户登陆系统
 * @param req
 * @param res
 * @param next
 */

exports.login = function (req, res, next) {
  var loginname = req.body.loginname;
  var pass = req.body.pass;
  if (!loginname || !pass) {
    res.setHeader('Content-Type', "application/json");
    res.json({status: 300, success: false, msg: "信息不完整。"});
    return;
  }
  User.getUserByLoginName(loginname, function (err, user) {
    if (err) {

      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, success: false, msg: "系统错误,请联系管理员"});
      return;
    }
    if (!user) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, success: false, msg: "这个用户不存在。"});
      return;
    }

    pass = md5(pass);
    if (pass !== user.pass) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, success: false, msg: "密码错误。"});
      return;
    }
    if (!user.is_active || user.is_active == '0') {
      // 从新发送激活邮件
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, success: false, msg: "此帐号还没有被激活，请联系管理员！"});
      return;

    }

    // store session cookie
    gen_session(user, res, req);
//    res'current_user', user);

    if (user) {
      res.setHeader('Content-Type', "application/json");
      var level = '';
      if (config.admins[user.loginname]) {
        console.log("  is  admin   " + user.name);
        level = '1';
      } else {
        console.log("  is  user   " + user.name);
        level = user.level;
      }
      res.json({status: 200, success: "登陆成功", msg: "登录成功", level: level});
      return;
    }

    return;


  });
};

// auth_user middleware
exports.auth_user = function (req, res, next) {
  if (req.session.user) {
    if (config.admins[req.session.user.loginname]) {
      req.session.user.is_admin = true;
    }
    res.locals('current_user', req.session.user);
    return next();
  } else {
    var cookie = req.cookies[config.auth_cookie_name];
    if (!cookie) {
      return next();
    }
    var auth_token = decrypt(cookie, config.session_secret);
    var auth = auth_token.split('\t');
    var user_id = auth[0];
    User.getUserById(user_id, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        if (config.admins[user.name]) {
          user.is_admin = true;
        }
        req.session.user = user;
        res.locals('current_user', req.session.user);
        return next();
      } else {
        return next();
      }
    });
  }
};

exports.travel_delete = function (req, res, next) {
  var id = req.query.id;
  Travel.remove(id, function (err, docs) {
    res.render('qcheng/travel/travel_list', {layout: 'layout/agent', pageNum: 1 });
  })

}

exports.travel_index = function (req, res, next) {
  var pageNum=req.query.page || 1;

  res.render('qcheng/travel/travel_list', {layout: 'layout/agent', pageNum: pageNum });
}

exports.travel_list = function (req, res, next) {
  var page = req.query.page || 1;
  var user = req.session.user;
  Travel.getAllTravel(page,user, function (err, docs) {
    if (err) {
      return next(err);
    }

    res.json({data: {pagination: docs}});
  });

}
exports.travelMonthIntro = function (req, res, next) {
  var product_id = req.session.product_id;
  var travel_date = req.session.traveldate;
  console.log("product_id : " + product_id + "travel_date : " + travel_date);
  createMonthDay(travel_date);
  var Calendar_list = Util.getMounthDay(travel_date);
  Travel.getTravelDaylineByDate(product_id, Calendar_list, function (err, timeline_list) {
    res.json({msg: "product_id : " + product_id + "travel_date : " + travel_date, calendar_list: timeline_list});
  });

}

function createMonthDay(date) {

}

exports.travel_intro = function (req, res, next) {
  var id = req.query.id;
  Travel.getTravelById(id, function (err, docs) {
    req.session.traveldate = docs.traveldate;
    req.session.product_id = docs._product._id;
    createDate(docs, function (err, day_line) {
      Travel.getTravelDaylineByDate(docs._product._id, day_line, function (err, timeline_list) {
        console.log("+++++++++++++++++++");
        console.log(docs);
        res.render('qcheng/travel/travel_intro', {layout: req._layout, travel: docs, ttotal: docs._product.total, day_line: timeline_list});
      });

    });

  });
};
function createDate(travel, callback) {
  var nowdata = travel.traveldate;
  var day_line = [];
  var _fnStringToDate = function (str) {
    str = str.replace(/-/g, "/");
    var _date = new Date(str);
    return _date
  };

  for (var i = 0; i < 7; i++) {
    day_line.push(Util.format_date_line(new Date(_fnStringToDate(nowdata).getTime() + ((i - 3) * (24 * 3600 * 1000))), false));
  }
  callback(null, day_line);
}


exports.printfOrder = function (req, res, next) {
  var order_id = req.query.order_id;

  var events = ['order', 'travelInfo'];
  var ep = EventProxy.create(events, function (order, travelInfo) {
    res.render('qcheng/order/order_printf', {
      order: order,
      travelInfo: travelInfo,
      layout: false
    });

  });
  ep.fail(next);

  Order.getOrderOneById(order_id, function (err, order) {
    ep.emit('order', order);
    Travel.getTravelById(order._travel, ep.done('travelInfo'));
  });

}

exports.printfTravel = function (req, res, next) {
  var id = req.query.id;
  Travel.getTravelById(id, function (err, docs) {
    res.render('qcheng/travel/travel_printf', {layout: false, travel: docs });
  });
}

// private
function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

// private
function gen_session(user, res, req) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });

  var auth_token = encrypt(user._id + '\t' + user.name + '\t' + user.pass + '\t' + user.email, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天

}

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}