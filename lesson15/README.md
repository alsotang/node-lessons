# 《Mongodb 与 Mongoose 的使用》

## 目标

无明确目标

## 知识点

1. 了解 mongodb (http://www.mongodb.org/ )
1. 学习 mongoose 的使用 (http://mongoosejs.com/ )

## 课程内容

### mongodb

mongodb 这个名词相信大家不会陌生吧。有段时间 nosql 的概念炒得特别火，其中 hbase redis mongodb couchdb 之类的名词都相继进入了大众的视野。

hbase 和 redis 和 mongodb 和 couchdb 虽然都属于 nosql 的大范畴。但它们关注的领域是不一样的。hbase 是存海量数据的，redis 用来做缓存，而 mongodb 和 couchdb 则试图取代一些使用 mysql 的场景。

mongodb 的官网是这样介绍自己的：

> MongoDB (from "humongous") is an open-source document database, and the leading NoSQL database. Written in C++

开源、文档型、nosql。

其中**文档型**是个重要的概念需要理解。

在 sql 中，我们的数据层级是：数据库（db） -> 表（table） -> 记录（record）-> 字段；在 mongodb 中，数据的层级是：数据库 -> collection -> document -> 字段。这四个概念可以对应得上。

文档型数据这个名字中，“文档”两个字很容易误解。其实这个文档就是 bson 的意思。bson 是 json 的超集，比如 json 中没法储存二进制类型，而 bson 拓展了类型，提供了二进制支持。mongodb 中存储的一条条记录都可以用 bson 来表示。所以你也可以认为，mongodb 是个存 bson 数据的数据库，或是存哈希数据的数据库。

mongodb 相对于它的竞争对手们来说——比如 couchdb，它的一大优势就是尽可能提供与 sql 对应的概念。之前说了，sql 中的记录对应 mongodb 中的 document，记录这东西是一维的，而 document 可以嵌套很多层。在某些场景下，比如存储一个文章的 tags，mongodb 中的字段可以轻松存储数组类型，而 sql 中就需要设计个一对多的表关系出来。

假设有一个 blog 应用，其中有张 Post 表，表中有用户发表的一些博客内容（post）。

这些 post 文档的样子大概会是这样：

```js
var post = {
  title: '呵呵的一天',
  author: 'alsotang',
  content: '今天网速很差',
  tags: ['呵呵', '网速', '差'],
};
```

mongodb 中有个最亮眼的特性，就是 **Auto-Sharding**，sharding 的意思可以理解成我们 scale sql 时的分表。

在 mongodb 中，表与表之间是没有联系的，不像 sql 中一样，可以设定外键，可以进行表连接。mongodb 中，也无法支持事务。

所以这样的表，无债一身轻。可以很轻易地 scale 至多个实例（假设实例都有不同的物理位置）上。在 mongodb 中，实时的那些查询，也就只能进行条件查询：某某大于一个值或某某等于一个值。而 sql 中，如果一张表的数据存在了多个实例上的话，当与其他表 join 时候，表之间的运来运去会是个很慢的过程，具体我也不太懂。

反正使用 mongodb 时，一定要思考的两点就是：表 join 到底要不要，事务支持到底要不要。

mongodb 中的索引特性跟 sql 中差不多，只是它对于嵌套的数据类型也提供了支持。在建立复合索引时，mongodb 可以指定不同字段的排序，比如两个字段 `is_top`（置顶） 和 `create_time`（创建时间） 要建立复合索引，我们可以指定 is_top 按正序排，create_time 按逆序排。mysql 说是有计划支持这个特性，不过目前也没什么消息。不过这点不重要。

mongodb 中，collection 是 schema-less 的。在 sql 中，我们需要用建表语句来表明数据应该具有的形式，而 mongodb 中，可以在同一张里存各种各样不同的形式的数据。同一个 collection 中，可以有些 document 具有 100 个字段，而另一些，则只具有 5 个字段。如果你分不清这个特性的使用场景，那么请像使用 sql 一样的，尽可能保证一个 collection 中数据格式是统一的。这个 schema-less 的特性，有个比较典型的场景是用来存储日志类型的数据，可以搜搜看这方面的典型场景。

mongodb 和 mysql 要我选的话，无关紧要的应用我会选择 mongodb，就当个简单的存 json 数据的数据库来用；如果是线上应用，肯定还是会选择 mysql。毕竟 sql 比较成熟，而且各种常用场景的最佳实践都有先例了。

我所在的阿里巴巴数据平台，有各种各样的大数据系统。有些做离线计算，一算就是几个小时，算出来的结果被缓存起来，查询时候就可以实时得到结果，只是数据一致性上，不可避免会有 delay；有些做实时运算，可以在 1s 内从几千万条数据中算出一个复杂条件的结果。但它们都提供了 sql 的接口，也就是说，无论底层他们是如何让几百台机器 mapreduce，都让你可以用已有的 sql 知识进行查询。所以还是选择 sql 省事啊。

这里还有个很好玩的网站：http://www.mongodb-is-web-scale.com/

顺便说说 mongodb 与 redis 的不同。mongodb 是用来存非临时数据的，可以认为是存在硬盘上，而 redis 的数据可以认为都在内存中，存储临时数据，丢了也无所谓。对于稍微复杂的查询，redis 支持的查询方式太少太少了，几乎可以认为是 key-value 的。据说 instagram 的数据就全部存在 redis 中，用了好几个几十 G 内存的 aws ec2 机器在存。redis 也是支持把数据写入硬盘的，aof 貌似都过时了，好久没关注了。

mongodb 与 hbase 的区别。如果说你已经在考虑使用 hbase 了的话，应该也不用我介绍它们的区别了吧..

主题所限，就不展开讲了。这之间的选择和权衡，说起来真的是个很大的话题。

我对这方面的话题很感兴趣，如果要讨论这方面话题的话，可以去 https://cnodejs.org/ 发个帖，详细描述一下场景然后 at 我（@alsotang）。

mongodb 的官网中有一些特性介绍：

![](https://github.com/alsotang/node-lessons/blob/master/lesson15/1.png)

其中标有箭头的是基本概念，圆圈的是进阶概念，画叉的不必了解。

### 安装 mongodb

课程到这，一直忘记说 mongodb 的安装了。

ubuntu: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

mac: `$ brew install mongodb`

装好以后，在命令行 `$ mongod`，然后另外开个 shell 窗口，输入 `$ mongo` 就能使用了。

### mongoose

mongoose 是个 odm。odm 的概念对应 sql 中的 orm。也就是 ruby on rails 中的 activerecord 那一层。orm 全称是 `Object-Relational Mapping`，对象关系映射；而 odm 是 `Object-Document Mapping`，对象文档映射。

它的作用就是，在程序代码中，定义一下数据库中的数据格式，然后取数据时通过它们，可以把数据库中的 document 映射成程序中的一个对象，这个对象有 .save .update 等一系列方法，和 .title .author 等一系列属性。在调用这些方法时，odm 会根据你调用时所用的条件，自动转换成相应的 mongodb shell 语句帮你发送出去。自然地，在程序中链式调用一个个的方法要比手写数据库操作语句具有更大的灵活性和便利性。

mongoose 的官网给出了类似这样一个示例，我改造了一下：

```js
// 首先引入 mongoose 这个模块
var mongoose = require('mongoose');
// 然后连接对应的数据库：mongodb://localhost/test
// 其中，前面那个 mongodb 是 protocol scheme 的名称；localhost 是 mongod 所在的地址；
// 端口号省略则默认连接 27017；test 是数据库的名称
// mongodb 中不需要建立数据库，当你需要连接的数据库不存在时，会自动创建一个出来。
// 关于 mongodb 的安全性，mongodb 我印象中安全机制很残废，用户名密码那套都做得不好，更
// 别提细致的用户权限控制了。不过不用担心，mongodb 的默认配置只接受来自本机的请求，内网都连不上。
// 当需要在内网中为其他机器提供 mongodb 服务时，或许可以去看看 iptables 相关的东西。
mongoose.connect('mongodb://localhost/test');

// 上面说了，我推荐在同一个 collection 中使用固定的数据形式。
// 在这里，我们创建了一个名为 Cat 的 model，它在数据库中的名字根据传给 mongoose.model 的第一个参数决定，mongoose 会将名词变为复数，在这里，collection 的名字会是 `cats`。
// 这个 model 的定义是，有一个 String 类型的 name，String 数组类型的 friends，Number 类型的 age。
// mongodb 中大多数的数据类型都可以用 js 的原生类型来表示。至于说 String 的长度是多少，Number 的精度是多少。String 的最大限度是 16MB，Number 的整型是 64-bit，浮点数的话，js 中 `0.1 + 0.2` 的结果都是乱来的。。就不指望什么了。。
// 这里可以看到各种示例：http://mongoosejs.com/docs/schematypes.html
var Cat = mongoose.model('Cat', {
  name: String,
  friends: [String],
  age: Number,
});

// new 一个新对象，名叫 kitty
// 接着为 kitty 的属性们赋值
var kitty = new Cat({ name: 'Zildjian', friends: ['tom', 'jerry']});
kitty.age = 3;

// 调用 .save 方法后，mongoose 会去你的 mongodb 中的 test 数据库里，存入一条记录。
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});
```

我们可以验证一下

```shell
$ mongo
MongoDB shell version: 2.6.4
connecting to: test
> show dbs
> use test
> show collections
> db.cats.find()
```

会发现里面就有一条记录了。

### 设计个简单博客程序

如果要写个博客程序练手。数据库可以这样设计

```js
var Post = mongoose.model('Post', {
  title: String,
  content: String,
  author: String,
  create_at: Date,
});
```

<del> 评论就不要自己做了，接入多说：http://duoshuo.com/ </del>

编辑器就纯文本好了，用 markdown 写。

用户系统也不做，硬编码几个管理员账号在配置文件中，然后用 http basic auth：https://github.com/jshttp/basic-auth 来做验证。


### 示例程序

Nodeclub 是使用 Node.js 和 MongoDB 开发的社区系统

https://github.com/cnodejs/nodeclub

完。
