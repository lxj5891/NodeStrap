/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-10-11
 * Time: 下午4:14
 * To change this template use File | Settings | File Templates.
 */


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