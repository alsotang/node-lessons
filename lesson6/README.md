《测试用例：mocha，should，istanbul》
=

目标
==

建立一个 lesson6 项目，在其中编写代码。

main.js: 其中有个 fibonacci 函数。fibonacci 的介绍见：http://en.wikipedia.org/wiki/Fibonacci_number 。

此函数的定义为 `int fibonacci(int n)`

* 当 n === 0 时，返回 0；n === 1时，返回 1;
* n > 1 时，返回 `fibonacci(n) === fibonacci(n-1) + fibonacci(n-2)`;
* n 不可大于10，否则抛错，因为 Node.js 的计算性能没那么强。
* n 也不可小于 0，否则抛错，因为没意义。
* n 不为数字时，抛错。

test/main.test.js: 对 main 函数进行测试，并使行覆盖率和分支覆盖率都达到 100%。

知识点
==

1. 学习使用测试框架 mocha
2. 学习使用断言库 should
3. 学习使用测试率覆盖工具 istanbul
4. 简单 Makefile 的编写

课程内容
==
