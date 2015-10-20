# 《线上部署：heroku》

## 目标

将 https://github.com/Ricardo-Li/node-practice-2 (这个项目已经被删了。参照 https://github.com/alsotang/node-lessons/tree/master/lesson3 的代码自己操作一下吧。)这个项目部署上 heroku，成为一个线上项目

我部署的在这里 http://serene-falls-9294.herokuapp.com/

## 知识点

1. 学习 heroku 的线上部署(https://www.heroku.com/ )

## 课程内容

### 什么是 heroku

heroku 是弄 ruby 的 paas 起家，现在支持多种语言环境，更甚的是它强大的 add-on 服务。

paas 平台相信大家都不陌生。Google 有 gae，国内新浪有 sae。paas 平台相对 vps 来说，不需要你配置服务器，不需要装数据库，也不需要理会负载均衡。这一切都可以在平台上直接获取。

你只要专注自己的业务，把应用的逻辑写好，然后发布上去，应用自然就上线了。数据库方面，如果你用 mysql，那么你可以从平台商那里得到一个 mysql 的地址、账号和密码，直接连接就能用。如果应用的流量增大，需要横向拓展，则只用去到 paas 平台的管理页面，增大服务器实例的数量即可，负载均衡会自动帮你完成。

说起来，我之所以对于 web 开发产生兴趣也是因为当年 gae 的关系。那时候除了 gae 之外，没有别的 paas 平台，gae 是横空出世的。有款翻墙的软件，叫 gappproxy(https://code.google.com/p/gappproxy/ )——可以认为是 goagent 的前身——就是搭建在 gae 上面的，不仅快，而且免费。于是我就很想弄懂这样一个程序是如何开发的。好在 gappproxy 是开源的，于是我下了源码来看，那时候才大一，只学过 c，看到那些 python 代码就凌乱了。于是转头也去学 python，后来渐渐发现了 web 开发的乐趣，于是 ruby 和 node.js 也碰碰。后来 goagent 火起来了，我又去看了看它的代码，发现非常难看，就自己写了个 https://github.com/alsotang/keepagent 。不过现在回想起来，还是 goagent 的实现比较稳定以及效率高。

heroku 的免费额度还是足够的，对于 demo 应用来说，放上去是绰绰有余的。各位搞 web 开发的大学生朋友，一定要试着让你开发的项目尽可能早地去线上跑，这样你的项目可以被其他人看到，能够促使你更有热情地进行进一步开发。这回我们放的是 cnode 社区的爬虫上去，你其实可以试着为你们学院或者学校的新闻站点写个爬虫，提供 json api，然后去申请个微信公共平台，每天推送学院网站的新闻。这东西辅导员是有需求的，可以做个给他们用。

好了，我们先 clone https://github.com/Ricardo-Li/node-practice-2 这个项目。由于我们这回讲部署，所以代码就用现成的了，代码的内容就是 lesson 3（https://github.com/alsotang/node-lessons/tree/master/lesson3 ） 里面的那个爬虫。

![](https://github.com/alsotang/node-lessons/blob/master/lesson12/1.png)

clone 下来以后，我们去看看代码。代码中有两个特殊的地方，

一个是一个叫 Procfile 的文件，内容是：

```js
web: node app.js
```

一个是 app.js 里面，

```js
app.listen(process.env.PORT || 5000);
```

这两者都是为了部署 heroku 所做的。

大家有没有想过，当部署一个应用上 paas 平台以后，paas 要为我们干些什么？

首先，平台要有我们语言的运行时；

然后，对于 node.js 来说，它要帮我们安装 package.json 里面的依赖；

然后呢？然后需要启动我们的项目；

然后把外界的流量导入我们的项目，让我们的项目提供服务。

上面那两处特殊的地方，一个是启动项目的，一个是导流量的。

heroku 虽然能推测出你的应用是 node.js 应用，但它不懂你的主程序是哪个，所以我们提供了 Procfile 来指导它启动我们的程序。

而我们的程序，本来是监听 5000 端口的，但是 heroku 并不知道。当然，你也可以在 Procfile 中告诉 heroku，可如果大家都监听 5000 端口，这时候不就有冲突了吗？所以这个地方，heroku 使用了主动的策略，主动提供一个环境变量 `process.env.PORT` 来供我们监听。

这样的话，一个简单 app 的配置就完成了。

我们去 https://www.heroku.com/ 申请个账号，然后下载它的工具包 https://toolbelt.heroku.com/ ，然后再在命令行里面，通过 `heroku login` 来登录。

上述步骤完成后，我们进入 `node-practice-2` 的目录，执行 `heroku create`。这时候，heroku 会为我们随机取一个应用名字，并提供一个 git 仓库给我们。

![](https://github.com/alsotang/node-lessons/blob/master/lesson12/2.png)

接着，往 heroku 这个远端地址推送我们的 master 分支：

![](https://github.com/alsotang/node-lessons/blob/master/lesson12/3.png)

heroku 会自动检测出我们是 node.js 程序，并安装依赖，然后按照 Procfile 进行启动。

push 完成后，在命令键入 `heroku open`，则 heroku 会自动打开浏览器带我们去到相应的网址：

![](https://github.com/alsotang/node-lessons/blob/master/lesson12/4.png)

到此课程也就结束了。

随便聊聊 heroku 的 addon 吧。这个 addon 确实是个神奇的东西，反正在 heroku 之外我还没怎么见到这类概念。这些 addon 提供商，有些提供 redis 的服务，有些提供 mongodb，有些提供 mysql。你可以直接在 heroku 上面进行购买，然后 heroku 就会提供一段相应服务的地址和账号密码给你用来连接。

大家可以去 https://addons.heroku.com/ 这个页面看看，玲琅满目各种应用可以方便接入。之所以这类服务有市场，也是因为亚马逊的 aws 非常牛逼。为什么这么说呢，因为网络速度啊。如果现在在国内，你在 ucloud 买个主机，然后用个阿里云的 rds，那么应用的响应速度会因为 mysql 连接的问题卡得动不了。但在 heroku 这里，提供商们，包括 heroku 自己，都是构建在 aws 上面，这样一来，各种服务的互通其实走的是内网，速度很可以接受，于是各种 addon 提供商就做起来了。

国内的话，其实在阿里云上面也可以考虑这么搞一搞。

完。
