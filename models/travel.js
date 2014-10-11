var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var TravelSchema = new Schema({
  _product: {type: String, ref: 'Product'},
  _channel: {type: String, ref: 'Channel'},
  travel_code: {type: String},     //团号
  postdate: {type: Date, default: Date.now},       //发布旅游路线
  traveldate: {type: String},       //开始时间
  adult_resultprices: {type: String},     //成人实际价格
  child_resultprices: {type: String},      //儿童参考价格
  finish_time: {type: String},         //返程时间
  pickup_time: {type: String},         //出发时间
  total: {type: String},           //总票数
  elses: {type: String},           //剩余票数
  valid: {type: Number ,default:1}
});

mongoose.model('Travel', TravelSchema);
