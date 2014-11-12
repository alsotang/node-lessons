# 《js 中的那些最佳实践》
**这个章节需要大家帮忙补充，一次性想不完那么多**

----

### JavaScript 语言精粹

http://book.douban.com/subject/3590768/

![](https://github.com/alsotang/node-lessons/blob/master/lesson14/1.png)

这本书很薄，只有 155 页，但该讲的几乎都讲了。大家想办法搞来看看吧（我总不能很没节操地给个电子版 PDF 链接在这里吧）。

js 这门语言，水很浅。没有太复杂的地方可以钻，但特么的坑又多。

上面的那本书是一定要看的。这本书专注在讲 js 语法，其他 js 的书都过多地涉及了浏览器知识。

### JavaScript 之美

* 其一：http://fxck.it/post/72326363595
* 其二：http://fxck.it/post/73513189448

### 继承

js 前端不懂有什么好办法，后端的话，很方便。

用 node 官方的 `util` 库，下面是直接从官网摘抄来的：

```js
var util = require("util");
var events = require("events");

function MyStream() {
    events.EventEmitter.call(this);
}

util.inherits(MyStream, events.EventEmitter);

MyStream.prototype.write = function(data) {
    this.emit("data", data);
}

var stream = new MyStream();

console.log(stream instanceof events.EventEmitter); // true
console.log(MyStream.super_ === events.EventEmitter); // true

stream.on("data", function(data) {
    console.log('Received data: "' + data + '"');
})
stream.write("It works!"); // Received data: "It works!"
```

js 是面向对象的，但是是“基于原型的面向对象”，没有类。没有多重继承，没有接口。没有结构体，没有枚举类型。

但它的字面量哈希和 function 都足够灵活，拼拼凑凑，上面那些东西都能“模拟”着用。

说到没有类的这个问题，很多人总是要纠正其他人关于 js 原型的理解的。我觉得这是没有必要的。基于原型又不是很牛逼，ES6不是照样给出了 class 关键字吗。不管类还是原型都是为了抽象，烂的东西始终烂，不好理解的始终不好理解。

最近学习 ios 的 swift，看见里面有不少相比 objc 舒服的改进。比如 objc 的“方法调用”，学的是 smalltalk 那一套，那不叫方法调用，而是消息传递。结果 swift 里面不照样是方法调用的形式？

### callback hell

用 eventproxy 和 async 已经能解决大部分问题。剩下的小部分问题，肯定是设计错误。：）

参见：

* 《使用 eventproxy 控制并发》：https://github.com/alsotang/node-lessons/tree/master/lesson4
* 《使用 async 控制并发》：https://github.com/alsotang/node-lessons/tree/master/lesson5

### 数据类型

写 js 很少去定义类。Object 的便利在多数其他语言需要定义类的场景下都能直接用。

js 中，用好 Number，String，Array，Object 和 Function 就够了。有时用用 RegExp。

用于 js 这门语言本身的残废，大多数时候都采用“约定胜于配置”的思想来交互合作。

### 控制流

很常规，C 语言那套。

### 基本运算符

C 语言那套。二进制操作并不会降低效率，V8 很聪明的。

### 计算型属性

也就是帮一个对象的属性定义 get 和 set 方法，通过 `obj.value` 和 `obj.value=` 的形式来调用。

koa(http://koajs.com/ ) 把这套玩得炉火纯青。

### 运算符重载

无

### 类型转换

手动帮你需要转换的类型的类定义 `.toxxx` 方法，比如 `.toString`，`.toJSON`，`toNumber`。

js 的隐式类型转换用一次坑一次。

### 相等比较

在 js 中，务必使用 `===` 三个等于号来比较对象，或者自定义方法来比较，不要使用 `==`。

我最近做一个项目，从数据库中取出的数据，虽然应该是字符型的，但有时它们是 String 的表示，有时是 Number 的表示。为了省事，会有人直接用 `==` 来对它们进行比较。这种时候，建议在比较时，把它们都转成 String 类型，然后用 `===` 来比较。

比如 `var x = 31243; var y = '31243'`，比较时，这么做：`String(x) === String(y)`

### 嵌套类型

随便弄。

function 构造函数、闭包、字面量哈希，都可以混在一起写，多少层都行，无限制。

### 拓展

当无法接触一个类的源码，又想帮这个类新增方法的时候。操作它的 prototype 就好了。但不推荐！

### 函数式编程

js 中，匿名函数非常的方便，有效利用函数式编程的特性可以使人写代码时心情愉悦。

使用 lodash：https://lodash.com/docs

### 泛型

类型都经常忽略还泛型！every parammeter is 泛型 in js

### 权限控制

类定义中，没有 public private 等关键词，都靠约定。而且经常有人突破约定。

有些 http 方面的库，时不时就去 stub 原生 http 库的方法，0.11 时的 node.js 完全不按章法出牌，所以很多这些库都出现兼容性问题。

### 设计模式

《解密设计模式-王垠》

https://github.com/alsotang/node-lessons/blob/master/lesson14/%E8%A7%A3%E5%AF%86%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E7%8E%8B%E5%9E%A0.md

### 构建大型项目

从 npm 上面寻找质量高的库，并用质量高的方式拼凑起来。
