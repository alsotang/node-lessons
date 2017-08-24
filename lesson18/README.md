# 《何为 connect 中间件》

## 目标

1. 理解中间件的概念
1. 了解 Connect 的实现


## 课程内容

1. 原生 httpServer 遇到的问题
1. 中间件思想
1. Connect 实现
1. Express 简介

这是从 httpServer 到 Express 的升级过程。

# HTTP

Nodejs 的经典 httpServer 代码

```js
var http = require('http');

var server = http.createServer(requestHandler);
function requestHandler(req, res) {
  res.end('hello visitor!');
}
server.listen(3000);
```

里面的函数 `requestHandler` 就是所有http请求的响应函数，即所有的请求都经过这个函数的处理，是所有请求的入口函数。

通过 requestHandler 函数我们能写一些简单的 http 逻辑，比如上面的例子，所有请求都返回 `hello visitor!`。

然而，我们的业务逻辑不可能这么简单。例如：需要实现一个接口，要做的是当请求过来时，先判断来源的请求是否包含请求体，然后判断请求体中的id是不是在数据库中存在，最后若存在则返回true，不存在则返回false。

```
1. 检测请求中请求体是否存在，若存在则解析请求体；
1. 查看请求体中的id是否存在，若存在则去数据库查询；
1. 根据数据库结果返回约定的值；
```

我们首先想到的，抽离函数，每个逻辑一个函数，简单好实现低耦合好维护。

实现代码:

```js
function parseBody(req, callback) {
  //根据http协议从req中解析body
  callback(null, body);
}
function checkIdInDatabase(body, callback) {
  //根据body.id在Database中检测，返回结果
  callback(null, dbResult);
}
function returnResult(dbResult, res) {
  if (dbResult && dbResult.length > 0) {
    res.end('true');
  } else {
    res.end('false')
  }
}
function requestHandler(req, res) {
  parseBody(req, function(err, body) {
    checkIdInDatabase(body, function(err, dbResult) {
      returnResult(dbResult, res);
    });
  });
}
```
上面的解决方案解决了包含三个步骤的业务问题，出现了3个 `});` 还有3个 `err` 需要处理，上面的写法可以得达到预期效果。

然而，业务逻辑越来越复杂，会出发展成30个回调逻辑，那么就出现了30个 `});` 及30个 `err`异常。更严重的是，到时候写代码根本看不清自己写的逻辑在30层中的哪一层，极其容易出现 **多次返回** 或返回地方不对等问题，这就是 **回调金字塔** 问题了。

大多数同学应该能想到解决回调金字塔的办法，朴灵的《深入浅出Node.js》里讲到的三种方法。下面列举了这三种方法加上ES6新增的Generator，共四种解决办法。

