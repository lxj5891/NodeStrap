/**
 * config
 */

var path = require('path');

exports.config = {
  debug: true,
  name: 'Node Club',
  description: 'Node Club 是用Node.js开发的社区软件',
  version: '0.2.2',

  // site settings
  site_headers: [
    '<meta name="author" content="EDP@TAOBAO" />',
  ],
  host: 'localhost.cnodejs.org',
  site_logo: '', // default is `name`
  site_navs: [
    // [ path, title, [target=''] ]
    [ '/about', '关于' ],
  ],
  site_static_host: '', // 静态文件存储域名
  mini_assets: false, // 静态文件的合并压缩，详见视图中的Loader
  site_enable_search_preview: false, // 开启google search preview
  site_google_search_domain: '91qcheng.com',  // google search preview中要搜索的域名

  upload_dir: path.join(__dirname, 'public', 'user_data', 'images'),

//  db: 'mongodb://121.199.13.143/qcheng',
//  db: 'mongodb://www.haozi11.com/vote',
  session_secret: 'starp.sid',
  auth_cookie_name: 'starp.sid',
  port: 8080,

  // 话题列表显示的话题数量
  list_topic_count: 20,

  // 限制发帖时间间隔，单位：毫秒
  post_interval: 10000,

  // RSS
  rss: {
    title: 'CNode：Node.js专业中文社区',
    link: 'http://cnodejs.org',
    language: 'zh-cn',
    description: 'CNode：Node.js专业中文社区',

    //最多获取的RSS Item数量
    max_rss_items: 50
  },

  // site links
  site_links: [
    {
      'text': 'Node 官方网站',
      'url': 'http://nodejs.org/'
    },
    {
      'text': 'Node Party',
      'url': 'http://party.cnodejs.net/'
    },
    {
      'text': 'Node 入门',
      'url': 'http://nodebeginner.org/index-zh-cn.html'
    },
    {
      'text': 'Node 中文文档',
      'url': 'http://docs.cnodejs.net/cman/'
    }
  ],

  // sidebar ads
  side_ads: [
    {
      'url': 'http://www.upyun.com/?utm_source=nodejs&utm_medium=link&utm_campaign=upyun&md=nodejs',
      'image': 'http://site-cnode.b0.upaiyun.com/images/upyun_logo.png',
      'text': ''
    },
    {
      'url': 'http://ruby-china.org/?utm_source=nodejs&utm_medium=link&utm_campaign=upyun&md=nodejs',
      'image': 'http://site-cnode.b0.upaiyun.com/images/ruby_china_logo.png',
      'text': ''
    },
    {
      'url': 'http://adc.taobao.com/',
      'image': 'http://adc.taobao.com/bundles/devcarnival/images/d2_180x250.jpg',
      'text': ''
    }
  ],

  // mail SMTP
  mail_opts: {
    host: 'mail.91qcheng.com',
    port: 25,
    auth: {
      user: 'test01',
      pass: 'test1234'
    }
  },

  //weibo app key
  weibo_key: 10000000,

  // admin 可删除话题，编辑标签，设某人为达人
  admins: { admin: true, "11": true},

  // [ { name: 'plugin_name', options: { ... }, ... ]
  plugins: [
    // { name: 'onehost', options: { host: 'localhost.cnodejs.org' } },
    // { name: 'wordpress_redirect', options: {} }
  ]
};
