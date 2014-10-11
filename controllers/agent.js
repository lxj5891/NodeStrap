var User = require('../proxy').User;
var Channel = require('../proxy').Channel;
var News = require('../proxy').News;
var CommonProxy = require('../proxy').CommonProxy;
var Product = require('../proxy').Product;
var error = require('../core/error');
var Order = require('../proxy').Order;
var Travel = require('../proxy').Travel;

exports.agentTravelSetHidden = function(req,res,next){

  var travel_id = req.body.travel_id;
  Travel.updateTravelAndUpdateById(travel_id,{valid:0},function(err,travel){
    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 40001, success: false, msg: '修改失败请联系管理员解决吧', error: err});
      return;
    }
    res.setHeader('Content-Type', "application/json");
    return res.json({status: 10001, data: travel, redirect: "/agent/travel/list"});

  });

};
exports.getOrderNoticeList = function (req, res, next) {
  var page = req.session.page || 1;
  var user_id = req.session.user._id;

  Order.getAgentOrderList(user_id, page, function (err, order_list) {
    return res.json({data: {pagination: order_list}});
  });

};

exports.index = function (req, res, next) {
  var user = req.session.user;
  var page = req.query.page || 1;
  var addr = req.query.addr || '';
  var channel_id = req.query.channel_id || '';
  res.render("qcheng/agent_index", {
    current_user: user,
    pageNum: page,
    channel_id :channel_id,
    addr : addr,
    layout: req._layout,
    url:"/agent"
  });
}

exports.products = function (req, res, next) {
  var page = req.query.page || 1;
  res.render("qcheng/product/product_list", {
    pageNum: page,
    layout: req._layout
  });
}


exports.travels = function (req, res, next) {
  var page = req.query.page || 1;
  res.render("qcheng/product/travel_list", {
    pageNum: page,
    layout: 'layout/agent'
  });
}

exports.product_add = function (req, res, next) {
  var user = req.session.user;
  Channel.getFrontAllList(user,function (err, docs) {
    res.render("qcheng/product/product_add", {
      channel_list: docs,
      layout: req._layout
    });

  });
}

exports.product_Update=function(req,res,next){
  var nsData = req.nsData;
  console.log("123131231312")
  console.log(nsData._id);
  Product.getProductById(nsData._id,function(err,docs){
        console.log(docs);
    for(var i in nsData){
      docs[i]=  nsData[i];
    }
         docs.save();
    return res.json({status: 10001, redirect: "/agent/products"})
  })
//  Product.findByIdAndUpdate(nsData.id,nsData ,function(err){
//    if(err){
//      console.info(err);
//    }
//    return res.json({status: 10001, redirect: "/agent/products"});
//  });
}

exports.productAdd = function (req, res, next) {
  var nsData = req.nsData;

  CommonProxy.newAndSave(nsData, "Product", function (err, docs) {
    if (error.out(err, req)) {
      return next();
    }
    return res.json({status: 10001, data: docs, redirect: "/agent/products"});
  });
}

exports.getProductList = function (req, res, next) {
  var page = req.query.page || 1;
  var user = req.session.user ;
  Product.getListPaginate(page,user, function (err, list) {
    res.json({data: {pagination: list}});

  })
}


exports.orders = function (req, res, next) {
  var page = req.query.page || 1;
  res.render("qcheng/order/agent_order_list", {
    pageNum: page,
    layout: req._layout
  });
}

exports.order_add = function (req, res, next) {
  res.render("qcheng/order/order_add", {
    layout: req._layout
  });
}

exports.addTravel = function (req, res, next) {
  var id = req.query.id;
  Product.getInfoById(id, function (err, docs) {
    res.render('qcheng/travel/travel_add', {
      product_id: id,
      days: docs.days,
      channel_id: docs._channel,
      layout: "layout/agent"
    });
  });
}

exports.travelAdd = function (req, res, next) {
  var nsData = req.nsData;
  console.log();
  nsData.elses = nsData.total;
  nsData.travel_code = req.session.travel_code;
  var userId = req.session.user._id;
  var user_travel_count = req.session.user.travel_count;
  console.log("user_travel_count  : " +user_travel_count);
  CommonProxy.newAndSave(nsData, "Travel", function (err, docs) {
    if (error.out(err, req)) {
      return next();
    }
    User.updateTravelCountAddOneByUId(userId,user_travel_count,function(err,result){
      return res.json({status: 10001, data: docs, redirect: "/agent/travel/list"});
    })

  });
}


exports.intro = function (req, res, next) {
  var id = req.query.id;
  Product.getProductById(id, function (err, product) {

    res.render('qcheng/product/product_intro', {
      product: product,
      layout: "layout/agent"
    });
  });
}

exports.productDelete = function (req, res, next) {
  var id = req.query.id;


  Product.remove(id, function (err) {
    res.render('qcheng/product/product_list', {
      pageNum: 1,
      layout: "layout/agent"
    });
  })
}


exports.productUpdate  =function(req,res,next){
  var id = req.query.id;
  var user = req.session.user;

  Channel.getFrontAllList(user,function (err, docs) {
      Product.getProductById(id,function(err,product){
         res.render("qcheng/product/product_update", {
           channel_list: docs,
            product:product,
           layout: req._layout
    });
  })
})
}
exports.channels = function (req, res, next) {
  var page = req.query.page || 1;
  var user = req.session.user;
  res.render("qcheng/channel/agent_channel_list", {
    current_user: user,
    pageNum: page,
    layout: 'layout/agent'
  });
}