- [EventProxy](https://github.com/JacksonTian/eventproxy) —— 事件发布订阅模式(第四课讲到)
- [BlueBird](https://github.com/petkaantonov/bluebird) —— Promise方案(第十七课讲到)
- [Async](https://github.com/caolan/async) —— 异步流程控制库(第五课讲到)
- [Generator](http://es6.ruanyifeng.com/#docs/generator) —— ES6原生Generator

理论上，这四种都能解决回调金字塔问题。而Connect和Express用的是 `类似异步流程控制的思想` 。

<a name="next"></a>
关于异步流程控制库下面简要介绍下，或移步[@第五课](https://github.com/alsotang/node-lessons/tree/master/lesson5)。
异步流程控制库首先要求用户传入待执行的函数列表，记为funlist。流程控制库的任务是让这些函数 **顺序执行** 。

callback是控制顺序执行的关键，funlist里的函数每当调用callback会执行下一个funlist里的函数

我们动手实现一个类似的链式调用，其中 `funlist` 更名为 `middlewares`、`callback` 更名为 `next`，码如下：

<a name="middlewares" comment="middlewares锚点"></a>
```js
var middlewares = [
  function fun1(req, res, next) {
    parseBody(req, function(err, body) {
      if (err) return next(err);
      req.body = body;
      next();
    });
  },
  function fun2(req, res, next) {
    checkIdInDatabase(req.body.id, function(err, rows) {
      if (err) return next(err);
      res.dbResult = rows;
      next();
    });
  },
  function fun3(req, res, next) {
    if (res.dbResult && res.dbResult.length > 0) {
      res.end('true');
    }
    else {
      res.end('false');
    }
    next();
  }
]

function requestHandler(req, res) {
  var i=0;

  //由middlewares链式调用
  function next(err) {

    if (err) {
      return res.end('error:', err.toString());
    }

    if (i<middlewares.length) {
      middlewares[i++](req, res, next);
    } else {
      return ;
    }
  }

  //触发第一个middleware
  next();
}
```

上面用middlewares+next完成了业务逻辑的 `链式调用`，而middlewares里的每个函数，都是一个 `中间件`。

整体思路是：

1. 将所有 `处理逻辑函数(中间件)` 存储在一个list中；
1. 请求到达时 `循环调用` list中的 `处理逻辑函数(中间件)`；

# [Connect](https://github.com/senchalabs/connect)的实现

Connect的思想跟上面阐述的思想基本一样，先将处理逻辑存起来，然后循环调用。

Connect中主要有五个函数
PS: Connect的核心代码是200+行，建议对照<a href="https://github.com/senchalabs/connect/blob/master/index.js" target="_blank">源码</a>看下面的函数介绍。

|函数名         |作用                          |
| -------------|:----------------------------:|
|createServer  |包装httpServer形成app         |
|listen        |监听端口函数                   |
|use           |向middlewares里面放入业务逻辑   |
|handle        |上一章的requestHandler函数增强版|
|call          |业务逻辑的真正执行者            |

## createServer()

**输入**:

无

**执行过程**:

1. app是一个函数对象(包含handle方法)
1. app具有Event所有属性(详见[utils-merge](https://github.com/jaredhanson/utils-merge)，十行代码)
1. app有route属性(路由)、和stack属性(用于存储中间件，类似上面的[middlewares](#middlewares))

**输出**:

```
       app is function(req, res, next) {...};
        |
    +---+---+
    |  has  |
  route   stack
```

## app.use(route, fn)

作用是向stack中添加 `逻辑处理函数` (中间件)。

**输入**:

1. route 可省略，默认'/'
1. fn 具体的业务处理逻辑

**tips:**

上面的fn表示处理逻辑，它可以是

1. 一个普通的 `function(req,res[,next]){}`；
1. 一个[httpServer](https://lodejs.org/api/http.html#http_class_http_server)；
1. 另一个connect的app对象(**sub app特性**)；

由于它们的本质都是 `处理逻辑`，都可以用一个 `function(req,res,next){}`将它们概括起来，Connect把他们都转化为这个函数，然后把它们存起来。

如何将这三种分别转换为 function(req, res, next) {}的形式呢？

1. 不用转换；
1. httpServer的定义是“对事件'request'后handler的对象”，我们可以从httpServer.listeners('request')中得到这个函数；
1. 另一个connect对象，而connect()返回的app就是function(req, res, out) {}；


**执行过程**:

1. 将三种`处理逻辑`统一转换为`function(req,res,next){}`的形式表示。
2. 把这个`处理逻辑`与route一起，放入`stack`中(存储处理逻辑，route用来匹配路由)

核心代码片段

```js
//route是路由路径，handle是一个`function(req, res, next) {...}`形式的业务逻辑
this.stack.push({ route: path, handle: handle });
```

**返回**:

```js
//返回自己，可以完成链式调用
return this;
```

**总结:**:

```js
var app = connect();
app.use('/api', function(req, res, next) {});
```

等价于

```js
var app = connect();
app.stack.push({route: '/api', handle: function(req, res, next) {}});
```

最后，app.stack里 **顺序存储** 了所有的 **逻辑处理函数** (中间件)。

```js
app.stack = [function1, function2, function3, ... function30];
```

## app.handle(req, res, out)

这个函数就是请求到达时，负责 `顺序调用` 我们存储在stack中的 `逻辑处理函数` (中间件)函数，类似上一章的requestHandler。

**输入:**

1. req是Nodejs本身的可读流，不做过多介绍
1. res是Nodejs本身的可写流，不做过多介绍
1. out是为了Connect的 **sub app特性** 而设计的参数，这个特性可以暂时忽略，这个参数我们暂时不关心

**处理过程:**

可以回头看一下上面的[requestHandler函数](#middlewares)，handle的实现是这个函数的增强版

1. 取得stack(存储`逻辑处理函数`列表)，index(列表下标)
1. 构建next函数，next的作用是执行下一个`逻辑处理函数`
1. 触发第一个next，触发链式调用

**next函数实现:**

next函数实现在handle函数体内，用来`顺序执行处理逻辑`，它是异步流程控制库的核心，不明白它的作用请看[上面的异步流程控制库简介](#next)

path是请求路径，route是`逻辑处理函数`自带的属性。

1. 取得下一个`逻辑处理函数`;
1. 若路由不匹配，跳过此逻辑;
1. 若路由匹配[下面的call](#call)执行匹配到的`逻辑处理函数`

tips: 跟上一章最后的代码一样，每个`逻辑处理函数`调用`next`来让后面的函数执行，存储在stack中的函数就实现了`链式调用`。不一定所有的函数都在返回的时候才调用`next`，为了不影响效率，有的函数可能先调用next，然而自己还没有返回，继续做自己的事情。

核心代码：

```js
//取下一个逻辑逻辑处理函数
1:  var layer = stack[index++];
//不匹配时跳过
2:  if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
      return next(err);
    }
//匹配时执行
3:  call(layer.handle, route, err, req, res, next);
```

**返回:**

无

**总结:**

画图总结

```
request come
     |
     v
middleware1 :  不匹配路由，skip
     |
     v
middleware2 :  匹配路由，执行
     |
     v
middleware3 :  匹配路由，执行
     |
     v
middleware4 :  不匹配路由，skip
     |
     v
    end
```

<a name="call"></a>
## call(handle, route, err, req, res, next)

> 这里有个比较有趣的知识，`console.log(Function.length)`会返回函数定义的参数个数。值跟在函数体内执行`arguments.length`一样。

Connect中规定`function(err, req, res, next) {}`形式为错误处理函数，`function(req, res, next) {}`为正常的业务逻辑处理函数。那么，可以根据Function.length以判断它是否为错误处理函数。

**输入:**

|参数名 |描述            |
|------|:---------------:|
|handle|逻辑处理函数     |
|route |路由            |
|err   |是否发生过错误   |
|req   |Nodejs对象      |
|res   |Nodejs对象      |
|next  |next函数        |

**处理过程:**

1. 是否有错误，本次handle是否是错误处理函数;
2. 若有错误且handle为错误处理函数，则执行handle，本函数返回;
3. 若没错误且handle不是错误处理函数，则执行handle，本函数返回;
4. 如果上面两个都不满足，不执行handle，本函数调用next，返回;

**返回:**

无

**总结:**

call函数是一个执行者，根据当前`错误情况`和`handle类型`决定`是否执行`当前的handle。

## listen

创建一个httpServer，将Connect自己的业务逻辑作为requestHandler，监听端口

代码

```js
var server = http.createServer(this);
return server.listen.apply(server, arguments);
```

## 图解Connect

Connect将中间件存储在app.stack中，通过构造handle中的next函数在请求到来时依次调用这些中间件。

图形总结

```
request               app(out)
   |                          yes
   +------------------>match?----->middleware1
                         | no          |
                         v             |
                        next<----------+
                         |
                         v    yes
                      match?------>middleware2
                         | no          |
                         v             |
                        next<----------+
                         |
                         v    yes
                      match?------>middleware3
                         | no          |
                         v             |
                        out<-----------+
                         |
   +---------------------+
   |
   v
  end(response在处理过程中已经返回了)
```

## Connect的subapp特性

我们再看看Connect是怎么实现subapp的，比较有趣。

什么是subapp?

```
var sub_app = connect();
var app = connect();

app.use('/route1', sub_app);
// request path: '/route1/route2'
// 由app接收到请求后，切割 path为'/route2'转交给sub_app的处理逻辑处理
// 再由sub_app返回到app，由app继续向下执行处理逻辑
```

结合上面的函数画图

```
request               app(out1)                 sub_app(out2)
   |
   +--------------->middleware1     +------------>middleware1
                         |          |                 |
                        next        |                next
                         |          |                 |
                         v          |                 v
                    middleware2-----+            middleware2
                                                      |
                       next<--------+                next
                         |          |                 |
                         v          |                 v
                     middleware3    |            middleware3
                         |          |                 |
                         v          |                 v
                        out1        |                out2
                         |          |                 |
   +---------------------+          +-----------------+
   |
   v
  end(response在处理过程中已经返回了)
```

完成上面的sub_app只需要做到两点：

1. 从app的调用链进入到sub_app的调用链中;
2. 从sub_app的逻辑回到app的调用链中;

connect在handle函数中的第三个参数`out`为这个特性实现提供可能。`out`的特点是`在middlewares链式调用完成以后调用`。**那么将app的next作为sub_app的out传入sub_app的handle中**可以做到sub_app自己的业务逻辑处理完后调用`out`，即处理权回到了本app的`next`手里。

上面图中的`sub_app.out2===app.next`，所以能完成逻辑的交接和sub app调用。

# [Express](https://github.com/strongloop/express)
大家都知道Express是Connect的升级版。

Express不只是Connect的升级版，它还封装了很多对象来方便业务逻辑处理。Express里的Router是Connect的升级版。

Express大概可以分为几个模块

|模块        |描述                   |
|-----------|:---------------------:|
|router     |路由模块是Connect升级版  |
|request    |经过Express封装的req对象 |
|response   |经过Express封装的res对象 |
|application|app上面的各种默认设置     |

简要介绍一下每个模块

## Router

在Connect中间件特性的基础上，加入了如下特性，是Connect的升级版

1. 正则匹配route;
2. 进行将http的方法在route中分解开;

## Request

在Request中集成了http.IncomingMessage(可读流+事件)，并在其上增加了新的属性，方便使用，我们最常用的应该是
req.param。

## Response

在Response中集成了http.ServerResponse(可写流+事件)，并在其上增加了很多方便返回的函数，有我们熟悉的res.json、
res.render、res.redirect、res.sendFile等等。

我们可以拓展它写一个res.sendPersonInfoById。

>关于流的题外话：req.pipe(res)的形式可以“完成发什么就返回什么”，而req.pipe(mylogic).pipe(res)可以添加自己的逻辑，
我们的业务逻辑是把流读为String/Object再进行逻辑处理，处理完再推送给另一个stream，有没有可能在流的层面进行逻辑解
耦提供服务呢？求大神解答了…至少这种写法在大流量、逻辑简单的情况下是有用的。

## Application

除了上面的三个模块以外，还需要有个地方存储整个app的属性、设置等。比较常用的是app.engine函数设置模板引擎。

## Express小结

Express是一个中间件机制的httpServer框架，它本身实现了中间件机制，它也包含了中间件。比如3.x版本的Express
本身自带bodyParser、cookieSession等中间件，而在4.x中去掉了。包括TJ也写了很多中间件，比如node-querystring、
connect-redis等。

实现业务逻辑解耦时，中间件是从纵向的方面进行的逻辑分解，前面的中间件处理的结果可以给后面用，比如bodyParser把解析
body的结果放在req.body中，后面的逻辑都可以从req.body中取值。由于中间件是顺序执行的，errHandler一般都放在最后，而log类的中间件则放在比较前面。

# 总结

Connect用流程控制库的回调函数及中间件的思想来解耦回调逻辑；
[Koa](https://github.com/koajs/koa)用Generator方法解决回调问题；

我们应该也可以用事件、Promise的方式实现；

PS: 用事件来实现的话还挺期待的，能形成网状的相互调用。
