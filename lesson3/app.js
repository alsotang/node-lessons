const express = require('express');
const cheerio = require('cheerio');
const superagent = require('superagent');

const app = express();

app.get('/', (req, res, next) => {
  superagent.get('http://h5.izhangchu.com/dishes_view/index.html?&dishes_id=274')
    .end((err, sres) => {
      if (err) {
        return next(err);
      }
      let $ = cheerio.load(sres.text);

      let obj = {}; // 标题
      $('#DishesView-wrap .goods-desc').each((idx, element) => {
        let $element = $(element);
        obj = {
          title: $element.children('h5').text(),
          subtitle: $element.children('p').text()
        };
      });

      let items = []; // 相关常识
      $('#DishesCommensense-wrap li').each((idx, element) => {
        let $element = $(element);
        items.push({
          title: $element.children('h5').text(),
          txt: $element.children('.txt').text().trim()
        });
      });

      let Ingredients = []; // 食材
      $('#DishesMaterial-wrap li').each((idx, element) => {
        let $element = $(element);
        Ingredients.push({
          name: $element.text().trim(),
          number: $element.children('span').text().trim()
        });
      });

      let labels = []; // 标签
      $('#linksWrap').each((idx, element) => {
        let $element = $(element);
        console.log($element.children('li').children('.label-bar').children('a').children('span').text());
        // labels.push($element.children('a').text().trim());
      });

      let result = {
        title: obj.title,
        subtitle: obj.subtitle,
        content: items, 
        Ingredient: Ingredients,
        label: labels
      };

      res.send(result);
    });
});


app.listen(3000, () => {
  console.log('app is listening at port 3000');
});
