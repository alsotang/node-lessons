# 《benchmark 怎么写》

## 目标

有一个字符串 `var number = '100'`，我们要将它转换成 Number 类型的 100。

目前有三个选项：+, parseInt, Number

请测试哪个方法更快。

## 知识点

1. 学习使用 benchmark 库

## 课程内容

首先去弄个 benchmark 库，https://github.com/bestiejs/benchmark.js 。

这个库已经两年没有更新了，两年前发了个 1.0.0 版本，直到现在。

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

// add tests
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
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
```

直接运行：

图！

可以看到，parseInt 是最快的。


