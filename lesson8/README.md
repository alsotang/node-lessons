# 《测试用例：supertest》

## 目标

建立一个 lesson8 项目，在其中编写代码。

app.js: 其中有个 fibonacci 接口。fibonacci 的介绍见：http://en.wikipedia.org/wiki/Fibonacci_number 。

fibonacci 函数的定义为 `int fibonacci(int n)`，调用函数的路径是 '/fib?n=10'，然后这个接口会返回 '55'。函数的行为定义如下：

* 当 n === 0 时，返回 0；n === 1时，返回 1;
* n > 1 时，返回 `fibonacci(n) === fibonacci(n-1) + fibonacci(n-2)`，如 `fibonacci(10) === 55`;
* n 不可大于10，否则抛错，http status 500，因为 Node.js 的计算性能没那么强。
* n 也不可小于 0，否则抛错，500，因为没意义。
* n 不为数字时，抛错，500。

test/main.test.js: 对 app 的接口进行测试，覆盖以上所有情况。

## 知识点

1. 学习 supertest 的使用 (https://github.com/visionmedia/supertest )
2. 复习 mocha，should 的使用

## 课程内容

这是连续第三节课讲测试了..我自己都烦..看着烦的可以考虑跳下一课。

OK，基础知识前面都讲得很多了，这节课我不会事无巨细地写过程了。

噢，对了，说到 fibonacci，Node 中文圈的大神 @苏千(https://github.com/fengmk2 ) 写过一个页面，对各种语言的 fibonacci 效率进行了测试：http://fengmk2.cnpmjs.org/blog/2011/fibonacci/nodejs-python-php-ruby-lua.html 。其中，Node 的表现不知道比 Python 和 Ruby 高到哪里去了，与 CPU 谈笑风生。怀疑 js 的人啊，都 too simple，sometimes naive。

先来介绍一下 supertest。supertest 是 superagent 的孪生库。他的作者叫 tj，这是个在 Node.js 的历史上会永远被记住的名字，因为他一个人撑起了 npm 的半边天。别误会成他是 npm 的开发者，他的贡献是在 Node.js 的方方面面都贡献了非常高质量和口碑的库，比如 mocha 是他的，superagent 是他的，express 是他的，should 也是他的，还有其他很多很多，比如 koa，都是他的。如果你更详细点了解一些 Node 圈内的八卦，一定也会像我一样对 tj 佩服得五体投地。他的 github 首页是：https://github.com/visionmedia 。

假使你作为一个有志之士，想要以他为榜样，跟随他前进的步伐，那么我指条明路给你，不收费的：http://tour.golang.org/

为什么说 supertest 是 superagent 的孪生库呢，因为他们的 API 是一模一样的。superagent 是用来抓取页面用的，而 supertest，是专门用来配合 express （准确来说是所有兼容 connect 的 web 框架）进行集成测试的。

将使你有一个 app: `var app = express();`，想对它的 get 啊，post 接口啊之类的进行测试，那么只要把它传给 supertest：`var request = require('supertest')(app)`。之后调用 `requset.get('/path')` 时，就可以对 app 的 path 路径进行访问了。它的 API 参照 superagent 的来就好了：http://visionmedia.github.io/superagent/ 。

我们来新建一个项目

```shell
$ npm init # ..一阵乱填
```

然后安装我们的依赖（记得去弄清楚 `npm i --save` 与 `npm i --save-dev` 的区别）：

```js
  "devDependencies": {
    "mocha": "^1.21.4",
    "should": "^4.0.4",
    "supertest": "^0.14.0"
  },
  "dependencies": {
    "express": "^4.9.6"
  }
```

接着，编写 app.js

```js
var express = require('express');

// 与之前一样
var fibonacci = function (n) {
  // typeof NaN === 'number' 是成立的，所以要判断 NaN
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error('n should be a Number');
  }
  if (n < 0) {
    throw new Error('n should >= 0')
  }
  if (n > 10) {
    throw new Error('n should <= 10');
  }
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }

  return fibonacci(n-1) + fibonacci(n-2);
};
// END 与之前一样

var app = express();

app.get('/fib', function (req, res) {
  // http 传来的东西默认都是没有类型的，都是 String，所以我们要手动转换类型
  var n = Number(req.query.n);
  try {
    // 为何使用 String 做类型转换，是因为如果你直接给个数字给 res.send 的话，
    // 它会当成是你给了它一个 http 状态码，所以我们明确给 String
    res.send(String(fibonacci(n)));
  } catch (e) {
    // 如果 fibonacci 抛错的话，错误信息会记录在 err 对象的 .message 属性中。
    // 拓展阅读：https://www.joyent.com/developers/node/design/errors
    res
      .status(500)
      .send(e.message);
  }
});

// 暴露 app 出去。module.exports 与 exports 的区别请看《深入浅出 Node.js》
module.exports = app;

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
```

好了，启动一下看看。

```shell
$ node app.js
```

然后访问 `http://localhost:3000/fib?n=10`，看到 55 就说明启动成功了。再访问 `http://localhost:3000/fib?n=111`，会看到 `n should <= 10`。

对了，大家去装个 `nodemon` https://github.com/remy/nodemon 。

`$ npm i -g nodemon`

这个库是专门调试时候使用的，它会自动检测 node.js 代码的改动，然后帮你自动重启应用。在调试时可以完全用 nodemon 命令代替 node 命令。

`$ nodemon app.js` 启动我们的应用试试，然后随便改两行代码，就可以看到 nodemon 帮我们重启应用了。

那么 app 写完了，接着开始测试，测试代码在 test/app.test.js。

```js
var app = require('../app');
var supertest = require('supertest');
// 看下面这句，这是关键一句。得到的 request 对象可以直接按照
// superagent 的 API 进行调用
var request = supertest(app);

var should = require('should');

describe('test/app.test.js', function () {
  // 我们的第一个测试用例，好好理解一下
  it('should return 55 when n is 10', function (done) {
    // 之所以这个测试的 function 要接受一个 done 函数，是因为我们的测试内容
    // 涉及了异步调用，而 mocha 是无法感知异步调用完成的。所以我们主动接受它提供
    // 的 done 函数，在测试完毕时，自行调用一下，以示结束。
    // mocha 可以感到到我们的测试函数是否接受 done 参数。js 中，function
    // 对象是有长度的，它的长度由它的参数数量决定
    // (function (a, b, c, d) {}).length === 4
    // 所以 mocha 通过我们测试函数的长度就可以确定我们是否是异步测试。

    request.get('/fib')
    // .query 方法用来传 querystring，.send 方法用来传 body。
    // 它们都可以传 Object 对象进去。
    // 在这里，我们等于访问的是 /fib?n=10
      .query({n: 10})
      .end(function (err, res) {
        // 由于 http 返回的是 String，所以我要传入 '55'。
        res.text.should.equal('55');

        // done(err) 这种用法写起来很鸡肋，是因为偷懒不想测 err 的值
        // 如果勤快点，这里应该写成
        /*
        should.not.exist(err);
        res.text.should.equal('55');
        */
        done(err);
      });
  });

  // 下面我们对于各种边界条件都进行测试，由于它们的代码雷同，
  // 所以我抽象出来了一个 testFib 方法。
  var testFib = function (n, expect, done) {
    request.get('/fib')
      .query({n: n})
      .end(function (err, res) {
        res.text.should.equal(expect);
        done(err);
      });
  };
  it('should return 0 when n === 0', function (done) {
    testFib(0, '0', done);
  });

  it('should equal 1 when n === 1', function (done) {
    testFib(1, '1', done);
  });

  it('should equal 55 when n === 10', function (done) {
    testFib(10, '55', done);
  });

  it('should throw when n > 10', function (done) {
    testFib(11, 'n should <= 10', done);
  });

  it('should throw when n < 0', function (done) {
    testFib(-1, 'n should >= 0', done);
  });

  it('should throw when n isnt Number', function (done) {
    testFib('good', 'n should be a Number', done);
  });

  // 单独测试一下返回码 500
  it('should status 500 when error', function (done) {
    request.get('/fib')
      .query({n: 100})
      .end(function (err, res) {
        res.status.should.equal(500);
        done(err);
      });
  });
});
```

完。

## 关于 cookie 持久化

有两种思路

1. 在 supertest 中，可以通过 `var agent = supertest.agent(app)` 获取一个 agent 对象，这个对象的 API 跟直接在 superagent 上调用各种方法是一样的。agent 对象在被多次调用 `get` 和 `post` 之后，可以一路把 cookie 都保存下来。

    ```js
    var supertest = require('supertest');
    var app = express();
    var agent = superagent.agent(app);

    agent.post('login').end(...);
    // then ..
    agent.post('create_topic').end(...); // 此时的 agent 中有用户登陆后的 cookie

    ```

2. 在发起请求时，调用 `.set('Cookie', 'a cookie string')` 这样的方式。

    ```js
    var supertest = require('supertest');
    var userCookie;
    supertest.post('login').end(function (err, res) {
        userCookie = res.headres['Cookie']
      });
    // then ..

    supertest.post('create_topic')
      .set('Cookie', userCookie)
      .end(...)
    ```

这里有个相关讨论：https://github.com/visionmedia/supertest/issues/46

## 拓展学习

Nodeclub 里面的测试使用的技术跟前面介绍的是一样的，should mocha supertest 那套，应该是很容易看懂的:

https://github.com/cnodejs/nodeclub/blob/master/test/controllers/topic.test.js


