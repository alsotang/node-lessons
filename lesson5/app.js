var async = require('async');

var concurrencyCount = 0;
var fetchUrl = function (url, callback) {
  concurrencyCount++;
  console.log('现在的并发数是', concurrencyCount);
  setTimeout(function () {
    callback(null, url + ' html content');
  }, 1000);
};

var urls = [];
for(var i = 0; i < 100; i++) {
  urls.push('http://datasource_' + i);
}

console.log(urls);
