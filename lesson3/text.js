const phantom = require('phantom');

// (async function() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//     console.info('Requesting', requestData.url);
//   });

//   const status = await page.open('http://h5.izhangchu.com/dishes_view/index.html?&dishes_id=274');
//   const result = await page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
//   const content = await page.property('content');
//   console.log(content);

//   await instance.exit();
// })();
(function() {
    var phantom = require('phantom');
var _ph, _page, _outObj;

phantom
  .create()
  .then(ph => {
    _ph = ph;
    return _ph.createPage();
  })
  .then(page => {
    _page = page;
    return _page.open('http://h5.izhangchu.com/dishes_view/index.html?&dishes_id=274');
  })
  .then(status => {
    console.log(status);
    return _page.property('content');
  })
  .then(content => {
    console.log(content);
    _page.close();
    _ph.exit();
  })
  .catch(e => console.log(e));
})();