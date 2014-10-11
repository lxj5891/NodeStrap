var models = require('./models');
var User = models.User;
var Channel = models.Channel;


//定义的过滤器


function filterAjaxJson(req, res, next) {
  var Json = {};
  var _trip = [];
  var _address = [];
  if (req.url.indexOf("json") > 0) {
    res.setHeader('Content-Type', "application/json");
  }
  //if (req.method == "POST" && req.url.indexOf("add") > 0) {
    if (req.method == "POST" ) {
    var query = req.body.data;
    for (var i in query) {


      var name = query[i].name;
      var value = query[i].value;

      Json[name] = value;
      if (name == "trip") {
        _trip.push(value);
      }
      if (name == "address") {
        _address.push(value);
      }

      if (name == "trip") {
        if (!Json[name] instanceof Array)
          Json[name] = [];
        Json[name] = _trip;
      }
      if (name == "address") {
        if (!Json[name] instanceof Array)
          Json[name] = [];
        Json[name] = _address;
      }
    }
    req.nsData = Json;

  }
  var user = req.session.user;
  if (user && user.level && (user.level == '1' ||user.level == '2' || user.level == '3')) {
    res.locals.current_user = user;
    var level = user.level;
    if (level == '2') {
      req._layout = 'layout/agent';
    } else {
      req._layout = 'layout/customer';
    }
    if (user.is_admin) {
      req._layout = 'layout/admin';
    }
  }

  next();
}


exports.filterAjaxJson = filterAjaxJson;
