/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-10-11
 * Time: 下午4:36
 * To change this template use File | Settings | File Templates.
 */
var SendCloud = require("../core/SendCloud");

//(from, fromname, to, subject, html)
exports.testSend = function(req,res,next){

  SendCloud.sendMail("lihao@ycombo.com","lihao","7923495@qq.com;278305898@qq.com;","发给西哥的","发给西哥的  邮件服务器 哈哈哈哈哈");
  res.json({A:1});

}

