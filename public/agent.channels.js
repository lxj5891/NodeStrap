function travel_render(channel_id) {
  var _channel_id = channel_id || '';
  var url = "/api/dashboard.json";
  if (_channel_id && _channel_id.length > 0) {
    url = url + "?channel_id=" + _channel_id;
  }
  smart.doget(url, function (err, result) {

    var travel_list = result.data.travel_list;
    var channel_list = result.data.channel_list;
    var channel = result.data.channel;
    var result_addr_list = result.data.addr_list;
    var addr_list = [];
    var agent_user = channel._user;


    var channenListUrl = "/api/agent/channel/list.json";
    smart.doget(channenListUrl, function (err, channenResult) {
      var channel_list = channenResult.data.pagination
      $("#area_channel_list").html("");
      for (var i in channel_list.results) {
        $("#area_channel_list").append("<button class=\"btn btn-small btn-primary\" data=\"" + channel_list.results[i]._id + "\">" + channel_list.results[i].title + "</button> ");
      }
      var channel = channenResult.data.pagination.results[0];
      $("#channel_id").val(channel._id);



    if (channel.qq && channel.qq.length > 0) {
      $("#detail1 p").html(" ");
      for (var i in channel.qq) {
        var qq = channel.qq[i];
        $("#detail1 p").append('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + qq.qqno + '&amp;site=qq&amp;menu=yes">' + qq.name + '：<img ' +
          'border="0" src="http://wpa.qq.com/pa?p=2:' + qq.qqno + ':41" alt="点击这里给我发消息" title="点击这里给我发消息"></a>   <i class="icon-trash" onclick="removeQQ(\'' + qq._id + '\')"></i><Br/>');
      }
    } else {
      $("#detail1 p").html("等待加盟商添加。");
    }
    if (channel.tel && channel.tel.length > 0) {
      $("#tel_list").html(" ");
      for (var j in channel.tel) {
        var tel = channel.tel[j];
        $("#tel_list").append(' ' + tel.name + '：<span>' + tel.telno + '</span>');
        if (channel.tel.length != j + 1) {
          $("#tel_list").append('<br/>');
        }
      }

    } else {
      $("#tel_list").html("等待加盟商添加。");
    }

    if (channel.account && channel.account.length > 0) {
      $("#account_list").html(" ");
      for (var k in channel.account) {
        var account = channel.account[k];
        $("#account_list").append(' ' + account.name + ':' + account.accno + '  <i class="icon-trash" onclick="removeAccount(\'' + account._id + '\')"></i><br/>');
      }
    } else {
      $("#account_list").html("等待加盟商添加。");
    }

    $("#user_des").html(agent_user.des);
    $("#user_company").html(agent_user.company);
    $("#addr_list").html("");




    travel_event(channel._id);
    });
  });

};
function travel_event(_id) {
  $("#channel_qq_id").val(_id);
  $("#channel_tel_id").val(_id);
  $("#channel_account_id").val(_id);
  $("#detail_qq").click(function (e) {
    $("#modal_set_qq").modal("show");
  });
  $("#detail_tel").click(function (e) {
    $("#modal_set_tel").modal("show");
  });
  $("#detail_account").click(function (e) {
    $("#modal_set_account").modal("show");
  });
  $("#channel_qq_id").val(_id);
  $("#channel_tel_id").val(_id);
  $("#channel_account_id").val(_id);
  $("#area_channel_list button").unbind("click").bind("click", function (e) {
    var _id = $(e.target).attr("data");

    travel_render(_id);
  });

}
(function () {
  var page = 1;

  function init() {

  }

  function event() {


  }

  travel_render();

  var user_id = $("input[name=user_id]").val();
  smart.doget("/api/user/find.json?user_id=" + user_id, function (err, result) {
    if (result.status != 10002) {
      return;
    }

    $("#detail2").html("<p>" +
      "邮箱：<span>" + result.data.email + "</span><br/>" +
      "电话：<span>" + result.data.tel + "</span>" +
      "</p>");
    $("#user_des").html(result.data.des);

    $("#user_company").html(result.data.company);
  });


})();

function addTel() {
  var tel_name = $("#tel_name").val();
  var tel_no = $("#tel_no").val();
  var channel_id = $("#channel_id").val();
  var data = {
    tel_name: tel_name,
    tel_no: tel_no,
    channel_id: channel_id
  };
  $.ajax({
    url: '/agent/channel/tel/add.json',
    type: "POST",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (result) {
      travel_render(channel_id);
      $("#modal_set_tel").modal("hide");
    }, error: function (err) {
    }
  });
}

function addAccount() {
  var account_name =  $("#account_name").val();
  var account_no =    $("#account_no").val();
  var channel_id =    $("#channel_id").val();
  var data = {
    account_name: account_name,
    account_no: account_no,
    channel_id: channel_id
  };
  $.ajax({
    url: '/agent/channel/account/add.json',
    type: "POST",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (result) {
      $("#account_name").val('');
      $("#account_no").val('');
      travel_render(channel_id);
      $("#modal_set_account").modal("hide");
    }, error: function (err) {
    }
  });

}

function addQQ() {
  var qq_name = $("#qq_name").val();
  var qq_no = $("#qq_no").val();
  var channel_id = $("#channel_id").val();
  var data = {
    qq_name: qq_name,
    qq_no: qq_no,
    channel_id: channel_id
  };
  $.ajax({
    url: '/agent/channel/qq/add.json',
    type: "POST",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (result) {
      $("#qq_name").val('');
      $("#qq_no").val('');
      travel_render(channel_id);
      $("#modal_set_qq").modal("hide");
    }, error: function (err) {
    }
  });
}


function removeAccount(_id){
  var channel_id = $("#channel_id").val();
  var data = {
    account_id: _id,
    channel_id: channel_id
  };
  $.ajax({
    url: '/agent/channel/account/remove.json',
    type: "POST",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (result) {
      travel_render(channel_id);
    }, error: function (err) {
    }
  });
};

function removeTel(_id){
  var channel_id = $("#channel_id").val();
  var data = {
    tel_id: _id,
    channel_id: channel_id
  };
  $.ajax({
    url: '/agent/channel/tel/remove.json',
    type: "POST",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (result) {
      travel_render(channel_id);
    }, error: function (err) {
    }
  });
};

function removeQQ(_id){
  var channel_id = $("#channel_id").val();
  var data = {
    qq_id: _id,
    channel_id: channel_id
  };
  $.ajax({
    url: '/agent/channel/qq/remove.json',
    type: "POST",
    async: false,
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: function (result) {
      travel_render(channel_id);
    }, error: function (err) {
    }
  });
};