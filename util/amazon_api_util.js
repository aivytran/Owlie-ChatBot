// npm install amazon-product-api

const amazon = require('amazon-product-api');
const Config = require('../const.js');

const client = amazon.createClient({
  awsId: Config.AWS_ACCESS_KEY,
  awsSecret: Config.AWS_SECRET_KEY,
  awsTag: Config.AWS_ASSOCIATE_TAG
});

const searchItem = (keywords, itemPage, minimumPrice, maximumPrice) => {
  return client.itemSearch({
    keywords: keywords,
    itemPage: itemPage,
    minimumPrice: minimumPrice,
    maximumPrice: maximumPrice,
    responseGroup: 'ItemAttributes,Offers,Images,BrowseNodes'
  }).then(function(results){
    return results;
  }).catch(function(err){
    console.log(err[0]["Error"]);
  });
};

module.exports = {
  searchItem: searchItem
};
