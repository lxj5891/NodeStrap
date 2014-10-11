/**
 * loader
 * User: chenyingxi
 * Date: 13-9-27
 * TODO  当页面加载完成了以后 动态的向dom节点中引入文件
 * 
 */
(function($){
  $.load={
    loadJs:loadJs
  };

    <!--用于动态的加载Js文件-->
	function loadJs(url, callback){
		var done = false
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.language = 'javascript';
		script.src =url;
		script.onload = script.onreadystatechange = function(){
			if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')){
				done = true;
				script.onload = script.onreadystatechange = null;
				if (callback){
					callback.call(script);
				}
			}
		}
		document.getElementsByTagName("head")[0].appendChild(script);
	}




	
})(jQuery);
