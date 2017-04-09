// npm install amazon-product-api

const amazon = require('amazon-product-api');
const Config = require('../const.js');

const client = amazon.createClient({
  awsId: Config.AWS_ACCESS_KEY,
  awsSecret: Config.AWS_SECRET_KEY,
  awsTag: Config.AWS_ASSOCIATE_TAG
});

const searchItem = (keywords, itemPage) => {
  return client.itemSearch({
    keywords: keywords,
    itemPage: itemPage,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results){
    // console.log(results);
    return results;
  }).catch(function(err){
    console.log(err);
  });
};

module.exports = {searchItem: searchItem};
