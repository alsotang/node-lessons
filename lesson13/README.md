# 《持续集成平台：travis》

## 目标

无明确目标

## 知识点

1. 学习使用 travis-ci 对项目进行持续集成测试 (https://travis-ci.org/ )

## 课程内容

首先来看看这个项目：https://github.com/Ricardo-Li/node-practice-3

![](https://github.com/alsotang/node-lessons/blob/master/lesson13/1.png)

（图1）

类似这样的 badges，在很多项目中都可以看到。前者是告诉我们，这个项目的测试目前是通过的；后者是告诉我们，这个测试的行覆盖率是多少。行覆盖率当然是越多越好。测试的重要性我就不说了。

为什么要使用 travis 这样的平台，是因为它可以让你明白自己的项目在一个“空白环境”中，是否能正确运行；也可以让你知道，用不同的 Node.js 版本运行的话，有没有兼容性问题。

当你在自己的机器上跑测试的时候，你用着特定的 Node.js 版本，比如 0.10，如果测试过了，你也还是不懂在 0.11 下，你的测试能不能通过。你可以手动地切换 node 版本再跑一次，也可以选择让 travis 帮你把不同的 node 版本跑一次。而且有时候，我们 npm 安装了某个包，但却忘记将它写入 package.json 里面了，在自己的机器上，测试没问题，但当别的用户安装你的包时，会发现有依赖缺失。

travis 应该是把虚拟机的技术玩得比较好，它每次跑测试时，都会提供一个空白的环境。这个环境只有 Linux 基本的 `build-essential` 和 `wget`、`git` 那些依赖。连 Node.js 的运行时都是现跑现安装的。

travis 默认带有的那些依赖，都是每个用户的机器上都会有的，所以一旦你的应用在 travis 上面能够跑通，那么就不用担心别的用户安装不上了。

我们来讲讲接入 travis 的步骤。

travis 的价格是免费的，对于 github 上的开源项目来说。它默认当然不可能帮 github 的每个用户都跑测试，所以你需要去注册一下 travis，然后告诉它你需要开启集成测试的仓库。

![](https://github.com/alsotang/node-lessons/blob/master/lesson13/2.png)

比如上图，可以看到我帮自己的 `alsohosts` 项目以及 `adsf` 项目开启了测试。

当你在 travis 授权了仓库之后，每当你 push 代码到 github，travis 都会自动帮你跑测试。

travis 通过授权，可以知道你的项目在什么地方，于是它就可以把项目 clone 过去。但问题又来了，它不懂你的测试怎么跑啊。用 `npm test` 还是 `make test` 还是 `jake test` 呢？

所以我们需要给出一些配置信息，配置信息以 `.travis.yml` 文件的形式放在项目根目录，比如一个简单的 `.travis.yml`。

```yml
language: node_js
node_js:
 - '0.8'
 - '0.10'
 - '0.11'

script: make test
```

这个文件传递的信息是：

* 这是一个 node.js 应用
* 这个测试需要用 0.8、0.10 以及 0.11 三个版本来跑
* 跑测试的命令是 `make test`

将这个文件添加到项目的根目录下，再 push 上 github，这时候 travis 就会被触发了。

travis 接着会做的事情是：

1. 安装一个 node.js 运行时。由于我们指定了三个不同版本，于是 travis 会使用三个机器，分别安装三个版本的 node.js
2. 这些机器在完成运行时安装后，会进入项目目录执行 `npm install` 来安装依赖。
3. 当依赖安装完成后，执行我们指定的 script，在这里也就是 `make test`

如果测试通过的话，make 命令的返回码会是 0（如果不懂什么是返回码，则需要补补 shell 的知识），则测试通过；如果测试有不通过的 case，则返回码不会为 0，travis 则判断测试失败。

每一个 travis 上面的项目，都可以得到一个图片地址，这个地址上的图片会显示你项目当前的测试通过状态，把这个图片添加到自己项目的 README 中，就可以得到我们图1的那种逼格了。

对了，行覆盖率的那个 badge 是由一个叫 coveralls(https://coveralls.io/ ) 的服务提供的。大家可以试着自己接入。

## 补充说明:

如果你的应用有使用到数据库, 需要在 `.travis.yml` 中添加一些内容.

以 MongoDB 为例:

```yml
services:
    mongodb
```

其它数据库详细内容参考[travis 官方文档](http://docs.travis-ci.com/user/database-setup/)
