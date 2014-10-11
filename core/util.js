exports.format_date = function (date, friendly) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0' : '') + second;

  var thisYear = new Date().getFullYear();
  year = (thisYear === year) ? '' : (year + '-');
  return year + month + '月' + day + '日 ' + hour + ':' + minute;
};


exports.format_date_line = function (date, friendly) {
  var weekArray = [
    "周日",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六"];

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var week = date.getDay();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  month = ((month < 10) ? '0' : '') + month;
  day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0' : '') + second;

  var thisYear = new Date().getFullYear();
  year = year + '-'

  return {
    date: year + month + '-' + day,
    noyear: month + '-' + day,
    day: weekArray[week],
    week: week
  };
};
function _dis2Day(date1, date2) {
  var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
  var days = Math.floor(date3 / (24 * 3600 * 1000))
  return days;
}
function getMounthDay(date) {
  var _fnStringToDate = function (str) {
    str = str.replace(/-/g, "/");
    var _date = new Date(str);
    return _date
  };
  var now_date = _fnStringToDate(date);

  var nowd = now_date.getFullYear() + '-' + (now_date.getMonth() + 1) + '-' + '1'; //2013-1-17
  var nextd = now_date.getFullYear() + '-' + (now_date.getMonth() + 2) + '-' + '1'; //2013-2-17
  var mounth_length = _dis2Day(new Date(nowd), new Date(nextd));
  var mounth_day_list = [];
  for (var i = 1; i <= mounth_length; i++) {
    var year = now_date.getFullYear();
    var month = now_date.getMonth() + 1;
    month = ((month < 10) ? '0' : '') + month;
    var day = i;
    day = ((day < 10) ? '0' : '') + day;
    mounth_day_list.push({
      date: year + '-' + month + '-' + day,
      noyear : month + '-' + day,
      day: new Date(year + '-' + month + '-' + day).getDay()
    });
  }
  return mounth_day_list;
}

exports.getMounthDay = getMounthDay;