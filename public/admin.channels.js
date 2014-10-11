

function event(){
  $(".action_top").unbind("click").bind("click",function(e){
    var _data = $(e.target).attr("data");
    var data = {
      channel_id :_data
    }
    smart.dopost("/api/admin/channel/set_top.json",data,function(err,result){
//      $.datagrid.init();
      $ns.ajaxDone(result);
    });
  });
  $(".action_remove").unbind("click").bind("click",function(e){
    var _data = $(e.target).attr("data");
    var data = {
      channel_id :_data
    }
    smart.dopost("/api/admin/channel/remove.json",data,function(err,result){
      $ns.ajaxDone(result);
    });

  });
};

(function(){

})();