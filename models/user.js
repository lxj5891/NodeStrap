var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var UserSchema = new Schema({
  name: { type: String, index: true },
  loginname: { type: String, unique: true },
  pass: { type: String },
  email: { type: String, unique: true },
  url: { type: String },
  profile_image_url: {type: String},
  location: { type: String },
  signature: { type: String },
  profile: { type: String },
  weibo: { type: String },
  avatar: { type: String },
  province: { type: String},
  city: { type: String},
  area: { type: String},
  company: { type: String},
  address: { type: String},
  tel: {type: String},
  qq: {type: String},
  des: {type: String},
  score: { type: Number, default: 0 },
  topic_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  follower_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },
  travel_count: { type: Number, default: 0 },
  collect_tag_count: { type: Number, default: 0 },
  collect_topic_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  is_admin: { type: Boolean },
  sign: {type: String},
  level: { type: String },
  is_active: { type: Number},

  receive_reply_mail: {type: Boolean, default: false },
  receive_at_mail: { type: Boolean, default: false },
  from_wp: { type: Boolean },

  retrieve_time: {type: Number},
  retrieve_key: {type: String}
});

mongoose.model('User', UserSchema);
