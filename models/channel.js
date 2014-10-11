var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var ChannelSchema = new Schema({
  title: {type: String, unique: true },
  postdate: {type: Date, default: Date.now},
  updatedate: {type: Date, default: Date.now},
  _user: {type: ObjectId, ref: 'User', index: true},
  sort: {type: Number, default: 0, index: true}, //排序
  qq: [
    {name: {type: String}, qqno: {type: String}}
  ],
  account: [
    {name: {type: String}, accno: {type: String}}
  ],
  tel: [
    {name: {type: String}, telno: {type: String}}
  ],
  createby: {type: ObjectId, ref: 'User', index: true},
  valid: {type: Number, default: 1 } //无效化
});

mongoose.model('Channel', ChannelSchema);
