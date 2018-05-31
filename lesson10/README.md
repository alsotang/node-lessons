# 《benchmark 怎么写》

## 目标

有一个字符串 `var number = '100'`，我们要将它转换成 Number 类型的 100。

目前有三个选项：+, parseInt, Number

请测试哪个方法更快。

## 知识点

1. 学习使用 benchmark 库
2. 学习使用 http://jsperf.com/ 分享你的 benchmark

## 课程内容

首先去弄个 benchmark 库，https://github.com/bestiejs/benchmark.js 。

<del> 这个库已经两年没有更新了，两年前发了个 1.0.0 版本，直到现在。 </del>

这个库的最新版本是 2.1.4

用法也特别简单，照着官网的 copy 下来就好。

我们先来实现这三个函数：

```js
var int1 = function (str) {
  return +str;
};

var int2 = function (str) {
  return parseInt(str, 10);
};

var int3 = function (str) {
  return Number(str);
};
```

然后照着官方的模板写 benchmark suite：

```js
var number = '100';

// 添加测试
suite
.add('+', function() {
  int1(number);
})
.add('parseInt', function() {
  int2(number);
})
.add('Number', function () {
  int3(number);
})
// 每个测试跑完后，输出信息
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// 这里的 async 不是 mocha 测试那个 async 的意思，这个选项与它的时间计算有关，默认勾上就好了。
.run({ 'async': true });
```

直接运行：

![](https://raw.githubusercontent.com/alsotang/node-lessons/master/lesson10/1.png)

可以看到，parseInt 是最快的。

### 在线分享

如果想要在线分享你的 js benchmark，用这个网站：http://jsperf.com/ 。

比如我在上面测试 `Math.log` 的效率：

http://jsperf.com/math-perf-alsotang

进入之后点击那个 `Run tests` 按钮，就可以在浏览器中看到它们的效率差异了，毕竟浏览器也是可以跑 js 的。

点击这里：http://jsperf.com/math-perf-alsotang/edit ，就可以看到这个 benchmark 是怎么配置的，很简单。
