《搭建 Node.js 开发环境》
=

本课程假设大家都是在 Linux 或者 Mac 下面。至于使用 Windows 并坚持玩新技术的同学，我坚信他们一定有着过人的、甚至是不可告人的兼容性 bug 处理能力，所以这部分同学麻烦在课程无法继续时，自行兼容一下。

不久前公司刚发一台新 Mac 给我，所以我对于在新环境中安装 Node.js 的过程还是记忆犹新的。

其实这过程特别简单:

1. 先安装一个 nvm（ https://github.com/creationix/nvm ）

```
$ curl https://raw.githubusercontent.com/creationix/nvm/v0.17.2/install.sh | bash
```

nvm 的全称是 **Node Version Manager**，之所以需要这个工具，是因为 Node.js 的各种特性都没有稳定下来，所以我们经常由于老项目或尝新的原因，需要切换各种版本。

安装完成后，你的 shell 里面应该就有个 nvm 命令了，调用它试试

```
$ nvm
```

当看到有输出时，则 nvm 安装成功。

2. 安装 Node.js

使用 nvm 的命令安装 Node.js 最新稳定版，现在是 `v0.10.32`。

```
$ nvm install 0.10
```

安装完成后，查看一下

```
$ nvm ls
```

这时候可以看到自己安装的所有 Node.js 版本，输出应如下：



3.

