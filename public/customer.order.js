/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-10-6
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */

(function () {
  var order_id = $("input[name=order_id]").val();
  var url = "/api/order/find.json?order_id=" + order_id;
  render_order_detail(url);
  event();
  function event() {

    $("#cancelOrderBtn").unbind("click").bind("click", function (e) {
      var _id = $(e.target).attr("data");


      alertify.prompt("原因", function (e, promptValue) {
        // str is the input text
        if (e) {
          // user clicked "ok"
          if (promptValue.length == 0) {
            alertify.alert("请填写原因");
            return;
          }
          if ("请填写原因" == promptValue) {
            alertify.alert("请填写原因");
            return;
          }
          var data = {
            order_id: _id,
            reason: promptValue
          }
          smart.dopost("/api/customer/order/cancel.json", data, function (err, result) {
            render_order_detail(url);
            $ns.ajaxDone(result);
          });
        } else {
          return;
        }
      }, "请填写原因");

    });
  }
})();