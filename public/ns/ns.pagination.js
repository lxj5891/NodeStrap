/**
 * Created with JetBrains WebStorm.
 * User: chenyingxi
 * Date: 13-9-25
 * Time: 下午11:04
 * TODO  ns框架提供的datagrid插件
 */



(function($){
  $.pagination={
    init:init
  };
  $.fn.extend({
    PaginationHtml:createTotalHtml  //在当前jquery对象是拼接page分页的html代码
  });

  /**
   * TODO 初始化分页控件
   *  description
   *	当页面出现了[nodeStrap-pagination]的标签的时候
   *  根据无法指定生产分页框
   *
   */
  function init(para){
    var	page=$(".nodeStrap-pagination");
    if(page){
      page.each(function (){
          $(this).PaginationHtml(para);
      });
    }
  }
  function  parsePageNumber(pageNumber){
    if(pageNumber==null)
          return 0;
    return    pageNumber;
  }

  function createTotalHtml(para){
      if(!para){
      return;
      }
     var $this=this;
     var url=$this.attr("url");
     $this.addClass("row-fluid")
        .append("<div class='span6'><div class='dataTables_info' id='table_report_info'> 第"+para.current+"页 共"+ parsePageNumber( para.last)+"页</div></div>")
        .append("<div class='span6'><div class='dataTables_paginate paging_bootstrap pagination'></div></div>");

    var  $that=$(".dataTables_paginate");

    var current=parseInt(para.current) ;
    if(!(url.indexOf("?")>0)){
      url=url+"?"
    }else{
      url=url+"&&";
    }

    $that.append("<ul></ul>").find("ul").append(" <li class=\"perv\"><a href=''><i class=\"icon-double-angle-left\"></i></a></li>");
    var str=para.pages;
    for(var i in str){
      var param = $this.attr("param");


      if(param){
        $that.find("ul").append("<li><a href='"+url+"page="+(str[i])+ "&"+param+"'>"+(str[i])+"</a></li>");
      }else{
        $that.find("ul").append("<li><a href='"+url+"page="+(str[i])+"'>"+(str[i])+"</a></li>");
      }


      if(current==str[i]){
        $that.find("li").last().addClass("active") ;
      }
    }
    $that.find("ul").append(" <li class=\"next\"><a href=''><i class=\"icon-double-angle-right\"></i></a></li>");
    if(current>1){
      var preStr=url+"page="+(current-1);
      $(".perv").find("a").attr("href",preStr)
    }else{
      var preStr="#"
      $(".perv").addClass("disabled").find("a").attr("href",preStr);
    }
    if(para.last>para.current){
      var nextStr=url+"page="+(current+1);
      $(".next").find("a").attr("href",nextStr);
    }else{
      var nextStr="#"
      $(".next").addClass("disabled").find("a").attr("href",nextStr);
    }
    return this;
  }


  function createHtml(para){
    var $that=this;
    var url=$that.attr("url");
    var current=parseInt(para.current) ;
    if(!(url.indexOf("?")>0)){
      url=url+"?"
    }else{
      url=url+"&&";
    }
    $that.append("<ul></ul>").find("ul").append(" <li class=\"perv\"><a href=''><i class=\"icon-double-angle-left\"></i></a></li>");
    for(var i=0;i<para.length;i++){
      $that.find("ul").append("<li><a href='"+url+"page="+(para.pages+i)+"'>"+(para.pages+i)+"</a></li>");
      if(current==para.pages+i){
        $that.find("li").last().addClass("active") ;
      }
    }
    $that.find("ul").append(" <li class=\"next\"><a href=''><i class=\"icon-double-angle-right\"></i></a></li>");
    if(current>1){
      var preStr=url+"page="+current-1;
      $(".perv").find("a").attr("href",preStr)
    }else{
      var preStr="#"
      $(".perv").addClass("disabled").find("a").attr("href",preStr);
    }
    if(para.last>para.current){
      var nextStr=url+"page="+(current+1);
      $(".next").find("a").attr("href",nextStr);
    }else{
      var nextStr="#"
      $(".next").addClass("disabled").find("a").attr("href",nextStr);
    }
    return this;
  }

})(jQuery)