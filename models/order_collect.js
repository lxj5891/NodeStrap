var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var OrderCollectSchema = new Schema({
  order_id: { type: ObjectId, index: true },
  create_at: { type: Date },
  update_at: { type: Date, default: Date.now },
  name: {type: String},
  sex: {type: String},
  age_type: {type: String},
  tel: {type: String},
  id: {type: String},
  tips: {type: String}
});

mongoose.model('OrderCollect', OrderCollectSchema);