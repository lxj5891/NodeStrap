var fs = require('fs');
var path = require('path');
var utils = require("./core/util.js");
var express = require("express");
var filter = require('./filtertest');
var ndir = require('ndir');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
var config = require('./config').config;
var io = require('socket.io');
var partials = require('express-partials');
var routes = require('./routes');
var socket = require('./socket');
var log = require('./core/log4js');


var confsession = require("config").session;
var confcookie  = require("config").cookie;
var confstore  = require("config").store;
var store       = require("connect-mongo")(express);

// assets
var assets = {};
if (config.mini_assets) {
  try {
    assets = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets.json')));
  } catch (e) {
    console.log('You must execute `make build` before start app when mini_assets is true.');
    throw e;
  }
}

// host: http://127.0.0.1
var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;


config.upload_dir = config.upload_dir || path.join(__dirname, 'public', 'user_data', 'images');
// ensure upload dir exists
ndir.mkdir(config.upload_dir, function (err) {
  if (err) {
    throw err;
  }
});

var app = express();

// configuration in all env
app.configure(function () {
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));



  app.set("port", 4001);

  app.use(express.bodyParser({
    uploadDir: config.upload_dir
  }));
  app.use(express.cookieParser(confcookie.secret));

  /**
   * Middleware
   * 提供基于cookie的session
   */
  app.use(express.session({
    "secret": confsession.secret
    , "key": confsession.key
    , "cookie": {"maxAge": confsession.timeout * 60 * 60 * 1000}
    , "store": new store({"db": confstore.dbname, "host": confstore.host, "port": confstore.port})
  }));
  app.use(express.static(__dirname + "/public"));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(require('./controllers/website').auth_user);
  app.use(partials());
});

var maxAge = 3600000 * 24 * 30;
app.engine("html", require("ejs").__express);
//app.use('/upload/', express.static(config.upload_dir, { maxAge: maxAge }));
// old image url: http://host/user_data/images/xxxx
app.use('/upload/', express.static(config.upload_dir, { maxAge: maxAge }));
app.use('/user_data/', express.static(path.join(__dirname, 'public', 'user_data'), { maxAge: maxAge }));


//app.use(filter.filterChain);

var renderUtilsHelp = function (request, response, next) {
  response.locals.u = utils;
  next();
};

app.use(renderUtilsHelp);
app.use(filter.filterAjaxJson);
routes(app);

if (process.env.NODE_ENV !== 'test') {
  server = require('http').createServer(app);
  io = require('socket.io').listen(server);
  server.listen(config.port);
  console.log("NodeStrap listening on port %d in %s mode", config.port, app.settings.env);
  console.log("God bless love....");
  console.log("You can debug your app with http://" + config.hostname + ':' + config.port);
}


socket.app(io);
module.exports = app;
