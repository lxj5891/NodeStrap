exports.index = function (req, res, next) {
  var user = req.session.user;
  var page = req.query.page || 1;
  var addr = req.query.addr || '';
  var channel_id = req.query.channel_id || '';
  res.render("qcheng/customer_index", {
    current_user: user,
    pageNum : page,
    channel_id :channel_id,
    addr : addr,
    layout: req._layout,
    url:"/customer"
  });
}
