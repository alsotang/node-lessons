### JavaScript 语言精粹

http://book.douban.com/subject/3590768/

![](https://github.com/alsotang/node-lessons/blob/master/lesson14/1.png)

这本书很薄，只有 155 页，但该讲的几乎都讲了。大家想办法搞来看看吧。

js 这门语言，水很浅。没有太复杂的地方可以钻，但特么的坑又多。

上面的那本书是一定要看的。

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

js 是面向对象的，但没有类。没有多重继承，没有接口。没有结构体，没有枚举类型。

但它的字面量哈希和 function 都足够灵活，拼拼凑凑，上面那些东西都能“模拟”着用。

### callback hell

用 eventproxy 和 async 已经能解决大部分问题。剩下的小部分问题，肯定是设计错误。：）

参见：

* 《使用 eventproxy 控制并发》：https://github.com/alsotang/node-lessons/tree/master/lesson4
* 《使用 async 控制并发》：https://github.com/alsotang/node-lessons/tree/master/lesson5
