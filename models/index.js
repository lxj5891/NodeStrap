var mongoose = require('mongoose');
var util = require('util');

var dbconf = process.env['TEST'] ? require('config').testdb : require('config').store;

mongoose.connect(
  util.format('mongodb://%s:%d/%s', dbconf.host, dbconf.port, dbconf.dbname),
  {server: {poolSize: dbconf.poolSize}},
  function (err) {
  if (err) {
    console.error('connect to %s error: %s', dbconf, err.message);
    process.exit(1);
  }
});

//插件
require('mongoose-query-paginate');
// models
require('./user');
require('./news');
require('./channel');
require('./paper');
require('./product');
require('./travel');
require('./order');

exports.User = mongoose.model('User');
exports.Channel = mongoose.model('Channel');
exports.News = mongoose.model('News');
exports.Paper = mongoose.model('Paper');
exports.Product = mongoose.model('Product');
exports.Travel = mongoose.model("Travel");
exports.Order = mongoose.model("Order");
