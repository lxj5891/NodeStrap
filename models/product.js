var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var ProductSchema = new Schema({
  _channel: {type: ObjectId, ref:"Channel",index: true },
  days: {type: String },          //天数
  destination: {type: String },
  child_price: {type: String},   //儿童参考价格
  adult_price: {type: String},   //成人参考价格
  routename: {type: String},      //线路名称
  status: {type: String},
  elses: {type: String},      //剩余票数
  sort: {type: String}, 	//排序
  istop: {type: String},  //   1 指定  2 首页图片显示
  go_type: {type: String},        //去程交通
  back_type: {type: String},      //返程交通

  address: [String],              //接送地址
  startAddress: {type: String},   //出发地址
  endAddress: {type: String},      //返程地址
  user_id: {type: ObjectId, index: true},			//agent的id
  staff: {type: String},	// 接送人员
  introduce: {type: String},	//产品说明
  trip: [String],		           //行程
  include: {type: String},     // 包含项目
  not_include: {type: String},   //不包含项目
  child_plan: {type: String},	//儿童安排
  shopping: {type: String},	// 购物安排
  expensive: {type: String},     //自费项目
  gift: {type: String},	//赠送项目
  notice: {type: String},	//注意事项
  warns: {type: String}	,		//温馨提示
  valid: {type: Number, default: 1 } //无效化
});

mongoose.model('Product', ProductSchema);
