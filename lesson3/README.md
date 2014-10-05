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
