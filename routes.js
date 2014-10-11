var website = require('./controllers/website');
var admin = require('./controllers/admin');
var customer = require('./controllers/customer');
var agent = require('./controllers/agent');
var upload = require('./controllers/upload');
var service = require('./controllers/service');
var error = require('./core/error');

module.exports = function (app) {

  app.get('/',website.ieInfo);
  app.get('/logout', website.logout);
  app.get('/signup', website.signup);

  app.get('/updatePwd',website.updatePass);
  app.get('/updateUser',website.updateUser);
  // home page

  // admin page
  app.get('/index', website.index);
  app.get('/news', website.indexNews);
  app.get('/admin', admin.index);
  app.get('/admin/channels', admin.channels);


  app.get('/admin/channel/add', admin.addChannel);
  app.get('/admin/channel/delete', admin.delete);

  app.get('/admin/user/add', admin.addUser);
  app.get('/admin/user/edit', admin.editUser);
  app.get('/admin/users', admin.users);
  app.get('/agent', agent.index);
  app.get('/customer', customer.index);


  app.post('/user/signin', website.login);

  app.get('/agent/products', agent.products);
  app.get('/agent/travels', agent.travels);
  app.get('/agent/product/add', agent.product_add);

  web(app);
  api(app);
};
function web(app) {
  app.get('/admin/news', admin.news);
  app.get('/admin/news/add', admin.addNews);
  app.get('/admin/news/edit', admin.editNews);


  app.get('/join',website.join)
  app.get('/agent/orders', agent.orders);
  app.get('/agent/channels', agent.channels);
  app.get('/agent/order/add', agent.order_add);
  app.get('/agent/product/delete', agent.productDelete);
  app.get('/agent/travel/update', agent.productUpdate);
  app.get('/agent/product/intro', agent.intro);
  app.get('/agent/travel/intro', website.travel_intro);
  app.get('/printf/travel', website.printfTravel);
  app.get('/printf/order', website.printfOrder);
  app.get('/agent/travel/add', agent.addTravel);

  app.get('/order/add', website.addOrder);
  app.get('/agent/order/detail', website.detailOrder);

  app.get('/agent/orders', website.orders);
  app.get('/customer/order/add', website.addCustomerOrder);
  app.get('/customer/orders', website.customerOrders);
  app.get('/customer/order/detail', website.detailCustomerOrder);


  app.get('/agent/travel/delete', website.travel_delete);
  app.get('/agent/travel/add', agent.addTravel);
  app.get('/agent/travel/list', website.travel_index);
}
function api(app) {
  app.post('/updatePassword.json',website.updatePassword);
  app.post('/agent/travelcode/get.json', agent.createTravelCodeByTime);
  app.post('/api/user/login.json', website.login, error.done);

  app.get('/api/channel/list.json', admin.getChannelList, error.done);
  app.post('/api/user/add.json', admin.createUser, error.done);
  app.get('/api/user/list.json', admin.getUserList, error.done);
  app.post('/api/admin/channel/add.json', admin.channelAdd, error.done);


  app.get('/api/product/list.json', agent.getProductList, error.done);
  app.get('/api/admin/news/list.json', admin.getNewsList, error.done);
  app.post('/api/admin/news/add.json', admin.createNews, error.done);

  app.post('/agent/product/add.json', agent.productAdd);
  app.post('/agent/product/update.json', agent.product_Update);
  // upload
  app.post('/api/upload.json', upload.uploadImage);

  app.get('/api/agent/channel/list.json', agent.getAgentChannelList);

  app.get('/api/user/find.json', website.getUserById);
  app.get('/api/channel/find.json', website.getChannelById);

  app.post("/agent/channel/qq/add.json", agent.addChannelQQ);
  app.post("/agent/channel/tel/add.json", agent.addChannelTel);
  app.post("/agent/channel/account/add.json", agent.addChannelAccount);

  app.post("/agent/channel/qq/remove.json", agent.removeChannelQQ);
  app.post("/agent/channel/tel/remove.json", agent.removeChannelTel);
  app.post("/agent/channel/account/remove.json", agent.removeChannelAccount);

  app.post("/agent/travel/add.json", agent.travelAdd);

  app.get("/api/dashboard.json", website.getDashboardInfo);

  app.get("/api/order/add/info.json", website.getInitOrderInfo);
  app.post("/api/order/add.json", website.createOrder);
  app.get("/api/travel/list.json", website.travel_list);
  app.get("/api/travel/find_month.json", website.travelMonthIntro);

  app.get("/api/agent/order/list.json", website.getAgentOrderList);
  app.post("/api/agent/order/confirm.json", website.getAgentOrderConfirm);
  app.post("/api/agent/order/cancel.json", website.getAgentOrderCancel);
  app.post("/api/customer/order/cancel.json", website.getCustomerOrderCancel);

  app.get("/api/order/find.json", website.getOrderDetail);

  app.get("/api/customer/order/list.json", website.getCustomerOrderList);

  app.get("/api/admin/user/sign.json", admin.generateSign);
  app.post("/api/sign/add.json", admin.signup);

  app.get("/api/admin/user/find.json",website.getUserById);


  app.post("/api/admin/channel/set_top.json",admin.adminChannelSetUpTop);
  app.post("/api/admin/channel/remove.json",admin.adminChannelRemove);


  app.post("/api/agent/travel/set_hidden.json",agent.agentTravelSetHidden);


  app.get("/api/mail/test.json",service.testSend);
  app.get("/agent/order/noticeList.json",agent.getOrderNoticeList);
}
