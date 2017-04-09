// npm install amazon-product-api

const amazon = require('amazon-product-api');
const Config = require('../const.js');

const client = amazon.createClient({
  awsId: Config.AWS_ACCESS_KEY,
  awsSecret: Config.AWS_SECRET_KEY,
  awsTag: Config.AWS_ASSOCIATE_TAG
});

const searchItem = (keywords, itemPage, maximumPrice) => {
  return client.itemSearch({
    keywords: keywords,
    itemPage: itemPage,
    maximumPrice: maximumPrice,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results){
    for (let i = 0; i < results.length - 7; i++) {
      console.log(i);
      console.log(results[0]);
      // console.log(results[0]["BrowseNodes"][0]["BrowseNode"]);
    }
    return results;
  }).catch(function(err){
    console.log(err);
  });
};

module.exports = {searchItem: searchItem};
