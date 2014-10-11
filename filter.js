var models = require('./models');
var User = models.User;


//定义的过滤器
var filterArr = ["filterParam", "filterTest1"];
// 允许通过过滤器的url
var urlArr = ["/", "/login", "/admin", "/admin/channels"];


var setting = {
  "filterParam": filterParam,
  "filterTest1": filterTest1
}


function filterParam(req, res, next) {
  console.log("this is filterParam");
  var body = req.body;
  var param = {};
  var collection = new User();
  for (var i in body) {
    console.log('req body is  %s', i);
    collection[i] = body[i];
    console.log('req body is  %s', body[i]);
  }
  req.myname = collection;

}

function filterTest1(req, res, next) {
  var body = req.myname;
  console.log("this is  filterTest1");
  console.log(body);
}


function filter(req, res, next) {
  if (isFilter(req, urlArr)) {
    console.log("this is filertchain");
    filterArr.forEach(function (i) {
      console.log(i);
      setting[i](req, res, next);
    });
  }
  next();
}
//遍历所有的url
function isFilter(req, urlArr) {
  var bol = false;
  var url = urlArr;
  url.forEach(function (i) {
    if (req.url == i.toString()) {
      bol = true;
    }
  });

  return bol;
}

function filterChain(req, res, next) {

}

exports.filterChain = filter;
