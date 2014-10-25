# 简单说说回调
> 首先可以看看[callbackhell](http://callbackhell.com)简单做些回调的了解。

几乎每个同学刚接触Node都会对回调机制感觉非常不适应，回调也是Node开发自身的痛点。

这里，我们通过一个简单的实践，加深对回调的一些理解。以上文提到的mongoose为例，相关代码在vendor文件夹内，执行```npm i```观察结果。

## 回调带来的问题

我们首先实现一个简单的对用户查询操作。

```js
User.findOne({id: id}, function(err, it) {
  if (err) ; //TODO handlerError
  console.log(it)
})
```

看起来好像没有什么问题，如果逻辑需要我们可能需要进行多次查询再拼接结果。

```js

var res = '';
//根据id获取用户的post信息
User.findOne({id: id}, function(err, it) {
  if (err) ; //TODO handlerError
  Post.find({author: it.name}, function(err, posts) {
    if (err) ; //TODO handlerError
    res += posts[0];
    console.log(posts)
  })
})

//多次查询进行组合
User.findOne({id: id}, function(err, it) {
  //...
})

//由于异步特性，这里的res仍然是初始值。
return res;

```

那么问题来了，如果业务逻辑需要进行多次DB查询。

1. 这种`意大利面条`的写法非常非常不易于维护。
2. 异常处理，异常繁琐。

## 解决问题的几种思路

1. 流程控制(例如[async](https://github.com/caolan/async))
2. promise(例如[q](https://github.com/kriskowal/q))
3. ES6 generator 

###流程控制

相较不同的流程控制库，我们核心方法可以归纳为`parallel`和`series`。分别分成两类流程
1. “队列”类型, 多个函数之间没有相互依赖关系。
2. “序列”类型, 函数执行必须按照一定顺序。

