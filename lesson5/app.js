var async = require('async');

var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  concurrencyCount++;
  console.log('现在的并发数是', concurrencyCount, '正在抓取的是', url);
  setTimeout(function () {
    concurrencyCount--;
    callback(null, url + ' html content');
  }, (Math.random() * 10000000) % 2000);
};

var urls = [];
for(var i = 0; i < 30; i++) {
  urls.push('http://datasource_' + i);
}

async.mapLimit(urls, 5, function (url, callback) {
  fetchUrl(url, callback);
}, function (err, result) {
  console.log(result);
});
