# 《正则表达式》

## 目标

学习正则表达式

## 知识点

1. 正则表达式的使用
2. js 中的正则表达式与 pcre(http://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions ) 的区别

## 课程内容

开始这门课之前，大家先去看两篇文章。

《正则表达式30分钟入门教程》：http://deerchao.net/tutorials/regex/regex.htm

上面这篇介绍了正则表达式的基础知识，但是对于零宽断言没有展开来讲，零宽断言看下面这篇：

《正则表达式之：零宽断言不『消费』》：http://fxck.it/post/50558232873

好了。

在很久很久以前，有一门语言一度是字符串处理领域的王者，叫 perl。

伴随着 perl，有一个类似正则表达式的标准被实现了出来，叫 pcre：Perl Compatible Regular Expressions。

不遗憾的是，js 里面的正则与 pcre 不是兼容的。很多语言都这样。

如果需要测试你自己写的正则表达式，别开个 console 乱弄，上这里：http://refiddle.com/

接下来我们主要讲讲 js 中需要注意的地方，至于正则表达式的内容，上面那两篇文章足够学习了。

第一，

js 中，对于四种零宽断言，只支持 零宽度正预测先行断言 和 零宽度负预测先行断言 这两种。

第二，

js 中，正则表达式后面可以跟三个 flag，比如 /something/igm。

他们的意义分别是，

i 的意义是不区分大小写
g 的意义是，匹配多个
m 的意义是，是 `^` 和 `$` 可以匹配**每**一行的开头。

分别举个例子：

```js
/a/.test('A') // => false
/a/i.test('A') // => true

'hello hell hoo'.match(/h.*?\b/) // => hello
'hello hell hoo'.match(/h.*?\b/g) // => [ 'hello', 'hell', 'hoo' ]

'aaa\nbbb\nccc'.match(/^[\s\S]*?$/g) // => [ 'aaa\nbbb\nccc' ]
'aaa\nbbb\nccc'.match(/^[\s\S]*?$/gm) // => [ 'aaa', 'bbb', 'ccc' ]
```

与 m 意义相关的，还有 `\A`, `\Z` 和 `\z`

他们的意义分别是：

```
\A  字符串开头(类似^，但不受处理多行选项的影响)
\Z  字符串结尾或行尾(不受处理多行选项的影响)
\z  字符串结尾(类似$，但不受处理多行选项的影响)
```

在 js 中，g flag 会影响 String.prototype.match() 和 RegExp.prototype.exec() 的行为

String.prototype.match() 中，返回数据的格式会不一样，加 g 会返回数组，不加 g 则返回比较详细的信息

```js
> 'hello hell'.match(/h(.*?)\b/g)
[ 'hello', 'hell' ]

> 'hello hell'.match(/h(.*?)\b/)
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]

```

RegExp.prototype.exec() 中，加 g 之后，如果你的正则不是字面量的正则，而是存储在变量中的话，特么的这个变量就会变得有记忆！！

```js
> /h(.*?)\b/g.exec('hello hell')
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]
> /h(.*?)\b/g.exec('hello hell')
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]


> var re = /h(.*?)\b/g;
undefined
> re.exec('hello hell')
[ 'hello',
  'ello',
  index: 0,
  input: 'hello hell' ]
> re.exec('hello hell')
[ 'hell',
  'ell',
  index: 6,
  input: 'hello hell' ]
>
```



