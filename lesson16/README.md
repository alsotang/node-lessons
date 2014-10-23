#cookie 和 session

HTTP 是一个无状态协议，所以客户端每次发出请求时，下一次请求无法得知上一次请求产生的一些数据，如何能把一个用户请求的数据关联起来呢？
###cookie

首先产生了 cookie 技术来解决这个问题，cookie 的处理分为如下几步：

- 服务器向客户端发送 cookie。
  - 通常使用 HTTP 协议规定的 set-cookie 头操作。
  - 规定设置 cookie 的格式为 name = value 格式，且必须包含这部分。
- 浏览器将 cookie 保存。
- 每次请求浏览器都会将 cookie 发向服务器。

其他可选的 cookie 参数会影响将 cookie 发送给服务器端的过程，主要有以下几种：

- path：表示 cookie 影响到的路径，匹配该路径才发送这个 cookie。
- expires 和 maxAge：告诉浏览器这个 cookie 什么时候过期，expires 是 UTC 格式时间，maxAge 是 cookie 多久后过期的相对时间。
- secure：当 secure 值为 true 时，在 HTTP 中是无效的，在 HTTPS 中才有效。
- httpOnly：浏览器不允许脚本 document.cookie 去更改 cookie。

express 在4.xx版本之后，session管理和cookies等许多模块都不再直接包含在express中，而是需要单独下载添加。

express 中 cookie 使用 `cookie-parser` 模块。

```
var express = require('express');
// 首先引入 cookie-parser 这个模块
var cookieParser = require('cookie-parser');

var app = express();
app.listen(3000);

// 使用 cookieParser 中间件，cookieParser(secret, options)
// 其中 secret 用来加密 cookie 字符串，也可以在 options 中选该项参数
// options 传入上面介绍的 cookie 可选参数
app.use(cookieParser());

app.get('/', function (req, res) {
  // 如果请求中的 cookie 存在 isVisit, 则输出 cookie
  // 否则，设置 cookie 字段 isVisit, 并设置过期时间为1分钟
  if(req.cookies.isVisit) {
    console.log(req.cookies);
    res.send("再次欢迎访问");
  } else {
    res.cookie('isVisit', 1, {maxAge: 60 * 1000});
    res.send("欢迎第一次访问");
  }
});
```
### session
cookie 虽然很方便，但是使用 cookie 有一个很大的弊端，cookie 中的所有数据在客户端就可以被修改，数据非常容易被伪造，那么一些重要的数据就不能存放在 cookie 中了，而且如果cookie 中数据字段太多会影响性能。为了解决这些问题，就产生了 session，session 中的数据只保留在服务器端。

session 的运行通过一个重要的标识 session_id 来进行的。session_id 通常是存放在客户端的 cookie 中，当请求到来时，检查 cookie 中保存的 id 并通过这个 id 与服务器端的session 关联起来，进行数据的保存和修改。session_id 也可以通过 get post 参数，或者 url 参数传递。

session 则可以存放在内存、redis 或 Memcached 高速缓存，或者放在数据库中。

express 中使用 session 要用到 `express-session` 这个模块，主要的方法就是session(options)，其中options为可选参数，主要有：

- name: 设置 cookie 的名称，默认为 connect.sid 。
- store: session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。
- secret: 通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 cookie 唯一，这样可以防止被篡改。 
- cookie: 设置存放 session id 的 cookie，默认为
  - (default: { path: '/', httpOnly: true, secure: false, maxAge: null }) 
- genid: 回调来产生一个新的 session id， 默认使用 uid2。
- rolling: 每个请求都重新设置一个 cookie，默认为 false。
- resave: 即使 session 没有被修改，也保存 session 值，默认为 true。
- proxy: 设置反向代理用，默认为 undefined。
- saveUninitialized: 当新建立一个会话但未修改时，不对会话进行初始化，这样可以减少服务器内存消耗，默认为 true。

1） 在内存中存储 session

```
var express = require('express');
// 首先引入 express-session 这个模块
var session = require('express-session');

var app = express();
app.listen(5000);

// 按照上面的解释，设置 session 的可选参数
app.use(session({
  secret: 'mytoken',
  cookie: { maxAge: 60 * 1000 }
}));

app.get('/', function (req, res) {
  
  // 检查 session 中的 isVisit 字段
  // 如果存在则增加一次，否则为 session 设置 isVisit 字段，并初始化为 1。
  if(req.session.isVisit) {
    req.session.isVisit++;
    res.send('<p>第 ' + req.session.isVisit + '次来此页面</p>');
  } else {
    req.session.isVisit = 1;
    res.send("欢迎第一次来这里");
    console.log(req.session);
  }
});
```

2） 在 redis 中存储 session

大量的 session 放在内存中会影响性能，因此可以使用高速缓存来存储 session，据说在 redis 中缓存马上变得高大上了，需要用到 connect-redis 模块来连接 redis，然后在 session 中设置存储方式为 redis。

```
var express = require('express');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var app = express();
app.listen(5000);

app.use(session({
  store: new redisStore(),
  secret: 'somesecrettoken'
}));

app.get('/', function (req, res) {
  if(req.session.isVisit) {
    req.session.isVisit++;
    res.send('<p>第 ' + req.session.isVisit + '次来到此页面</p>');
  } else {
    req.session.isVisit = 1;
    res.send('欢迎第一次来这里');
  }
});
```

我们可以运行 `redis-cli` 查看结果，如图可以看到 redis 中缓存结果。

![](https://github.com/Ricardo-Li/node-lessons/blob/master/lesson16/1.png)
