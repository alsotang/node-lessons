《使用 eventproxy 控制并发》
=

目标
==

建立一个 lesson4 项目，在其中编写代码。

代码的入口是 `app.js`，当调用 `node app.js` 时，它会输出 CNode(https://cnodejs.org/ ) 社区首页的所有主题的标题，链接和第一条评论，以 json 的格式。

输出示例：

```js
{
  "data": [
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
}

```

知识点
==

1. 体会 Node.js 的 callback hell 之美
2. 学习使用 eventproxy 这一利器控制并发

课程内容
==

这一章我们来到了 Node.js 最牛逼的地方——异步并发的内容了。

上一课我们介绍了如何使用 superagent 和 cheerio 来取主页内容，那只需要发起一次 http get 请求就能办到。但这次，我们需要取出每个主题的第一条评论，这就要求我们对每个主题的链接发起请求，并用 cheerio 去取出其中的第一条评论。

CNode 目前每一页有 40 个主题，于是我们就需要发起 1 + 40 个请求，来达到我们这一课的目标。

后者的 40 个请求，我们并发地发起：），而且不会遇到多线程啊锁什么的，Node.js 的并发模型跟多线程不同，抛却那些观念。更具体一点的话，比如异步到底为何异步，Node.js 为何单线程却能并发这类问题，我就不打算讲了。这方面我本来也不懂，我写 Node.js 只是为了混口饭求生存而已啊！对于这方面有兴趣的同学，强烈推荐 @朴灵 的 《九浅一深Node.js》： http://book.douban.com/subject/25768396/ 。
