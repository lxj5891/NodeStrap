var util = require("../core/util");
var config = require('../config').config;


exports.render_travel_btn = function (docs) {
    for (var i in docs.results) {
        var obj = docs.results[i];
      if(obj.valid == 1){
        obj._doc.action_btn = "<a class=\"action_hidden btn btn-mini btn-primary\" data=\""+ obj._doc._id + "\" >隐藏</a>";
      }


        docs.results[i] = obj;
    }
}

exports.render_channels_btn = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.action_btn = "<a class=\"action_remove btn btn-mini btn-primary\" data=\""+ obj._doc._id + "\" >删除</a>" +
      "<a class=\"action_top btn btn-mini btn-primary\" data=\""+ obj._doc._id + "\" >置顶</a>"

    docs.results[i] = obj;
  }
}

exports.redner_user_status = function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    var level = parseInt(docs.results[i].level);
    var loginname = parseInt(docs.results[i].loginname);
    if (level == '2') {
      obj._doc.level = "加盟商";
    } else if (level == '3') {
      obj._doc.level = "散客";
    }
    if (config.admins[loginname]) {
      obj._doc.level = "管理员";
    }
    docs.results[i] = obj;
  }
}

exports.redner_order_customer_detaillink = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.detaillink = "<a href='/customer/order/detail?order_id=" + obj._doc._id + "' >订单详细</a>";
    docs.results[i] = obj;
  }
}


exports.redner_order_detaillink = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.detaillink = "<a href='/agent/order/detail?order_id=" + obj._doc._id + "' >订单详细</a>";
    docs.results[i] = obj;
  }
}

exports.render_order_status = function (docs) {
  // 1 等待  2 订单成功 3 被旅行社取消 4 被用户取消 5 过期
  for (var i in docs.results) {
    var obj = docs.results[i];
    var status = parseInt(docs.results[i].status);
    if (status == 1) {
      obj._doc.status = "等待确认";
    } else if (status == 2) {
      obj._doc.status = "订单成功";
    } else if (status == 3) {
      obj._doc.status = "被旅行社取消";
    } else if (status == 4) {
      obj._doc.status = "被用户取消";
    } else if (status == 5) {
      obj._doc.status = "过期";
    }
    docs.results[i] = obj;
  }
}

exports.render_amount = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.amount = parseInt(docs.results[i].amount) + "元";
    docs.results[i] = obj;
  }
};


exports.render_peoplecount = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.peoplecount = "成人数:" + parseInt(docs.results[i].adult_count) + "人 儿童数:" + parseInt(docs.results[i].child_count) + "人";
    docs.results[i] = obj;
  }
};

exports.render_updatedate = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.updatedate = util.format_date(docs.results[i].updatedate, true);
    docs.results[i] = obj;
  }
}

exports.render_startEnd = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.startEnd = docs.results[i].startAddress + " -- " + (docs.results[i].endAddress);
    docs.results[i] = obj;
  }

}

exports.render_travelStartEnd=function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.startEnd = (docs.results[i]._product.startAddress) + " -- " + (docs.results[i]._product.endAddress);
    docs.results[i] = obj;
  }
}

exports.render_adultChild=function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.prices = "成人价"+parseInt(docs.results[i].adult_price) + "元<br/>儿童价" + parseInt(docs.results[i].child_price)+"元";
    docs.results[i] = obj;
  }
}


exports.render_resultAdultChild=function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.prices = "成人价"+parseInt(docs.results[i].adult_resultprices) + "元<br/>儿童价" + parseInt(docs.results[i].child_resultprices)+"元";
    docs.results[i] = obj;
  }
}



exports.render_goBack = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.goBack ="往："+ (docs.results[i].go_type) + "<br/>返：" + (docs.results[i].back_type);
    docs.results[i] = obj;
  }

}
exports.render_travelGoBack = function (docs) {
  for (var i in docs.results) {
    var obj = docs.results[i];
    console.log(obj);
    obj._doc.goBack ="往："+ (docs.results[i]._product.go_type) + "<br/>返：" + (docs.results[i]._product.back_type);
    docs.results[i] = obj;
  }

}

exports.render_days=function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.day = parseInt(docs.results[i].days) + "天";
    docs.results[i] = obj;
  }
}

exports.render_traveldays=function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.day = parseInt(docs.results[i]._product.days) + "天";
    docs.results[i] = obj;
  }
}

exports.render_travelElses=function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    obj._doc.otr = parseInt(docs.results[i].elses) + "人";
    docs.results[i] = obj;

  }
}

exports.render_travelValid = function(docs){
  for (var i in docs.results) {
    var obj = docs.results[i];
    if(obj._doc.valid == 1 ){
      obj._doc.valid = "可用";
    } else {
      obj._doc.valid = "隐藏";
    }

    docs.results[i] = obj;

  }
}