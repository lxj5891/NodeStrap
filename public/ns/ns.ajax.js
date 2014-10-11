$ns = $ns || {}

$ns.validateCallback = function () {

  var $form = $(this);
  var object_id = $("#object_id").val() || -1;
  var confirmMsg = $form.attr("confirmMsg");
  if (!confirmMsg || confirmMsg.length == 0) {
    confirmMsg = "确认提交吗？";
  }
  if (!$form.valid()) {
    return false;
  }

  var data = {
    "data": $form.serializeArray(),
    "object_id":object_id
  }

  var _submitFn = function () {
    $("#nsdialog").dialog();
    $.ajax({
        type: this.method || 'POST',
        url: $form.attr("action"),
        data: data,
        cache: false,
        success: $ns.ajaxDone,
        error: $ns.ajaxError
      }
    );
  }

  $alertMsg.confirm(confirmMsg || "确认提交吗？", {okCall: _submitFn});

  return false;
};

$ns.ajaxDone = function (data) {

  if (data.status == 10001) {
    $ns.redirect(data);
  } else if (data.status == 10004) {
    $alertMsg.info(data.msg);
  } else if (data.status == 30004) {
    $ns.ajaxError(data);
  } else if (data.status == 30001) {
    $ns.ajaxError(data);
  }else if (data.status == 40001) {
    $ns.ajaxError(data);
  }

};

$ns.redirect = function (data) {
  if (data.redirect) {
    window.location.href = data.redirect;
  } else {
    window.location.href = data;
  }
};

$ns.ajaxError = function (xhr, ajaxOptions, thrownError) {
  $alertMsg.error({msg: xhr.err});
};

(function ($) {

  $.fn.extend({
    onSubmitNs: $ns.validateCallback  //在当前jquery对象是拼接page分页的html代码
  });


})(jQuery);