/**
 * Created with JetBrains WebStorm.
 * User: chenyingxi
 * Date: 13-9-24
 * Time: 上午10:52
 * TODO  用于在html页面加载完成后  动态的加载文件和启动对象的function方法
 *
 */


var $ns = {
  keyCode: {
    ENTER: 13, ESC: 27, END: 35, HOME: 36,
    SHIFT: 16, TAB: 9,
    LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
    DELETE: 46, BACKSPACE: 8
  },
  eventType: {
    pageClear: "pageClear",	// 用于重新ajaxLoad、关闭nabTab, 关闭dialog时，去除xheditor等需要特殊处理的资源
    resizeGrid: "resizeGrid"	// 用于窗口或dialog大小调整
  },
  frag: {}, //page fragment
  _msg: {}, //alert message
  _set: {
    loginUrl: "", //session timeout
    loginTitle: "", //if loginTitle open a login dialog
    debug: true
  },
  statusCode: {ok: 200, error: 300, timeout: 301},

  init : function(){

  }
};



<!--当页面出现插件对象的标签的时候，初始化控件-->
var nsLoadfuntion = {
  datagrid: "$.datagrid.init()"
}


function onNsclick(str) {
  $(str).onSubmitNs();

}


<!--将html页面上出现的ns插件进行初始化-->
$(function () {
  var str = "";
  for (var i in nsLoadfuntion) {
    var divClass = ".nodeStrap-" + i;
    if ($(divClass)) {
      str = "$." + i + ".init();";
      eval(str);
    }
  }
});
