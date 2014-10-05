var express = require('express');
var utility = require('utility');
var app = express();

app.get('/', function (req, res) {
  var q = req.query.q;
  var md5Value = utility.md5(q);

  res.send(md5Value);
});

app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});
