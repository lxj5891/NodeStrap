var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var NewsSchema = new Schema({
  title: {type: String },
  content: { type: String },
  postdate: {type: Date, default: Date.now},
  updatedate: {type: Date, default: Date.now},
  _user: { type: ObjectId, ref: 'User', index : true},
  sort: {type: Number, default: 0}, //排序
  istop: {type: String},  //   1 指定  2 首页图片显示
  status: {type: String, default: '0'},
  type: {type: String},  //1 普通   2  图片
  image: {type: String},
  newstype :{type: String}
});

mongoose.model('News', NewsSchema);