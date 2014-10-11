
socket.on('initUserId', function (data) {

});

socket.on('getOrderList', function (data) {
  $("#orderNoticeList").html("<li class=\"nav-header\">" +
    "<i class=\"icon-warning-sign\"></i>订单通知列表" +
    "</li>");
  var order_list = data.order_list.results;
  var order_count = data.order_list.count;

  var subTitle = function (str) {
    if (str.length > 8) {
      return str.substring(0, 7) + "...";
    } else {
      return str;
    }

  }
  for (var i in order_list) {
    $("#orderNoticeList").append("<li>" +
      "<a href=\"/agent/order/detail?order_id=" + order_list[i]._id + "\">" +
      " <div class=\"clearfix\">" +
      "<span class=\"pull-left\">" + subTitle(order_list[i]._product.routename) + "</span>" +
      " <span class=\"pull-right badge badge-info\">" + (order_list[i].adult_count + order_list[i].child_count) + "人</span>" +
      "</div>" +
      "</a>" +
      "</li>");
  }
  $("#orderNoticeList").append("<li>" +
    "<a href=\"/agent/orders\">" +
    "更多订单" +
    "<i class=\"icon-arrow-right\"></i>" +
    "</a>" +
    "</li>");
  $("#orderCount").html(order_count);

});
var $s = {
  initOder: function () {
    var userId = $("#userId").val();
    socket.emit('link_user', { userId: userId });
    socket.emit('initOrder', { userId: userId });
  }
}