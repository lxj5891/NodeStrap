function travel_status(traveldata) {
  var _fnStringToDate = function (str) {
    str = str.toString()
    str = str.replace(/-/g, "/");
    var _date = new Date(str);
    return _date
  };
  var test = getDis2Day(new Date(), _fnStringToDate(traveldata));
  test = test - 1;
  if (test > 0) {
    return true;
  } else {
    return false;
  }
};

function travel_render(channel_id, addr) {
  var _channel_id = channel_id || '';
  var page = $("#pageNum").val();
  var url = "/api/dashboard.json?page=" + page;
  if (addr && addr.length > 0) {
    url = url + "&addr=" + encodeURIComponent(addr);
  }
  if (_channel_id && _channel_id.length > 0) {
    url = url + "&channel_id=" + _channel_id;
  }
  smart.doget(url, function (err, result) {
    var travel_list = result.data.travel_list;
    var channel_list = result.data.channel_list;
    var channel = result.data.channel;
    $("input[name=channel_id]").val(channel._id)
    var result_addr_list = result.data.addr_list;
    var addr_list = [];
    var agent_user = channel._user;
    $("#tb_travel_list").html("");
    for (var i in  travel_list.results) {
      var _obj = travel_list.results[i];
      $("#tb_travel_list").append(function () {
          var _tpl = "<tr>";
          _tpl = _tpl + "<td>" + _obj.traveldate + "</td>";
          _tpl = _tpl + "<td>" + _obj._product.startAddress + "/" + _obj._product.endAddress + "</td>";
          _tpl = _tpl + "<td><a href='/agent/travel/intro?id=" + _obj._id + "' target='_blank'>" + _obj._product.routename + "</a></td>";
          _tpl = _tpl + "<td>" + _obj._product.days + "天</td>";
          _tpl = _tpl + "<td>";
          _tpl = _tpl + "<strong style=\"color: blue\">成人价</strong>:" + _obj._product.adult_price + "元/人<br/>";
          _tpl = _tpl + "<strong style=\"color: green\">儿童价</strong>:" + _obj._product.child_price + "元/人</td>";
          _tpl = _tpl + "<td>";
          _tpl = _tpl + "<strong style=\"color: blue\">往</strong>:" + _obj._product.go_type + "<br/>";
          _tpl = _tpl + "<strong style=\"color: green\">返</strong>:" + _obj._product.back_type;
          _tpl = _tpl + "</td>";
          var elses = parseInt(_obj.elses);
          if ( elses > 9 ) {
            _tpl = _tpl + "<td> >9人 </td>";
          } else {
            _tpl = _tpl + "<td>" + _obj.elses + "人</td>";
          }

          if (travel_status(_obj.traveldate)) {
            _tpl = _tpl + "<td><a class='btn btn-mini btn-primary' href='/order/add?t_id=" + _obj._id + "' target='_blank'>预定</a></td>";
          } else {
            _tpl = _tpl + "<td><a class='btn btn-mini btn-primary' href='javascript:void(0)'><strong style=\"color: red\">截止</strong></a></td>";
          }


          _tpl = _tpl + "</tr>";
          return _tpl
        }

      );
    }
    var param = ''
    if (addr && addr.length > 0) {
      param = param + "addr=" + addr;
    }
    if (_channel_id && _channel_id.length > 0) {
      param = param + "&channel_id=" + _channel_id;
    }
    $("#pagination").html('');
    $("#pagination").attr("param",param);
    $("#pagination").attr("url",$("#set_url").val());
    $.pagination.init(travel_list);
//
    $("#area_channel_list").html("");
    for (var i in channel_list.results) {
      $("#area_channel_list").append("<button class=\"btn  btn-small  btn-primary\" data=\"" + channel_list.results[i]._id + "\">" + channel_list.results[i].title + "</button> ");
    }

    if (channel.qq && channel.qq.length > 0) {
      $("#detail1 p").html(" ");
      for (var i in channel.qq) {
        var qq = channel.qq[i];
        $("#detail1 p").append('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + qq.qqno + '&amp;site=qq&amp;menu=yes">' + qq.name + '：<img ' +
          'border="0" src="http://wpa.qq.com/pa?p=2:' + qq.qqno + ':41" alt="点击这里给我发消息" title="点击这里给我发消息"></a><br>');
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
        $("#account_list").append(' ' + account.name + ':' + account.accno + '<br/>');
      }
    } else {
      $("#account_list").html("等待加盟商添加。");
    }

    $("#user_des").html(agent_user.des);
    $("#user_company").html(agent_user.company);
    $("#addr_list").html("");


    for (var i in result_addr_list) {
      var value = result_addr_list[i].address;
      for (var j = 0; j < value.length; j++) {
        var _exist = $.inArray(value[j], addr_list);
        if (_exist == -1) {
          addr_list.push(value[j]);
        }
      }
    }
    for (var k in addr_list) {
      $("#addr_list").append("<a class='btn btn-small btn-primary' href='javascript:void(0)'>" + addr_list[k] + "</a>");
    }
    travel_event();
  });

};

function travel_event() {
  $("#area_channel_list button").unbind("click").bind("click", function (e) {
    var _id = $(e.target).attr("data");

    travel_render(_id);

  });
  $("#addr_list a").unbind("click").bind("click", function (e) {
    var _addr = $(e.target).html();
    var channel_id = $("input[name=channel_id]").val();
    travel_render(channel_id, _addr);
  });
}
(function () {
  var channel_id = $("#set_channel_id").val();
  var addr = $("#set_addr").val();
  travel_render(channel_id,addr);
})();