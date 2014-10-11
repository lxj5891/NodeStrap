/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-10-2
 * Time: 上午11:25
 * To change this template use File | Settings | File Templates.
 */
(function () {
  function event() {
    $("input[name=type]").click(function (e) {
      var image_type = $(e.target).val()

      if (image_type == "1") {
        $("#image-group").hide();
        $("#image-group-preview").hide();
      } else {
        $("#image-group-preview").show();
        $("#image-group").show();
      }

    })
  };
  function getNewsDetail() {

  }

  function viewDidLoad() {
    $("#image-group").hide();
    $("#image-group-preview").hide();
    $("#selectFile").bind("click", function () {
      $("#uploadfile").trigger('click');
    });
    $("#uploadfile").bind("change", function (e) {
      var fid = $(e.target).attr("fid") || "";
      $("#uploadfile").attr("fid", "");
      uploadFiles(fid, e.target.files);
    });
  }

  /**
   * 上传图片
   */
  function uploadFiles(fid, files) {
    if (!files || files.length <= 0) {
      return false;
    }

    var fd = new FormData();
    fd.append("fid", fid);
    for (var i = 0; i < files.length; i++) {
      fd.append("userfile", files[i]);
    }

    dopostData("/api/upload.json", fd, function (err, result) {
      $("#displayImage").attr("src", result.url);
      $("#inputImage").attr("value", result.url);
    });
  };
  function dopostData(url_, data_, callback_) {


    var self = this;
    var crsf = $("#_csrf").val();
    $.ajax({
      url: url_ + "?_csrf=" + crsf,
      type: "POST",
      async: false,
      data: data_,
      dataType: "json",
      contentType: false,
      processData: false,
      success: function (result) {

        if (result.error) {
          callback_(1, result.error);
        } else {
          callback_(0, result);
        }
      },
      error: function (err) {
        callback_(1, err);
      }
    });
  }

  viewDidLoad();
  event();
})();