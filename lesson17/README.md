# 《使用 promise 替代回调函数》

## 目标

建立一个 lesson5 项目，在其中编写代码。

代码的入口是 `app.js`，当调用 `node app.js` 时，它会输出 CNode(https://cnodejs.org/ ) 社区首页的所有主题的标题，链接和第一条评论，以 json 的格式。

注意：与上节课不同，并发连接数需要控制在 5 个。

输出示例：

```js
[
  {
    "title": "【公告】发招聘帖的同学留意一下这里",
    "href": "http://cnodejs.org/topic/541ed2d05e28155f24676a12",
    "comment1": "呵呵呵呵"
  },
  {
    "title": "发布一款 Sublime Text 下的 JavaScript 语法高亮插件",
    "href": "http://cnodejs.org/topic/54207e2efffeb6de3d61f68f",
    "comment1": "沙发！"
  }
]
```

## 知识点

1. 理解 Promise 概念，为什么需要 promise
1. 学习 q 的API，利用 q 来替代回调函数

## 课程内容

第五课讲述了如何使用 async 来控制并发。async的本质是一个流程控制。其实在异步编程中，还有一个更为经典的模型，叫做Promise/Deferred模式。本节我们就来学习这个模型的代表实现[q](https://github.com/kriskowal/q)

首先，我们思考一个典型的异步编程模型，考虑这样一个题目：读取一个文件，在控制台输出这个文件内容。

```js
var fs = require('fs');
fs.readFile('sample.txt','utf8',function(err,data){
	console.log(data);
})
```

看起来很简单，再进一步: 读取两个文件，在控制台输出这两个文件内容。

```js
var fs = require('fs');
fs.readFile('sample01.txt','utf8',function(err,data){
	console.log(data);
	fs.readFile('sample02.txt','utf8',function(err,data){
		console.log(data);
	})
});
```

要是读取更多的文件呢?

```js
var fs = require('fs');
fs.readFile('sample01.txt','utf8',function(err,data){
	fs.readFile('sample02.txt','utf8',function(err,data){
		fs.readFile('sample03.txt','utf8',function(err,data){
			fs.readFile('sample04.txt','utf8',function(err,data){
			
			})
		})
	})
})
```


这次我们要介绍的是 async 的 `mapLimit(arr, limit, iterator, callback)` 接口。另外，还有个常用的控制并发连接数的接口是 `queue(worker, concurrency)`，大家可以去 https://github.com/caolan/async#queueworker-concurrency 看看说明。

这回我就不带大家爬网站了，我们来专注知识点：并发连接数控制。

对了，还有个问题是，什么时候用 eventproxy，什么时候使用 async 呢？它们不都是用来做异步流程控制的吗？

我的答案是：

当你需要去多个源(一般是小于 10 个)汇总数据的时候，用 eventproxy 方便；当你需要用到队列，需要控制并发数，或者你喜欢函数式编程思维时，使用 async。大部分场景是前者，所以我个人大部分时间是用 eventproxy 的。

正题开始。

首先，我们伪造一个 `fetchUrl(url, callback)` 函数，这个函数的作用就是，当你通过

```js
fetchUrl('http://www.baidu.com', function (err, content) {
  // do something with `content`
});
```

调用它时，它会返回 `http://www.baidu.com` 的页面内容回来。

当然，我们这里的返回内容是假的，返回延时是随机的。并且在它被调用时，会告诉你它现在一共被多少个地方并发调用着。

```js
// 并发连接数的计数器
var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  // delay 的值在 2000 以内，是个随机的整数
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
  concurrencyCount++;
  console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
  setTimeout(function () {
    concurrencyCount--;
    callback(null, url + ' html content');
  }, delay);
};
```

我们接着来伪造一组链接

```js
var urls = [];
for(var i = 0; i < 30; i++) {
  urls.push('http://datasource_' + i);
}
```

这组链接的长这样：

![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson5/1.png)

接着，我们使用 `async.mapLimit` 来并发抓取，并获取结果。

```js
async.mapLimit(urls, 5, function (url, callback) {
  fetchUrl(url, callback);
}, function (err, result) {
  console.log('final:');
  console.log(result);
});
```

运行输出是这样的：

![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson5/2.png)

可以看到，一开始，并发链接数是从 1 开始增长的，增长到 5 时，就不再增加。当其中有任务完成时，再继续抓取。并发连接数始终控制在 5 个。

完整代码请参见 app.js 文件。




