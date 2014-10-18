# 《线上部署：heroku》

## 目标

将 https://github.com/Ricardo-Li/node-practice-2 这个项目部署上 heroku，成为一个线上项目

## 知识点

1. 学习 heroku 的线上部署

## 课程内容

### 什么是 heroku

heroku 是弄 ruby 的 paas 起家，现在支持多种语言环境，更甚的是它强大的 add-on 服务。

pass 平台相信大家都不陌生。Google 有 gae，国内新浪有 sae。paas 平台相对 vps 来说，不需要你配置服务器，不需要装数据库，也不需要理会负载均衡。这一切都可以在平台上直接获取。

你只要专注自己的业务，把应用的逻辑写好，然后发布上去，应用自然就上线了。数据库方面，如果你用 mysql，那么你可以从平台商那里得到一个 mysql 的地址、账号和密码，直接连接就能用。如果应用的流量增大，需要横向拓展，则只用去到 paas 平台的管理页面，增大服务器实例的数量即可，负载均衡会自动帮你完成。

说起来，我之所以对于 web 开发产生兴趣也是因为当年 gae 的关系。那时候除了 gae 之外，没有别的 paas 平台，gae 是横空出世的。有款翻墙的软件，叫 gappproxy(https://code.google.com/p/gappproxy/ )——可以认为是 goagent 的前身——就是搭建在 gae 上面的，不仅快，而且免费。于是我就很想弄懂这样一个程序是如何开发的。好在 gappproxy 是开源的，于是我下了源码来看，那时候才大一，只学过 c，看到那些 python 代码就凌乱了。于是转头也去学 python，后来渐渐发现了 web 开发的乐趣，于是 ruby 和 node.js 也碰碰。后来 goagent 火起来了，我又去看了看它的代码，发现非常难看，就自己写了个 https://github.com/alsotang/keepagent 。不过现在回想起来，还是 goagent 的实现比较稳定以及效率高。

好了，我们先 clone https://github.com/Ricardo-Li/node-practice-2 这个项目。由于我们这回讲部署，所以代码就用现成的了，代码的内容就是 lesson 3（https://github.com/alsotang/node-lessons/tree/master/lesson3 ） 里面的那个爬虫。



2. 介绍 heroku add-ons 的强大
3. 部署的具体细节

