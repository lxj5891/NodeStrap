/**
 * Created with JetBrains WebStorm.
 * User: Antony
 * Date: 13-9-25
 * Time: 下午4:27
 * To change this template use File | Settings | File Templates.
 */
var Order = require('./proxy').Order;
var _ = require('underscore');
var socket_list = [];

function pushUserId(userId, socket) {
  for (var i in socket_list) {
    if (socket_list[i].userId == userId) {
      socket_list[i] = {socket: socket, userId: userId, socketId: socket.id};
      return;
    }
  }
  socket_list.push({socket: socket, userId: userId , socketId: socket.id});
}

function removeUserId(socketId) {
  console.log("removeUserId : + " + socketId);
  for (var i in socket_list) {

    console.log(i);
    console.log(socket_list[i].socketId)
    if (socket_list[i].socketId == socketId) {
      console.log("removeUserId : " + socket_list.userId);
      socket_list = _.without(socket_list, socket_list[i]);
      return;
    }
  }
}

function emitSocket(userId, callback) {
  for (var i in socket_list) {
    if (socket_list[i].userId == userId) {
      return callback(null, socket_list[i].socket);
    }
  }
  return callback('err');
}

function noticeOrderList(userId) {

  emitSocket(userId, function (err, socket) {
    if (err) {
      return;
    }
    console.log("noticeOrderList  : " + userId);
    Order.getAgentOrderList(userId, 1, "1", function (err, order_list) {
      socket.emit('getOrderList', { order_list: order_list });
    });
  });

}

function app(io) {
  io.sockets.on('connection', function (socket) {
    socket.emit('initUserId', { hello: 'world' });
    socket.on('link_user', function (data) {
      console.log("socket start . : " +socket.id);
      pushUserId(data.userId, socket);
    });

    socket.on('initOrder', function (data) {
      var userId = data.userId;
      console.log("initOrder : "  + userId);
      noticeOrderList(userId);
    });

    socket.on('disconnect', function (data) {
      removeUserId(this.id);
      console.log(socket_list);
      console.log("user left ,%s , %s", data, this.id);
    });
  });
}

exports.emitSocket = emitSocket;
exports.noticeOrderList = noticeOrderList;
exports.app = app;
