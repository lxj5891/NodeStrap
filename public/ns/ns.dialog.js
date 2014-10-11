



(function ($) {
  var Settings = {
    height : "150",
    width : "450",
    title :"处理数据",
    content:"正在处理提交的数据....",
    status :"open"
  };

  $.dialog={
    init:init
  };

  $.fn.extend({
    dialog:createDialog,  //生成一个模态的窗口
    createHtml:createHtml, //在当前jquery对象是拼接dialog的html代码
    openOrClose:controlDialog, //控制dialog的开关
    modify : modify
  });


  function createDialog(option){
    var $that=this;
    $that.createHtml().modify(option).openOrClose();
    return this;
  }


  /**
   *	在当前jquery对象是拼接dialog的html代码
   *
   */
  function createHtml(){
    var $that=this;
    $that.html(' ');
    $that.addClass("modal hide fade").attr('tabindex','-1').attr('role','dialog');
    $that.append("<div class='modal-header'> <h4></h4> </div> <div class='modal-body'> <p></p> </div>");
    return this;
  }


  function controlDialog(status){
    var $that=this;
    var _status=status||Settings.status;

    if(_status=="open"){
      $that.modal('show');
    }
    if(_status=="close"){
      $that.modal('hide');
    }
    return this;

  }

  function modify(option){
    var $that=this;
    if (typeof option == 'string'){
      $that.addClass(option);
      return this;
    }
    var _option = option || {};

    /**
     *通过传递的参数设置对话框的属性
     *
     */
    for(var key in _option){

      switch(key){
        case 'height':
          Settings.height=_option[key];
          break;
        case 'width':
          Settings.width=_option[key];
          break;
        case 'title':
          Settings.title=_option[key];
          break;
        case 'content':
          Settings.content=_option[key];
          break;
      }
    }

    $that.find('h4').text(Settings.title).end()
      .find('p').text(Settings.content).end().css({'width':parseInt(Settings.width),'height':parseInt(Settings.height)});
    return this;
  }


  function init(){
       alert("create") ;
      $('#main-content').after(
        '<div id="ajaxIng" style="width: 500px;height: 120px;" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
            <div class="modal-header">                                                                                           \
                <h3 >处理数据</h3>                                                                                                   \
            </div>                                                                                                               \
            <div class="modal-body">                                                                                             \
                   <div class="control-group">     \
                  <img src="/images/loading.gif"/>   正在提交您的请求，请稍候...     \
                </div> \
            </div>                                                                                                               \
        </div>'
      );
      alert(  $('#ajaxIng').html());
    }

})(jQuery)

