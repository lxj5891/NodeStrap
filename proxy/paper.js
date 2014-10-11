var EventProxy = require('eventproxy');


var models = require('../models');
var Paper = models.Paper;
var User = require('./user');


/**
 *
 * @param callback
 */
exports.getTopPaper = function (callback) {
  var query = Paper.find({ }, null, {}) ;
  query.exec(function (err, docs) {
    return callback(null, docs);
  });
};

exports.getNewsTotal = function (query, callback) {
  Paper.count({ }, callback);
};

exports.getNewsById = function (id, callback) {


  var proxy = new EventProxy();
  var events = ['author', 'news'];
  proxy.assign(events,function (author, news) {
    return callback(null, news, author);
  }).fail(callback);


  Paper.findOne({_id: id}, function (err, paper) {
    if (err) {
      return callback(err);
    }
    if (!paper) {
      proxy.emit('news', null);
      proxy.emit('author', null);
      return;
    }

    User.getUserById(paper.author_id, proxy.done('author'));

    proxy.emit('news', paper);
    //TODO  :  添加新闻关联的作者
  });


};


exports.getNewsList = function (query, opt, callback) {
  Paper.find(query, ['_id', 'author_id'], opt, function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback(null, []);
    }

    var news_id = [];
    for (var i = 0; i < docs.length; i++) {
      news_id.push(docs[i]);
    }

    var proxy = new EventProxy();
    var news = [];
    proxy.after('news_ready', news_id.length, function () {
      return callback(null, news);
    });
    proxy.fail(callback);

    news_id.forEach(function (id, i) {
      exports.getNewsById(id._id, proxy.done(function (paper, author) {
        var new_obj = {};


        new_obj.title = paper.title;
        new_obj.type = paper.type;
        new_obj.status = paper.status;
        new_obj.postdate = Util.format_date(paper.postdate, true);
        if (!author) {
          proxy.emit('news_ready');
          return;
        }
        new_obj.user_name = author.name;
        news.push(new_obj);
        proxy.emit('news_ready');
      }));
    });
  });
};

exports.getFrontImageNewsList = function (query, opt, callback) {
  var options = { limit: 5, sort : [
    [ 'postdate', 'desc' ]
  ]};
  Paper.find({}, ['_id', 'title', 'image'], options, function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback(null, []);
    }
    return callback(null, docs);
  });
};
exports.getFrontNewsList = function (query, opt, callback) {
  var options = { limit: 5, sort: [
    [ 'postdate', 'desc' ]
  ]};
  var query = {  };
  Paper.find({}, ['_id', 'title'], options, function (err, docs) {

    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback(null, []);
    }
    return callback(null, docs);
  });
};

exports.newAndSave = function (title, content, author_id, type, image, callback) {
  var paper = new Paper();
  paper.title = title;
  paper.content = content;
  paper.author_id = author_id;
  paper.type = type;
  paper.image = image;
  paper.save(callback);
};


