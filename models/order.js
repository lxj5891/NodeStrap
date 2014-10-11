var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var OrderSchema = new Schema({
  _product : {type: ObjectId,ref:"Product", index: true},
  _channel: {type: ObjectId,ref:"Channel", index: true},
  _travel: {type: ObjectId, ref:"Travel",index: true},
  travel_code: {type: ObjectId, index: true},
  _user: {type: ObjectId, index: true},
  _agent: {type: ObjectId, index: true},
  child_count: {type: Number},
  adult_count: {type: Number},
  amount: {type: Number},
  user_name: {type: String},
  user_tel: {type: String},
  tips: {type: String},
  status: {type: Number,default:1},	//1  表示用户预定 后台未确认     2表示后台确认统一   3表示后台确认取消
  email_record: {type: String},     //1  表示发出邮件  2表示确认邮件
  reason: {type: String},
  createdate: { type: Date, default: Date.now },
  updatedate: { type: Date, default: Date.now },
  user_list: [
    {
      name: {type: String},
      sex: {type: String},
      age_type: {type: String},
      tel: {type: String},
      id: {type: String},
      tips: {type: String}
    }
  ]
});

mongoose.model('Order', OrderSchema);