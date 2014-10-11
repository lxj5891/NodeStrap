

var querystring = require('querystring');

var url = "https://sendcloud.sohu.com/webapi/mail.send.json";
var api_user = "postmaster@qcheng.sendcloud.org";
var api_key = "4VCWS2W0";

function sendMail(from, fromname, to, subject, html) {
  var https = require('https');
  var qs =require('querystring');
  var url = require('url');


  var params = {
    api_key  : api_key,
    api_user : api_user,
    from     : from,
    fromname : fromname,
    to       : to,
    subject  : subject,
    html     : html
  };

  var content= qs.stringify(params);

  var options={
    host : 'sendcloud.sohu.com',
    port : 443,
    path : '/webapi/mail.send.json',
    method:'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Content-Length':content.length
    }
  };


  var req = https.request(options,function(res){
    var _data = '';
    res.on('data', function(chunk){
      console.log(chunk);
      _data += chunk;
    });

    res.on('end', function(){
      // 处理返回
      process.stdout.write(_data);
    });
  });

  req.write(content);

  req.end();
}

module.exports.sendMail = sendMail;



/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 * @param {String} email 接受人的邮件地址
 */
exports.sendActiveMail = function (who, token, name) {
  var from = config.mail_opts.auth.user;
  var fromname = config.mail_opts.auth.username;
  var to = who;
  var subject = config.name + '社区帐号激活';
  var html = '<p>您好：<p/>' +
    '<p>我们收到您在' + config.name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
    '<a href="' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name + '社区 谨上。</p>';

  sendMail({
    from: from,
    fromname : fromname ,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendResetPassMail = function (who, token, name) {
  var from = config.mail_opts.auth.user;
  var to = who;
  var subject = config.name + '社区密码重置';
  var html = '<p>您好：<p/>' +
    '<p>我们收到您在' + config.name + '社区重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name + '社区 谨上。</p>';

  sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
