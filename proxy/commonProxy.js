var EventProxy = require('eventproxy');
var models = require('../models');
var Product = models.Product;
var Channel = models.Channel;
var User = models.User;
var Travel = models.Travel;
var listCfg = require('config').list


exports.newAndSave = function (saveInfo, modal, callback) {
  var obj = initObj(modal);
  for (var i in saveInfo) {
    obj[i] = saveInfo[i];
  }
  obj.save(callback);
}


function initObj(obj) {
  switch (obj) {
    case "Channel":
      return  new Channel();
      break;

    case "User":
      return  new User();
      break;
    case "Product":
      return  new Product();
      break;
    case "Travel":
      return    new Travel();
    break;
  }
  return null
}

