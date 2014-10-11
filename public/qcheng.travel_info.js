/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-10-6
 * Time: 下午4:46
 * To change this template use File | Settings | File Templates.
 */
(function () {
  smart.doget("/api/travel/find_month.json", function (err, result) {

    $("#Calendar_list").html(" ");
    var k = 0;
    for (var i = 0; i < 6; i++) {
      var line = "<tr>";
      for (var j = 0; j < 7; j++) {
        var day = result.calendar_list[k];
        if(day  && day.day == j){
          if(day.price){
            line = line + "<td height=\"40\"><a href=\"/agent/travel/intro?id="+day._id+"\">"+day.noyear+"<p>"+day.price+"元</p></a></td>"
          }else{
            line = line + "<td height=\"40\">"+day.noyear+" </td>"
          }
          k = k + 1;
        }else{
          line = line + "<td height=\"40\"> </td>"
        }
      }
      line + "</tr>";
      $("#Calendar_list").append(line);
    }
  });
})();