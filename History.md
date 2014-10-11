0.1.1 / 2013-10-22
==================
wget -O /etc/yum.repos.d/epel-erlang.repo http://repos.fedorapeople.org/repos/peter/erlang/epel-erlang.repo
yum install erlang
rpm --import http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.2.0/rabbitmq-server-3.2.0-1.noarch.rpm
yum install rabbitmq-server-3.2.0-1.noarch.rpm
rabbitmq-plugins enable rabbitmq_management
service rabbitmq-server start

0.1.1 / 2013-10-22
==================

[13-10-22 下午5:22:50] 王森森:
ssh -f -N -g -L 11111:10.2.8.132:80 root@10.2.8.132
 端口转发   可以将远端服务器一个端口remote_port绑定到本地端口port，
其中

-C是进行数据压缩，-是后台操作，只有当提示用户名密码的时候才转向前台。
-N是不执行远端命令，在只是端口转发时这条命令很有用处。
-g 是允许远端主机连接本地转发端口。
-R表明是将远端主机端口映射到本地端口。如果是
-L，则是将本地端口映射到远端主机端口。

ssh的三个强大的端口转发命令：
转发到远端：ssh -C -f -N -g -L 本地端口:目标IP:目标端口 用户名@目标IP
转发到本地：ssh -C -f -N -g –R 本地端口:目标IP:目标端口 用户名@目标IP
[13-10-22 下午5:23:01] 王森森: http://qubaoquan.blog.51cto.com/1246748/292497

0.1.1 / 2013-10-08
==================

https://github.com/island205/HelloSea.js

https://github.com/loicfrering/backbone.datagrid

https://github.com/Swiftam/book-node-mongodb-backbone


0.1.1 / 2013-09-28
==================
http://se77en.cc/2013/06/27/goodbye-node-forever-hello-pm2-translation/

0.1.1 / 2013-09-27
==================

http://nodejs.org/api/domain.html#domain_warning_don_t_ignore_errors
IE CSS Bug系列：IE6中Min-Height的解决办法
http://blog.jobbole.com/48706/

毫秒必争，前端网页性能最佳实践
http://blog.jobbole.com/48746/

NodeJs  安装
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

0.1.1 / 2013-09-23
==================
forever start -l /opt/yukari/YUKARiWeb/logs/forever.log -o /opt/yukari/YUKARiWeb/logs/out.log -e /opt/yukari/YUKARiWeb/logs/err.log -a --sourceDir /opt/yukari/YUKARiWeb/ app.js

forever start -l /opt/NodeStrap/logs/forever.log -o /opt/NodeStrap/logs/out.log -e /opt/NodeStrap/logs/err.log -a --sourceDir /opt/NodeStrap/ app.js

forever start -l /opt/qcheng/logs/forever.log -o /opt/qcheng/logs/out.log -e /opt/qcheng/logs/err.log -a --sourceDir /opt/qcheng/ app.js

forever start -l /opt/ShotEyesWeb/logs/forever.log -o /opt/ShotEyesWeb/logs/out.log -e /opt/ShotEyesWeb/logs/err.log -a --sourceDir /opt/ShotEyesWeb/ app.js

forever start -l /opt/TribeWeb/logs/forever.log -o /opt/TribeWeb/logs/out.log -e /opt/TribeWeb/logs/err.log -a --sourceDir /opt/TribeWeb/ app.js

var mongoose = require('mongoose');

var dbconf = process.env['TEST'] ? require('config').testdb : require('config').db;

mongoose.connect(dbconf, function (err) {
  if (err) {
    console.error('connect to %s error: %s', dbconf, err.message);
    process.exit(1);
  }
});

0.1.1 / 2013-09-22
==================

初始化GIT
服务器：
git --bare init
[receive]
        denyCurrentBranch = ignore
客户端：
git init
git add README
git commit -m "first commit"
git remote add origin root@10.2.8.224:/opt/git/MenuBook.git
git remote add origin root@static.91qcheng.com:/git/NodeStrap.git
git push -u origin master

git clone root@115.28.210.254:/opt/git/shop

git remote add origin http://git.oschina.net/lxj5891/DishBoy.git