exports.getAgentChannelList = function (req, res, next) {
  var page = req.query.page || 1;
  var user = req.session.user;
  Channel.getChannelAllListByUser(page, user, function (err, channel_list) {
    res.json({data: {pagination: channel_list}});
  });

}


var _fnStringToDate = function (str) {
  str = str.toString()
  str = str.replace(/-/g, "/");
  var _date = new Date(str);
  return _date
};


exports.createTravelCodeByTime = function (req, res, next) {
  if (!req.session.user) {
    res.setHeader('Content-Type', "application/json");
    res.json({status: 300, success: false, msg: 'no login '});
    return;
  }

  var user_id = req.session.user._id;
  var traveldate = req.body.traveldate;
  var date = _fnStringToDate(traveldate);
  User.getUserById(user_id, function (err, author) {
    var travel_code = format_code_day(author.sign, author.travel_count, date);
    res.setHeader('Content-Type', "application/json");
    req.session.travel_code = travel_code;
    res.json({status: 200, success: true, msg: 'good', data: travel_code});
    return;
  });
};


exports.addChannelAccount = function (req, res, next) {
  var user_id = req.session.user._id;
  var channel_id = req.body.channel_id;
  var name = req.body.account_name;
  var accno = req.body.account_no;
  var object = {
    $push: {"account": {"name": name, "accno": accno}}, updatedate: new Date(), _user: user_id
  }
  Channel.getChannelByIdAndUpdate(channel_id, object, function (err, docs) {

    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 30001, success: false, msg: '系统错误'});
      return;
    }
    res.setHeader('Content-Type', "application/json");
    res.json({status: 10002, success: true, msg: '添加成功', data: docs});
    return;
  });
};

exports.removeChannelAccount = function (req, res, next) {
  var user_id = req.session.user._id;
  var channel_id = req.body.channel_id;
  var account_id = req.body.account_id;
  var object = {
    $pull: {"account": {_id: account_id}}, updatedate: new Date(), _user: user_id
  }
  Channel.getChannelByIdAndUpdate(channel_id, object, function (err, docs) {

    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 30001, success: false, msg: '系统错误'});
      return;
    }
    res.setHeader('Content-Type', "application/json");
    res.json({status: 10002, success: true, msg: '添加成功', data: docs});
    return;
  });
};




exports.addChannelQQ = function (req, res, next) {
  var user_id = req.session.user._id;
  var channel_id = req.body.channel_id;
  var cname = req.body.qq_name;
  var qqno = req.body.qq_no;

  var object = {
    $push: {"qq": {"name": cname, "qqno": qqno}}, updatedate: new Date(), _user: user_id
  }
  console.log(object);
  Channel.getChannelByIdAndUpdate(channel_id, object, function (err, docs) {

    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 30001, success: false, msg: '系统错误'});
      return;
    }
    console.log(err);
    console.log(docs);
    res.setHeader('Content-Type', "application/json");
    res.json({status: 10002, success: true, msg: '添加成功', data: docs});
    return;
  });
};


exports.removeChannelQQ = function (req, res, next) {
  var user_id = req.session.user._id;
  var channel_id = req.body.channel_id;
  var qq_id = req.body.qq_id;

  var object = {
    $pull: {"qq": {_id: qq_id}}, updatedate: new Date(), _user: user_id
  }
  console.log(object);
  Channel.getChannelByIdAndUpdate(channel_id, object, function (err, docs) {

    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 30001, success: false, msg: '系统错误'});
      return;
    }
    console.log(err);
    console.log(docs);
    res.setHeader('Content-Type', "application/json");
    res.json({status: 10002, success: true, msg: '添加成功', data: docs});
    return;
  });
};

exports.addChannelTel = function (req, res, next) {
  var user_id = req.session.user._id;
  var data = req.nsData;
  var channel_id = req.body.channel_id;
  var name = req.body.tel_name;
  var ctel = req.body.tel_no;
  var object = {
    $push: {"tel": {"name": name, "telno": ctel}}, updatedate: new Date(), _user: user_id
  }
  Channel.getChannelByIdAndUpdate(channel_id, object, function (err, docs) {

    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 30001, success: false, msg: '系统错误'});
      return;
    }
    res.setHeader('Content-Type', "application/json");
    res.json({status: 10002, success: true, msg: '添加成功'});
    return;
  });
};


exports.removeChannelTel = function (req, res, next) {
  var user_id = req.session.user._id;
  var data = req.nsData;
  var channel_id = req.body.channel_id;
  var tel_id = req.body.tel_id;
  var object = {
    $pull: {"tel": {"_id": tel_id }}, updatedate: new Date(), _user: user_id
  }
  Channel.getChannelByIdAndUpdate(channel_id, object, function (err, docs) {

    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 30001, success: false, msg: '系统错误'});
      return;
    }
    res.setHeader('Content-Type', "application/json");
    res.json({status: 10002, success: true, msg: '添加成功'});
    return;
  });
};

function format_code_day(sign, spare, day) {
  var now = day;
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  month = ((month < 10) ? '0' : '') + month;
  day = ((day < 10) ? '0' : '') + day;
  var i = Number(spare);
  i = i + 101;
  return sign + year + month + day + i;
};