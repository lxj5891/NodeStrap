/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-10-5
 * Time: 上午8:46
 * To change this template use File | Settings | File Templates.
 */
(function () {
  var page = 1;

  function event() {

    $("#area_channel_list button").unbind("click").bind("click", function (e) {
      var _id = $(e.target).attr("data");
      smart.doget("/api/channel/find.json?channel_id=" + _id, function (err, result) {

        if (result.data.qq && result.data.qq.length > 0) {
          $("#detail1 p").html(" ");
          for (var i in result.data.qq) {
            var qq = result.data.qq[i];
            $("#detail1 p").append('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + qq.qqno + '&amp;site=qq&amp;menu=yes">' + qq.name + '：<img ' +
              'border="0" src="http://wpa.qq.com/pa?p=2:' + qq.qqno + ':41" alt="点击这里给我发消息" title="点击这里给我发消息"></a>');
          }
        } else {
          $("#detail1 p").html("等待加盟商添加。");
        }
        if (result.data.tel && result.data.tel.length > 0) {
          $("#tel_list").html(" ");
          for (var j in result.data.tel) {
            var tel = result.data.tel[j];
            $("#tel_list").append(' ' + tel.name + '：<span>' + tel.telno + '</span>');
            if (result.data.tel.length != j + 1) {
              $("#tel_list").append('<br/>');
            }
          }

        } else {
          $("#tel_list").html("等待加盟商添加。");
        }

        if (result.data.account && result.data.account.length > 0) {
          $("#account_list").html(" ");
          for (var k in result.data.account) {
            var account = result.data.account[k];
            $("#account_list").append(' ' + account.name + ':' + account.accno + '<br/>');
          }
        } else {
          $("#account_list").html("等待加盟商添加。");
        }
      });
    });
  }

  smart.doget("/api/agent/channel/list.json?page=" + page, function (err, result) {
    var data = result.data.pagination.results;
    $("#area_channel_list").html("");
    for (var i in data) {
      $("#area_channel_list").append("<button class=\"btn btn-small btn-primary\" data=\"" + data[i]._id + "\">" + data[i].title + "</button> ");
    }
    event();
  });

})();