var models = require('../models');
var listCfg = require('config').list
var News = models.News;
var render = require("../core/render");


exports.newAndSave = function (title, content, author_id, type, image, newstype, callback) {
  var news = new News();
  news.title = title;
  news.content = content;
  news._user = author_id;
  news.type = type;
  news.image = image;
  news.newstype = newstype;
  news.save(callback);
};

exports.getNewsDetail = function(id,callback){
  var query = News.findById(id).populate("_user", 'name company');
  query.execFind(function(err,docs){
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, {});
    }

    return callback(null, docs);
  });
};

exports.getNewsList = function (page, callback) {
  var query = News.find().populate("_user", 'name company');
  var options = {
    perPage: listCfg.pageSize,
    page: page
  };
  query.paginate(options, function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (!docs) {
      return callback(null, []);
    }
    if (docs.length === 0) {
      return callback(null, [])
    }
    render.render_updatedate(docs);
    return callback(null, docs);
  });
}