# 《学习使用外部模块》

## 目标

建立一个 lesson2 项目，在其中编写代码。

当在浏览器中访问 `http://localhost:3000/?q=alsotang` 时，输出 `alsotang` 的 md5 值，即 `bdd5e57b5c0040f9dc23d430846e68a3`。

## 挑战

访问 `http://localhost:3000/?q=alsotang` 时，输出 `alsotang` 的 sha1 值，即 `e3c766d71667567e18f77869c65cd62f6a1b9ab9`。

## 知识点

1. 学习 req.query 的用法
2. 学习建立 package.json 来管理 Node.js 项目。

## 课程内容

卧槽，不写 package.json 就写项目我觉得好不爽啊，所以这个 lesson2 我就得跟大家介绍一下 package.json 这个文件的用法了。

简单说来呢，这个 package.json 文件就是定义了项目的各种元信息，包括项目的名称，git repo 的地址，作者等等。最重要的是，其中定义了我们项目的依赖，这样这个项目在部署时，我们就不必将 `node_modules` 目录也上传到服务器，服务器在拿到我们的项目时，只需要执行 `npm install`，则 npm 会自动读取 package.json 中的依赖并安装在项目的 `node_modules` 下面，然后程序就可以在服务器上跑起来了。

本课程的每个 lesson 里面的示例代码都会带上一份 package.json，大家可以去看看它的大概样子。

我们来新建一个 lesson2 项目，并生成一份它的 package.json。

```
$ mkdir lesson2 && cd lesson2
$ npm init
```

OK，这时会要求我们输入一些信息，乱填就好了，反正这个地方也不用填依赖关系。

`npm init` 这个命令的作用就是帮我们互动式地生成一份最简单的 package.json 文件，`init` 是 `initialize` 的意思，初始化。

当乱填信息完毕之后，我们的目录下就会有个 package.json 文件了。

这时我们来安装依赖，这次的应用，我们依赖 `express` 和 `utility` 两个模块。

`$ npm install express utility --save`

这次的安装命令与上节课的命令有两点不同，一是没有指定 registry，没有指定的情况下，默认从 npm 官方安装，上次我们是从淘宝的源安装的。二是多了个 `--save` 参数，这个参数的作用，就是会在你安装依赖的同时，自动把这些依赖写入 package.json。命令执行完成之后，查看 package.json，会发现多了一个 `dependencies` 字段，如下图：

![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson2/1.png)

这时查看 `node_modules` 目录，会发现有两个文件夹，分别是 express 和 utility

![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson2/2.png)

我们开始写应用层的代码，建立一个 `app.js` 文件，复制以下代码进去：

```js
// 引入依赖
var express = require('express');
var utility = require('utility');

// 建立 express 实例
var app = express();

app.get('/', function (req, res) {
  // 从 req.query 中取出我们的 q 参数。
  // 如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 https://github.com/expressjs/body-parser 这个中间件才会处理，这个后面会讲到。
  // 如果分不清什么是 query，什么是 body 的话，那就需要补一下 http 的知识了
  var q = req.query.q;

  // 调用 utility.md5 方法，得到 md5 之后的值
  // 之所以使用 utility 这个库来生成 md5 值，其实只是习惯问题。每个人都有自己习惯的技术堆栈，
  // 我刚入职阿里的时候跟着苏千和朴灵混，所以也混到了不少他们的技术堆栈，仅此而已。
  // utility 的 github 地址：https://github.com/node-modules/utility
  // 里面定义了很多常用且比较杂的辅助方法，可以去看看
  var md5Value = utility.md5(q);

  res.send(md5Value);
});

app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});

```

OK，运行我们的程序

`$ node app.js`

访问 `http://localhost:3000/?q=alsotang`，完成。

## 题外话

如果直接访问 `http://localhost:3000/` 会抛错

![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson2/3.png)

可以看到，这个错误是从 `crypto.js` 中抛出的。

这是因为，当我们不传入 `q` 参数时，`req.query.q` 取到的值是 `undefined`，`utility.md5` 直接使用了这个空值，导致下层的 `crypto` 抛错。


