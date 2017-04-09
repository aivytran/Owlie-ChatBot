// npm install amazon-product-api

const amazon = require('amazon-product-api');
const Config = require('../const.js');

const client = amazon.createClient({
  awsId: Config.AWS_ACCESS_KEY,
  awsSecret: Config.AWS_SECRET_KEY,
  awsTag: Config.AWS_ASSOCIATE_TAG
});

const searchItem = (keywords, itemPage, minimumPrice, maximumPrice) => {
  let minPrice = minimumPrice.replace(/[$.]/g,'');
  let maxPrice = maximumPrice.replace(/[$.]/g,'');
  return client.itemSearch({
    keywords: keywords,
    itemPage: itemPage,
    minimumPrice: minPrice,
    maximumPrice: maxPrice,
    // responseGroup: 'ItemAttributes,Offers,Images,BrowseNodes'
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results){
    for (let i = 0; i < results.length; i++) {
      console.log(i);
      // console.log(results[i]["Offers"]);
      console.log(results[i]["ItemAttributes"][0]["ListPrice"]);
      // console.log(results[i]["BrowseNodes"]);
    }
    return results;
  }).catch(function(err){
    console.log(err);
  });
};

module.exports = {searchItem: searchItem};
