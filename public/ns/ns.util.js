function _dis2Day(date1, date2) {
    var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    return days;
}

function _dis2DayString(date1, date2) {
    var _fnStringToDate = function (str) {
        str = str.toString()
        str = str.replace(/-/g, "/");
        var _date = new Date(str);
        return _date
    };

    return _dis2Day(_fnStringToDate(date1), _fnStringToDate(date2));
}

function getDis2Day(date1, date2) {

    if (typeof(date1) == 'string' && typeof(date1) == 'string') {
        return _dis2DayString(date1, date2)+1;
    } else if (typeof(date1) == 'object' && typeof(date1) == 'object') {
        return _dis2Day(date1, date2)+1;
    } else {
        return 0;
    }

}