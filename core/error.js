/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-9-28
 * Time: 下午8:45
 * To change this template use File | Settings | File Templates.
 */
var _code = undefined;
var _err = undefined;
var dnl = function(err){
  if(err){
    if(err.code == 11000){

      if(err.err.indexOf("channels") > 0 ){
        response.json({status:30001,err:"专线已存在"});
      }


    }

    return true;
  }
};

function error(err, req) {
  if(err){
    if(err.code == 11000){

      if(err.err.indexOf("channels") > 0 ){
        req.err = "专线已存在";
      }


    }

    return true;
  }
  return false;
}
exports.out = error;


function errorNext(req,res){
  if(req.err){
    res.json({status : 30001,err:req.err})
  }
}

exports.done = exports.next = errorNext;