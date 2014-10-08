《测试用例：mocha，chai，phantomjs》
=

目标
==

建立一个 lesson7 项目，在其中编写代码。

main.js: 类似上文提到的fibonacci 函数。

此函数的定义为 `int fibonacci(int n)`

* 当 n === 0 时，返回 0；n === 1时，返回 1;
* n > 1 时，返回 `fibonacci(n) === fibonacci(n-1) + fibonacci(n-2)`，如 `fibonacci(10) === 55`;

vendor文件夹: 前端单元测试的环境。

vendor/tests.js 编写针对前端脚本的测试用例

知识点
==

1. 学习使用测试框架 mocha进行前端测试 : http://visionmedia.github.io/mocha/
2. 了解"全栈"的断言库 chai: http://chaijs.com/
3. 了解headless浏览器 phantomjs: http://phantomjs.org/

### 前端脚本单元测试

[lesson6](https://github.com/alsotang/node-lessons/tree/master/lesson6)内容都是针对后端环境中node的一些单元测试方案，出于应用健壮性的考量，针对前端js脚本的单元测试也非常重要。而前后端通吃，也是mocha的一大特点。

首先，前端脚本的单元测试主要有两个困难需要解决。

1. 运行环境应当在浏览器中，可以操纵浏览器的DOM对象，且可以随意定义执行时的html上下文。

2. 测试结果应当可以直接反馈给mocha，判断测试是否通过。

#### 浏览器环境执行

我们首先搭建一个测试原型，只需要执行
```jvascript
mocha init f2e
//f2e 是原型生成的目录
```
mocha就会自动帮我们生成一个简单的测试原型
```shell
.
├── index.html
├── mocha.css
├── mocha.js
└── tests.js
```
其中index.html是单元测试的入口，tests.js是我们的测试用例文件。

我们直接在index.html插入上述示例的fibonacci函数以及断言库chaijs。

```html5
<div id="mocha"></div>
<script src='chai.js'></script>
<script>
  var fibonacci = function (n) {
    if (n === 0) {
      return 0;
    }
    if (n === 1) {
      return 1;
    }
    return fibonacci(n-1) + fibonacci(n-2);
  };
</script>
```
然后在tests.js中写入对应测试用例

```javascript
var assert = chai.assert;
describe('simple test', function () {
  it('should equal 0 when n === 0', function () {
    //main.fibonacci(0).should.equal(0);
    assert.equal(0, window.fibonacci(1))
  });
})
```
这时打开index.html，可以发现测试结果，我们完成了浏览器端的脚本测试(注意我们调用了**window**对象)

#### 测试反馈

mocha没有提供一个命令行的前端脚本测试环境(因为我们的脚本文件需要运行在浏览器环境中)，因此我们使用phanatomjs帮助我们搭建一个模拟环境。不重复制造轮子，这里直接使用mocha-phantomjs帮助我们在命令行运行测试。

首先安装mocha-phanatomjs
```shell
npm i -g mocha-phanatomjs
```
然后将index.html对应部分修改为
```html5
<script>
  if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
  else { mocha.run(); }
</script>
```
然后我们在命令行中运行
```shell
mocha-phantomjs index.html
```
结果展现是不是和后端代码测试很类似 :smile:

至此,我们实现了前端脚本的单元测试，基于phanatomjs你几乎可以调用所有的浏览器方法，而mocha-phanatomjs也可以很便捷地将测试结果反馈到mocha，便于后续的持续集成。
