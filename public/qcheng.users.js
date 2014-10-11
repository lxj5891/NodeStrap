

(function () {
  function render(){
    var user_id = $("#user_id").val();
    $("#user_pass").hide();
    smart.doget("/api/admin/user/find.json?user_id="+user_id,function(err,result){

      for(var i in result.data){
        $("#"+i).val(result.data[i]);
      }

      $("#company_sign").val(result.data.sign);
      new PCAS("province", "city", "area",result.data.province,result.data.city,result.data.area);
      $("input[name=level]").each(function(i,e){
        if(result.data.level == $(e).val()){
          $(e).attr("checked",true);
        }
      });

      $("input[name=is_active]").each(function(i,e){
        if(result.data.is_active == $(e).val()){
          $(e).attr("checked",true);
        }
      });
      var is_admin=$('#role').val();
          if(is_admin=="false"){
        //    $('#admin').html('');
            $('#admin').css('visibility','hidden');
          }

    });
  };
  render();


})();