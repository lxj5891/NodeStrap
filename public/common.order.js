function render_order_detail(url) {
  var url = url;
  smart.doget(url, function (err, result) {
    $("#order_reason_3").html(result.data.reason);
    $("#order_reason_4").html(result.data.reason);
    $("#order_reason_5").html(result.data.reason);
    $("input[name=name]").val(result.data.user_name);
    $("input[name=name]").attr("readonly", true);
    $("input[name=tel]").val(result.data.user_tel);
    $("input[name=tel]").attr("readonly", true);
    $("textarea[name=tips]").val(result.data.tips);
    $("textarea[name=tips]").attr("readonly", true);
    $("select[name=adult_count]").html("<option value=\"" + result.data.adult_count + "\">" + result.data.adult_count + "</option>");
    $("select[name=adult_count]").val(result.data.adult_count);
    $("select[name=adult_count]").attr("readonly", true);
    $("select[name=child_count]").html("<option value=\"" + result.data.child_count + "\">" + result.data.child_count + "</option>");
    $("select[name=child_count]").val(result.data.child_count);
    $("select[name=child_count]").attr("readonly", true);
    var user_list = result.data.user_list;
    setTimeout(function () {
      $("#amount_d").html("" + result.data.amount);
      $(".order_status").css("display", "none");
      $("#status_" + result.data.status).css("display", "block");
    }, 1500);

    render_user_list(null, user_list)
  })
}

var render_user_list = function (age_type, user_list) {


  amount = Number(adult_amount) + Number(child_amount);
  $("#amount_d").html(' ' + amount);
  $("#amount").val(amount);

  var tpl = function (type, __g_name, __g_sex, __age_type, __g_tel, __g_id, __g_tips) {
    return '<tr class="cr">                    ' +
      '<td align="center">' + __g_name +
      '</td>                    ' +
      '<td align="center">' + __g_sex +
      '</td>      ' +
      '<td align="center">' + type + '</td>' +
      '<td align="center">' + __g_tel + '</td>' +
      '<td align="center">' + __g_id + '</td>' +

      '<td align="center">' +
      '' + __g_tips + '</td>' +
      '</tr>';
  }
  $("#orderUserCollection").html(' ');
  for (var i in user_list) {
    $("#orderUserCollection").append(tpl(user_list[i].age_type, user_list[i].name, user_list[i].sex, user_list[i].age_type, user_list[i].tel, user_list[i].id, user_list[i].tips));
  }
};

function render_order(travel_id) {
  var url = '/api/order/add/info.json?travel_id=' + travel_id;
  smart.doget(url, function (err, result) {

    $("#travel_code").html(result.data.travel_code);
    $("#travel_product_routename").html(result.data._product.routename);
    $("#travel_product_days").html(result.data._product.days+"天");
    $("#travel_traveldate").html(result.data.traveldate);
    $("#travel_finish_time").html(result.data.finish_time);
    $("#travel_product_go_type").html(result.data._product.go_type);
    $("#travel_product_back_type").html(result.data._product.back_type);
    $("#travel_product_adult_price").html(result.data._product.adult_price);
    $("#travel_product_child_price").html(result.data._product.child_price);
    $("#travel_adult_resultprices").html(result.data.adult_resultprices);
    $("#adult_price").val(result.data.adult_resultprices)
    $("#child_price").val(result.data.child_resultprices)
    $("#travel_child_resultprices").html(result.data.child_resultprices);
    $("#travel_elses").html(result.data.elses || 0);
  });
}
function render_event() {

}

var adult_count = 0;
var child_count = 0;
var amount = 0
var adult_amount = 0;
var child_amount = 0;


var collection = function () {
  var _body = $(".cr"),
    _array = [];
  for (var i = 0; i < _body.length; i++) {
    var _object = {};
    _object.name = _body.eq(i).find("input[name='g_name']").val();
    _object.sex = _body.eq(i).find("select[name='g_sex']").attr("value");
    _object.is_child = _body.eq(i).find("input[name='g_is_child']").val();
    _object.tel = _body.eq(i).find("input[name='g_tel']").val();
    _object.id = _body.eq(i).find("input[name='g_id']").val();
    _object.tips = _body.eq(i).find("input[name='g_tips']").val();
    _array.push(_object);
  }


};
var change_adult_count = function () {

  var count = $("#c_adult").val();
  var adult_price = Number($("#adult_price").val());
  adult_count = Number(count);
  adult_amount = adult_price * count;

  render("成人");
};
var change_child_count = function () {

  var count = $("#c_child").val();
  var line = Number(count) - child_count;
  child_count = Number(count);
  var child_price = Number($("#child_price").val());
  child_amount = child_price * child_count;

  render("儿童");

};
var render = function (age_type) {


  amount = Number(adult_amount) + Number(child_amount);
  $("#order_amount").html(' ' + amount);
  $("#amount").val(amount);

  var tpl = function (type) {
    return '<tr class="cr">                    ' +
      '<td align="center">' +
      '<input type="hidden" name="ID" value="0">' +
      '<input type="text" t="text" name="__g_name" value="" style="width: 60px">' +
      '</td>                    ' +
      '<td align="center">' +
      '<select name="__g_sex">' +
      '<option value="男">男</option>' +
      '<option value="女">女</option>' +
      '</select>' +
      '</td>      ' +
      '<td align="center"><input type="hidden" value="' + type + '" name="__age_type">' + type + '</td>' +
      '<td align="center"><input type="text" name="__g_tel" value="" style="width: 90px"></td>' +
      '<td align="center"><input type="text" name="__g_id" t="text" value="" style="width: 130px"></td>' +

      '<td align="center">' +
      '<input type="text" style="width:200px" name="__g_tips" value=""></td>' +
      '</tr>';
  }
  $("#orderUserCollection").html(' ');
  for (var i = 0; i < adult_count; i++) {
    if (i == 0) {

    }
    $("#orderUserCollection").append(tpl('成人'));
  }
  for (var i = 0; i < child_count; i++) {
    if (i == 0) {

    }
    $("#orderUserCollection").append(tpl('儿童'));
  }

};
(function () {
  var travel_id = $("input[name=travel_id]").val();
  render_order(travel_id);
})();