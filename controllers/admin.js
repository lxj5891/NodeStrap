var User = require('../proxy').User;
var Channel = require('../proxy').Channel;
var News = require('../proxy').News;

var check = require('validator').check;
var sanitize = require('validator').sanitize;
var crypto = require('crypto');
var error = require('../core/error');
var pinyin = require("pinyin2");

exports.adminChannelRemove = function(req,res,next){
  var channel_id = req.body.channel_id;
  Channel.removeChannelById(channel_id,function(err,result){
    if (err) {
      res.json({status: 40001, success: false, msg: '修改失败请联系管理员解决吧', error: err});
      return;
    }
    return res.json({status: 10001, data: result, redirect: "/admin/channels"});
  });
}

exports.adminChannelSetUpTop = function(req,res,next){

  var channel_id = req.body.channel_id;
  Channel.updateOrderUpTop(channel_id, function (err, channel) {
    if (err) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 40001, success: false, msg: '修改失败请联系管理员解决吧', error: err});
      return;
    }

    res.setHeader('Content-Type', "application/json");
    return res.json({status: 10001, data: channel, redirect: "/admin/channels"});

  });

};

exports.signup = function (req, res, next) {
  var data = req.nsData;
  try {

    var name = sanitize(data.name).trim();
    var loginname = sanitize(data.loginname).trim();
    var pass = sanitize(data.pass).trim();
    var re_pass = sanitize(data.re_pass).trim();
    var email = sanitize(data.email).trim();
    var qq = sanitize(data.qq).trim();
    // var profile_image_url = sanitize(data.profile_image_url).trim();
    var profile_image_url = '';
    var province = sanitize(data.province).trim();
    var city = sanitize(data.city).trim();
    var area = sanitize(data.area).trim();
    var company = sanitize(data.company).trim();
    var address = sanitize(data.address[0]).trim();
    var tel = sanitize(data.tel).trim();
    var qq = sanitize(data.qq).trim();
    var sign = sanitize(data.sign).trim();

    var is_admin = false;
    var des = sanitize(data.des).trim();
    var level = '3';
    name = sanitize(name).xss();
    loginname = sanitize(loginname).xss();
    pass = sanitize(pass).xss();
    re_pass = sanitize(re_pass).xss();
    email = sanitize(email).xss();
    qq = sanitize(qq).xss();
    // profile_image_url = sanitize(profile_image_url).xss();
    province = sanitize(province).xss();
    city = sanitize(city).xss();
    area = sanitize(area).xss();
    company = sanitize(company).xss();
    address = sanitize(address).xss();
    tel = sanitize(tel).xss();
    qq = sanitize(qq).xss();
    sign = sanitize(sign).xss();

    des = sanitize(des).xss();


    if (name === '' || pass === '' || re_pass === '' || email === '') {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, error: '信息不完整。', name: name, email: email});
      return;
    }

    if (name.length < 2) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, error: '用户名至少需要2个字符。', name: name, email: email});
      return;
    }

    try {
      check(loginname, '用户名只能使用0-9，a-z，A-Z。').isAlphanumeric();
    } catch (e) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, error: e.message, name: name, email: email});
      return;
    }

    if (pass !== re_pass) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, error: '两次密码输入不一致。', name: name, email: email});
      return;
    }

    try {
      check(email, '不正确的电子邮箱。').isEmail();
    } catch (e) {
      res.setHeader('Content-Type', "application/json");
      res.json({status: 300, error: e.message, name: name, email: email});
      return;
    }

    User.getUsersByQuery({'$or': [
      {'loginname': loginname},
      {'email': email}
    ]}, function (err, users) {
      if (err) {
        return next(err);
      }
      if (users.length > 0) {
        res.setHeader('Content-Type', "application/json");
        res.json({status: 300, error: '用户名或邮箱已被使用。', name: name, email: email});
        return;
      }

      // md5 the pass
      pass = md5(pass);
      // create gavatar
      var active = '0';

      User.newAndSave(name, loginname, pass, email, qq, profile_image_url, province, city, area, company, address, tel, qq, is_admin, level, des, sign, active, null,function (err, user) {
        if (err) {
          return next(err);
        }

//        amqp.jSocket({type: 'ActiveMail', toName: name, toEmail: email, token: md5(email + config.session_secret), loginname: loginname});
        res.setHeader('Content-Type', "application/json");
        res.json({status: 200, success: '欢迎加入 91启程网 ！等待管理员审核通过吧，'});

        return;
      });

    });

  } catch (e) {
    res.setHeader('Content-Type', "application/json");
    res.json({status: 300, error: '信息不完整请检查。'});
  }
};

exports.generateSign = function (req, res, next) {
  var company_name = req.query.company_name;
  var sign = "";
  if (!company_name || company_name.length == 0) {
    res.json({err: 0});
    return;
  }
  for (var i = 0; i < 2; i++) {

    var sign_frist = pinyin(company_name.substring(i, i + 1), {
      style: pinyin.STYLE_NORMAL, // 设置拼音风格
      heteronym: false
    });
    sign = sign + sign_frist.toString().substring(0, 1);
  }
  sign = sign.toUpperCase();
  res.setHeader('Content-Type', "application/json");
  req.session._sign = sign;
  res.json({sign: sign});
  return;
};

exports.index = function (req, res, next) {

  res.render('qcheng/admin_index', {layout: 'layout/admin', user: 'tobi' });
}


exports.getChannelList = function (req, res) {
  var page = req.query.page || 1;
  Channel.getChannelAllList(page, function (err, channel_list) {
    res.json({data: {pagination: channel_list}});
  });
};

