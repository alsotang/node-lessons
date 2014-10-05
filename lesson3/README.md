《使用 superagent 与 cheerio 完成简单爬虫》
=

目标
==

建立一个 lesson3 项目，在其中编写代码。

当在浏览器中访问 `http://localhost:3000/` 时，输出 CNode(https://cnodejs.org/ ) 社区首页的所有帖子标题和链接，以 json 的形式。

输出示例：

```js
{
  "data": [
    {
      "title": "【公告】发招聘帖的同学留意一下这里",
      "href": "http://cnodejs.org/topic/541ed2d05e28155f24676a12"
    },
    {
      "title": "发布一款 Sublime Text 下的 JavaScript 语法高亮插件",
      "href": "http://cnodejs.org/topic/54207e2efffeb6de3d61f68f"
    }
  ]
}

```

知识点
==

1. 学习使用 superagent 抓取网页
2. 学习使用 cheerio 分析网页

课程内容
==

Node.js 总是吹牛逼说自己异步特性多么多么厉害，但是对于初学者来说，要找一个能好好利用异步的场景不容易。我想来想去，爬虫的场景就比较适合，没事爬几个网站玩玩。

本来想教大家怎么爬 github 的 api 的，但是 github 有 rate limit 的限制，所以只好牺牲一下 CNode 社区（国内最专业的 Node.js 开源技术社区），教大家怎么去爬它了。
