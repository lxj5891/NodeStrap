var $alertMsg = {


  _types: {error: "error", info: "info", warn: "warn", correct: "correct", confirm: "confirm", alert: "alert"},
  _keydownOk: function (event) {
    if (event.keyCode == DWZ.keyCode.ENTER) event.data.target.trigger("click");
    return false;
  },
  _keydownEsc: function (event) {
    if (event.keyCode == DWZ.keyCode.ESC) event.data.target.trigger("click");
  },
  _alert: function (type, msg, options) {

    this._open(type, msg);
  },
  _open: function (type, msg, buttons) {
    if (this._types.error == type) {
      if (!_.isObject(msg))
        alertify.error(msg);
      else {
        if (!msg.msg) {
          alertify.error("系统错误请联系管理员！");
        } else {
          alertify.error(msg.msg);
        }
      }
    } else if (this._types.confirm == type) {
      alertify.set({ labels: {
        ok: "确认",
        cancel: "取消"
      } });
      alertify.confirm(msg, function (e) {
        if (e) {
          eval("buttons[0].call();");
        } else {
          // user clicked "cancel"
        }
      });
    } else if (this._types.alert == type) {
      alertify.alert(msg);
    } else {
      alertify.success(msg);
    }


  },
  /**
   *
   * @param {Object} msg
   * @param {Object} options {okName, okCal, cancelName, cancelCall}
   */
  confirm: function (msg, options) {
    var op = {okName: "确定", okCall: null, cancelName: "取消 ", cancelCall: null};
    $.extend(op, options);
    var buttons = [
      {name: op.okName, call: op.okCall, keyCode: $ns.keyCode.ENTER},
      {name: op.cancelName, call: op.cancelCall, keyCode: $ns.keyCode.ESC}
    ];
    this._open(this._types.confirm, msg, buttons);
  },
  alert: function (msg, options) {
    this._alert(this._types.alert, msg, options);
  },
  error: function (msg, options) {
    this._alert(this._types.error, msg, options);
  },
  info: function (msg, options) {

    this._alert(this._types.info, msg, options);
  },
  warn: function (msg, options) {
    this._alert(this._types.warn, msg, options);
  },
  correct: function (msg, options) {
    this._alert(this._types.correct, msg, options);
  }

};