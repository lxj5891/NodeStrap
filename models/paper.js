var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var PaperSchema = new Schema({
  title: {type: String },
  content: {type: String },
  postdate: {type: Date, default: Date.now},
  updatedate: {type: Date, default: Date.now},
  author_id: { type: ObjectId, index: true },
  sort: {type: Number, default: 0}, //排序
  istop: {type: String},  //   1 指定  2 首页图片显示
  status: {type: String, default: '0'},
  type: {type: String},
  image: {type: String}
});

mongoose.model('Paper', PaperSchema);
