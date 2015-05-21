# 《搭建 Node.js 开发环境》

本课程假设大家都是在 Linux 或者 Mac 下面。至于使用 Windows 并坚持玩新技术的同学，我坚信他们一定有着过人的、甚至是不可告人的兼容性 bug 处理能力，所以这部分同学麻烦在课程无法继续时，自行兼容一下。

不久前公司刚发一台新 Mac 给我，所以我对于在新环境中安装 Node.js 的过程还是记忆犹新的。

其实这过程特别简单:

### 先安装一个 nvm（ https://github.com/creationix/nvm ）

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.2/install.sh | bash
```

nvm 的全称是 **Node Version Manager**，之所以需要这个工具，是因为 Node.js 的各种特性都没有稳定下来，所以我们经常由于老项目或尝新的原因，需要切换各种版本。

安装完成后，你的 shell 里面应该就有个 nvm 命令了，调用它试试

```
$ nvm
```

当看到有输出时，则 nvm 安装成功。

### 安装 Node.js

使用 nvm 的命令安装 Node.js 最新稳定版，现在是 `v0.12.3`。

```
$ nvm install 0.12
```

安装完成后，查看一下

```
$ nvm ls
```

这时候可以看到自己安装的所有 Node.js 版本，输出应如下：

![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson0/1.png)

（图1）

那个绿色小箭头的意思就是现在正在使用的版本，我这里是 `v0.10.29`。我还安装了 `v0.11.14`，但它并非我当前使用的版本。

如果你那里没有出现绿色小箭头的话，告诉 nvm 你要使用 `0.12.x` 版本

```
$ nvm use 0.12
```

然后再次查看，这时候小箭头应该出现了。

OK，我们在终端中输入

```
$ node
```

REPL(read–eval–print loop) 应该就出来了，那我们就成功了。

随便敲两行命令玩玩吧。

比如 `> while (true) {}`，这时你的 CPU 应该会飚高。

### 完善安装

上述过程完成后，有时会出现，当开启一个新的 shell 窗口时，找不到 node 命令的情况。

这种情况一般来自两个原因

一、shell 不知道 nvm 的存在

二、nvm 已经存在，但是没有 default 的 Node.js 版本可用。

解决方式：

一、检查 `~/.profile` 或者 `~/.bash_profile` 中有没有这样两句

```
export NVM_DIR="/Users/YOURUSERNAME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
```

没有的话，加进去。

这两句会在 bash 启动的时候被调用，然后注册 nvm 命令。

二、

调用

`$ nvm ls`

看看像不像上述图1中一样，有 default 的指向。

如果没有的话，执行

`$ nvm alias default 0.12`

再

`$ nvm ls`

看一下
