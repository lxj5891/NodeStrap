/**
 * Created with JetBrains WebStorm.
 * User: chenyingxi
 * Date: 13-9-25
 * Time: 下午11:04
 * TODO  ns框架提供的datagrid插件
 */





(function ($) {
  $.datagrid = {
    init: init,
    getData: getDataList
  };

  $.fn.extend({
    datagridHtml: createHtml  //在当前jquery对象是拼接表格数据的html代码
  });


  /**
   * TODO 初始化表格控件
   * description
   *      当页面出现了[nodeStrap-datagrid]的标签的时候
   *    根据无法指定生产自动生成表格框
   *
   */


  function init() {
    var page = $(".nodeStrap-datagrid");
    if (page) {
      page.each(function () {
        var url = $(this).attr("url");
        var page = $(this).attr("page");
        url = url + "?page=" + page;
        $(this).datagridHtml(url);
      });
    }
  }

  /**
   *
   *  用于向后台发送ajax请求，一遍获取数据
   *          ！为了保证该控件的独立性 即不需要依赖除了jquery的其他的插件书写 参考 /public/js/yukari.js
   * @param url_      请求的地址
   * @param method    请求的方式  post|get
   * @param callback_     通过callback获取方法的list
   */
  function getDataList(url_, method, callback_) {
    $.ajax({
      type: method, url: url_, dataType: "json",cache:false, success: function (result) {
        callback_(result.error, result.data);
      }, error: function (err) {
        callback_(err);
      }
    });
  }

  /**
   *  在dom 节点的适当位置绘制html
   * @param url
   */
  function createHtml(url) {
    var that = $(this)
    $("#nsdialog").dialog();
    $.datagrid.getData(url, 'get', function (err, result) {
      var item_list = [];
      that.find("th").each(function (i, th) {
        item_list.push($(th).attr("data-options"));
      });

      if(typeof(result) == "undefined")  {
        console.log("undefined");
        $("#nsdialog").openOrClose("close");
        return;
      }
      var list = result.pagination.results;


      var list_items = [];
      $.each(list, function (i, item) {
        var attr = '<tr>';
        $.each(item_list, function (j, item_attr) {

          if (eval('item.' + item_attr) != null) {
            var str = that.find("th:eq(" + j + ")").attr("data-link");
            var Nsid = str + "?id=" + item._id;
            if (str) {
              attr = attr + "<td> <a href='" + Nsid + "' target='_blank'> " + eval('item.' + item_attr) + "</a></td>";
            }
            else {
              attr = attr + "<td>" + eval('item.' + item_attr) + "</td>";
            }
          } else {
            var str = that.find("th:eq(" + j + ")").attr("data-url");
            if (str != null) {
              attr = attr + "<td>";
              var content = $.parseJSON(str.replace(/'/g, "\""));
              var count = 0;
              var id = "?id=" + item._id;
              for (var i in  content) {
                if (count / 2 == 0) {
                  attr = attr + "<a href=" + content[i] + id + "><span  class='btn btn-mini btn-primary'>" + i + "</span></a>";
                } else {
                  attr = attr + "<a href=" + content[i] + id + "><span  class='btn btn-mini btn-info'>" + i + "</span></a>";
                }
                count++;
              }
              attr = attr + "</td>";

            } else {
              attr = attr + "<td></td>";
            }

          }
        });
        attr = attr + "</tr>"
        list_items[i] = attr;
      });
      that.find("thead").find('tbody').html('');
      $("#nsdialog").openOrClose("close");

  //  that.find("thead").after("<tbody></tbody>");
 //    var list=list_items.join("");
  //  console.log(list);
  //   that.find('tbody').append(list);

     var list="<tbody>"+list_items.join("")+"</tbody>";
     that.append(list);

      $.pagination.init(result.pagination);
      try{
        event();
      }catch(e){

      }

    })
  }


})(jQuery)