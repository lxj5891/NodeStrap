function initEnv() {


  $(document).ajaxStart(function () {
    $("#nsdialog").dialog();
  }).ajaxStop(function () {
      setTimeout(function () {
        try {
          $("#nsdialog").openOrClose("close");
        } catch (e) {
        }

      }, 1000);
    });
  //清理浏览器内存,只对IE起效
  if ($.browser.msie) {
    window.setInterval("CollectGarbage();", 10000);
  }

  $(window).resize(function () {
    initLayout();
  });


  setTimeout(function () {
    initLayout();
    initUI();
  }, 10);

}
function initLayout() {
  var iContentW = $(window).width();
  var iContentH = $(window).height();
}

function initUI(_box) {
  var $p = $(_box || document);
  $("form.required-validate", $p).each(function () {
    var $form = $(this);
    $form.validate({
      onsubmit: false,
      focusInvalid: true,
      focusCleanup: true,
      ignore: ".ignore",
      invalidHandler: function (form, validator) {
        var errors = validator.numberOfInvalids();
        if (errors) {
//          var message = $DAC.msg("validateFormError", [errors]);
//          $alertMsg.error(message);
        }
      },
      errorClass: "help-inline",
      errorElement: "span",
      highlight: function (element, errorClass, validClass) {

        $(element).parents('.control-group').removeClass('success');
        $(element).parents('.control-group').addClass('error');
        $($(element).find("span")[0]).css("float", "right");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).parents('.control-group').removeClass('error');
        $(element).parents('.control-group').addClass('success');

      }
    });

  });

  if ($.fn.xheditor) {
    $("textarea.editor", $p).each(function () {
      var $this = $(this);
      var op = {html5Upload: false, skin: 'vista', tools: $this.attr("tools") || 'full'};
      var upAttrs = [
        ["upLinkUrl", "upLinkExt", "zip,rar,txt"],
        ["upImgUrl", "upImgExt", "jpg,jpeg,gif,png"],
        ["upFlashUrl", "upFlashExt", "swf"],
        ["upMediaUrl", "upMediaExt", "avi"]
      ];

      $(upAttrs).each(function (i) {
        var urlAttr = upAttrs[i][0];
        var extAttr = upAttrs[i][1];

        if ($this.attr(urlAttr)) {
          op[urlAttr] = $this.attr(urlAttr);
          op[extAttr] = $this.attr(extAttr) || upAttrs[i][2];
        }
      });

      $this.xheditor(op);
    });
  }

}