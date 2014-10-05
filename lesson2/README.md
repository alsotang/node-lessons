《学习使用外部模块》
=

目标
==

建立一个 lesson2 项目，在其中编写代码。

当在浏览器中访问 `http://localhost:3000/?q=alsotang` 时，输出`alsotang`的 md5 值，即 `bdd5e57b5c0040f9dc23d430846e68a3`。

知识点
==

1. 学习 req.query 的用法
2. 学习建立 package.json 来管理 Node.js 项目。

课程内容
==

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

这次的安装命令与上节课的命令有两点不同，一是没有指定 registry，没有指定的情况下，默认从 npm 官方安装，上次我们是从淘宝的源安装的。二是多了个 `--save` 参数，这个参数的作用，就是会在你安装依赖的同时，自动把这些依赖写入 package.json。命令执行完成之后，查看 package.json，会发现多了一个字段，如下图：


