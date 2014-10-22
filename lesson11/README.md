# 《作用域与闭包：this，var，(function () {})》

## 目标

无具体目标

## 知识点

1. 理解 js 中 var 的作用域
1. 了解闭包的概念
1. 理解 this 的指向

## 课程内容

### var 作用域

先来看个简单的例子：

```js
var parent = function () {
  var name = "parent_name";
  var age = 13;

  var child = function () {
    var name = "child_name";
    var childAge = 0.3;

    // => child_name 13 0.3
    console.log(name, age, childAge);
  };

  child();

  // will throw Error
  // ReferenceError: childAge is not defined
  console.log(name, age, childAge);
};

parent();
```

直觉地，内部函数可以访问外部函数的变量，外部不能访问内部函数的变量。上面的例子中内部函数 child 可以访问变量 age，而外部函数 parent 不可以访问 child 中的变量 childAge，因此会抛出没有定义变量的异常。

有个重要的事，如果忘记var，那么变量就被声明为全局变量了。

```js
function foo() {
  value = "hello";
}
foo();
console.log(value); // 输出hello
console.log(global.value) // 输出hello
```

这个例子可以很正常的输出 `hello`，是因为 `value` 变量在定义时，没有使用 `var` 关键词，所以被定义成了全局变量。在 Node 中，全局变量会被定义在 `global` 对象下；在浏览器中，全局变量会被定义在 `window` 对象下。

如果你确实要定义一个全局变量的话，请显示地定义在 `global` 或者 `window` 对象上。

这类不小心定义全局变量的问题可以被 jshint 检测出来，如果你使用 sublime 编辑器的话，记得装一个 `SublimeLinter` 插件，这是插件支持多语言的语法错误检测，js 的检测是原生支持的。

JavaScript 中，变量的局部作用域是函数级别的。不同于 C 语言，在 C 语言中，作用域是块级别的。
JavaScript 中没有块级作用域。

js 中，函数中声明的变量在整个函数中都有定义。比如如下代码段，变量 i 和 value 虽然是在 for 循环代码块中被定义，但在代码块外仍可以访问 i 和 value。

```js
function foo() {
  for (var i = 0; i < 10; i++) {
    var value = "hello world";
  }
  console.log(i); //输出10
  console.log(value);//输出hello world
}
foo();
```

所以有种说法是：应该提前声明函数中需要用到的变量，即，在函数体的顶部声明可能用到的变量，这样就可以避免出现一些奇奇怪怪怪的 bug。

但我个人不喜欢遵守这一点，一般都是现用现声明的。这类错误的检测交给 jshint 来做就好了。

### 闭包

闭包这个概念，在函数式编程里很常见，简单的说，就是使内部函数可以访问定义在外部函数中的变量。

假如我们要实现一系列的函数：add10，add20，它们的定义是 `int add10(int n)`。

为此我们构造了一个名为 adder 的构造器，如下：

```js
var adder = function (x) {
  var base = x;
  return function (n) {
    return n + base;
  };
};

var add10 = adder(10);
console.log(add10(5));

var add20 = adder(20);
console.log(add20(5));
```

每次调用 adder 时，adder 都会返回一个函数给我们。我们传给 adder 的值，会保存在一个名为 base 的变量中。由于返回的函数在其中引用了 base 的值，于是 base 的引用计数被 +1。当返回函数不被垃圾回收时，则 base 也会一直存在。

我暂时想不出什么实用的例子来，如果想深入理解这块，可以看看这篇 http://coolshell.cn/articles/6731.html

### this

在函数执行时，this 总是指向调用该函数的对象。要判断 this 的指向，其实就是判断 this 所在的函数属于谁。

在《javaScript语言精粹》这本书中，把 this 出现的场景分为四类，简单的说就是：

* 有对象就指向调用对象
* 没调用对象就指向全局对象
* 用new构造就指向新对象
* 通过 apply 或 call 或 bind 来改变 this 的所指。

1）函数有所属对象时：指向所属对象

函数有所属对象时，通常通过 `.` 表达式调用，这时 `this` 自然指向所属对象。比如下面的例子：

```js
var myObject = {value: 100};
myObject.getValue = function () {
  console.log(this.value);  // 输出 100

  // 输出 { value: 100, getValue: [Function] }，
  // 其实就是 myObject 对象本身
  console.log(this);

  return this.value;
};

console.log(myObject.getValue()); // => 100
```

`getValue()` 属于对象 `myObject`，并由 `myOjbect` 进行 `.` 调用，因此 `this` 指向对象 `myObject`。

2) 函数没有所属对象：指向全局对象

```js
var myObject = {value: 100};
myObject.getValue = function () {
  var foo = function () {
    console.log(this.value) // => undefined
    console.log(this);// 输出全局对象 global
  };

  foo();

  return this.value;
};

console.log(myObject.getValue()); // => 100
```

在上述代码块中，`foo` 函数虽然定义在 `getValue` 的函数体内，但实际上它既不属于 `getValue` 也不属于 `myObject`。`foo` 并没有被绑定在任何对象上，所以当调用时，它的 `this` 指针指向了全局对象 `global`。

据说这是个设计错误。

3）构造器中的 this：指向新对象

js 中，我们通过 `new` 关键词来调用构造函数，此时 this 会绑定在该新对象上。

```js

var SomeClass = function(){
  this.value = 100;
}

var myCreate = new SomeClass();

console.log(myCreate.value); // 输出100
```

顺便说一句，在 js 中，构造函数、普通函数、对象方法、闭包，这四者没有明确界线。界线都在人的心中。

4) apply 和 call 调用以及 bind 绑定：指向绑定的对象

apply() 方法接受两个参数第一个是函数运行的作用域，另外一个是一个参数数组(arguments)。

call() 方法第一个参数的意义与 apply() 方法相同，只是其他的参数需要一个个列举出来。

简单来说，call 的方式更接近我们平时调用函数，而 apply 需要我们传递 Array 形式的数组给它。它们是可以互相转换的。

```js
var myObject = {value: 100};

var foo = function(){
  console.log(this);
};

foo(); // 全局变量 global
foo.apply(myObject); // { value: 100 }
foo.call(myObject); // { value: 100 }

var newFoo = foo.bind(myObject);
newFoo(); // { value: 100 }
```

完。
