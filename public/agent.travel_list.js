function event(){
  $(".action_hidden").unbind("click").bind("click",function(e){
    var _data = $(e.target).attr("data");
    var data = {
      travel_id :_data
    }
    smart.dopost("/api/agent/travel/set_hidden.json",data,function(err,result){
//      $.datagrid.init();
      $ns.ajaxDone(result);
    });
  });
}

(function(){
  event();
})();