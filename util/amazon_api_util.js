// npm install amazon-product-api

const amazon = require('amazon-product-api');
const Config = require('../const.js');

const client = amazon.createClient({
  awsId: Config.AWS_ACCESS_KEY,
  awsSecret: Config.AWS_SECRET_KEY,
  awsTag: Config.AWS_ASSOCIATE_TAG
});

const searchItem = (keywords) => {
  return client.itemSearch({
    // director: 'Quentin Tarantino',
    // actor: 'Samuel L. Jackson',
    // searchIndex: 'DVD',
    // audienceRating: 'R',
    keywords: keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results){
    return results;
    // console.log(results);
    // return results.json();
  }).catch(function(err){
    console.log(err);
  });
};

module.exports = {searchItem: searchItem};