exports.editUser = function (req, res, next) {

  var user_id = req.query.id;
  var user=req.session.user;
  res.render('qcheng/user/user_edit', {
    user_id: user_id,
    isAdmin :user.is_admin,
    layout: "layout/admin"
  });
}

exports.addUser = function (req, res, next) {

  res.render('qcheng/user/user_add', {
    layout: "layout/admin"
  });
}

exports.users = function (req, res, next) {

  var page = req.query.page || 1;

  res.render('qcheng/user/user_list', {
    pageNum: page,
    layout: "layout/admin"
  });
}

exports.getUserList = function (req, res, next) {

  var page = req.query.page || 1;

  User.getUserListPaginate(page, function (err, user_list) {
    res.json({data: {pagination: user_list}});
  })
}


exports.createUser = function (req, res, next) {

  var data = req.nsData;
  console.log(data);
  var name = sanitize(data.name).trim();
  var loginname = sanitize(data.loginname).trim();
  var pass = sanitize(data.pass).trim();
  var email = sanitize(data.email).trim();
  var profile_image_url = '';
  var province = sanitize(data.province).trim();
  var city = sanitize(data.city).trim();
  var area = sanitize(data.area).trim();
  var company = sanitize(data.company).trim();
  var address = sanitize(data.address[0]).trim();
  var tel = sanitize(data.tel).trim();
  var qq = sanitize(data.qq).trim();
  var sign = sanitize(data.sign).trim();
  var level = sanitize(data.level).trim();

  var is_admin = '';
  if (level == '1') {
    is_admin = '1';
  } else {
    is_admin = '0';
  }

  var des = sanitize(data.des).trim();

  name = sanitize(name).xss();
  loginname = sanitize(loginname).xss();
  pass = sanitize(pass).xss();
  email = sanitize(email).xss();
  qq = sanitize(qq).xss();
  province = sanitize(province).xss();
  city = sanitize(city).xss();
  area = sanitize(area).xss();
  company = sanitize(company).xss();
  address = sanitize(address).xss();
  tel = sanitize(tel).xss();
  qq = sanitize(qq).xss();
  sign = sanitize(sign).xss();
  is_admin = sanitize(is_admin).xss();
  des = sanitize(des).xss();
  level = sanitize(level).xss();


  if (is_admin == '1') {
    level = 1;
  }
  var object_id = req.body.object_id;
  if (object_id == -1) {
    object_id = undefined;
    pass = md5(pass);
  } else {
    delete data.pass ;
//    console.log(data.is_active);
    User.findByIdAndUpdate(object_id,data,function(err,user){
   var url= "/"+(req._layout.split("/"))[1];
      return res.json({status:  10001, data: user, msg: "用户修改成功",redirect: url});
    });
    return;
  }
  var is_active = data.is_active;
  User.newAndSave(name, loginname, pass, email, qq, profile_image_url, province, city, area, company, address, tel, qq, is_admin, level, des, sign, is_active, object_id, function (err, user) {

    if (error.out(err, res)) {
      return;
    }
    ;

    return res.json({status: 10001, data: user, redirect: "/admin/users"});
  });
};
<!--channel -->
exports.channels = function (req, res, next) {
  var page = req.query.page || 1;
  res.render('qcheng/channel/channel_list', {
    pageNum: page,
    layout: "layout/admin"
  });

}


exports.addChannel = function (req, res, next) {
  User.getUserListByLevel('2', function (err, User) {
    res.render('qcheng/channel/channel_add', {
      user_list: User,
      layout: "layout/admin"
    });
  });
}

exports.channelAdd = function (req, res, next) {
  var create_id = req.session.user._id;
  var data = req.nsData;
  var user_id = data.user_id;
  var title = data.title;

  if (!user_id || user_id.length < 24) {
    req.err = '请选择用户。';
    return next();
  }

  if (!title || title.length == 0 || title.length > 6) {
    req.err = '请输入 1 到 6位的专线名称。';
    return next();
  }

  Channel.newAndSave(user_id, create_id, title, function (err, docs) {

    if (error.out(err, req)) {
      return next();
    }

    return res.json({status: 10001, data: docs, redirect: "/admin/channels"});
  });

}

function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

exports.delete = function (req, res, next) {
  var id = req.query.id;
  var url = (req.url.split("/"))[2];
  Channel.remove(id, function (err) {
    res.render('qcheng/channel/channel_list', {
      pageNum: 1,
      layout: "layout/admin"
    });

  })
}

//news
exports.createNews = function (req, res, next) {
  var data = req.nsData;
  var title = data.title;
  var content = data.content;
  var author_id = req.session.user._id;
  var sort = data.sort;
  var status = data.status;
  var image = data.image;
  var type = data.type;
  var newstype = data.newstype;

  News.newAndSave(title, content, author_id, type, image, newstype, function (err, docs) {

    if (error.out(err, req)) {
      return next();
    }

    return res.json({status: 10001, data: docs, redirect: "/admin/news"});

  });
};


exports.getNewsList = function (req, res, next) {
  var page = req.query.page || 1;
  News.getNewsList(page, function (err, user_list) {
    res.json({data: {pagination: user_list}});
  });
}

exports.news = function (req, res, next) {
  var page = req.query.page || 1;
  res.render('qcheng/news/news_list', {
    pageNum: page,
    layout: "layout/admin"
  });
}
exports.updatedate = function (req, res, next) {
  var _id = req.params.id;
  News.getNewsDetail(_id, function (err, docs) {

  });
}
exports.addNews = function (req, res, next) {
  res.render('qcheng/news/news_add', {
    layout: "layout/admin"
  });
}

exports.editNews = function (req, res, next) {
  res.render('qcheng/news/news_add', {
    layout: "layout/admin"
  });
}

