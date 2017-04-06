// npm install amazon-product-api

const amazon = require('amazon-product-api');

const searchItem = (keywords) => {
  client.itemSearch({
    // director: 'Quentin Tarantino',
    // actor: 'Samuel L. Jackson',
    // searchIndex: 'DVD',
    // audienceRating: 'R',
    keywords: keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results){
    console.log(results);
  }).catch(function(err){
    console.log(err);
  });
};
