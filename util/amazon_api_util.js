// npm install amazon-product-api

const amazon = require('amazon-product-api');
const Config = require('../const.js');

const client = amazon.createClient({
  awsId: Config.AWS_ACCESS_KEY,
  awsSecret: Config.AWS_SECRET_KEY,
  awsTag: Config.AWS_ASSOCIATE_TAG
});

const searchItem = (keywords, itemPage, minimumPrice, maximumPrice) => {
  // let minPrice = minimumPrice.replace(/[$.]/g,'');
  // let maxPrice = maximumPrice.replace(/[$.]/g,'');
  return client.itemSearch({
    keywords: keywords,
    itemPage: itemPage,
    minimumPrice: minimumPrice,
    maximumPrice: maximumPrice,
    responseGroup: 'ItemAttributes,Offers,Images,BrowseNodes'
  }).then(function(results){
    // for (let i = 0; i < results.length; i++) {
      // console.log("item " + i);
      // console.log(results[0]);
      // console.log(results[0]["ItemAttributes"]);
      // console.log(results[i]["OfferSummary"][0]["LowestNewPrice"][0]["FormattedPrice"][0]);
      // console.log(results[i]["Offers"][0]["Offer"][0]["OfferListing"][0]["Price"]);
      // console.log(results[0]["Offers"][0]["Offer"][0]["OfferListing"][0]["IsEligibleForPrime"][0]);
      // console.log(results[0]["Offers"][0]["Offer"][0]["OfferListing"][0]["AvailabilityAttributes"]);
      // console.log(results[i]["Offers"][0]["Offer"][0]["OfferListing"][0]["Availability"][0]);
      // console.log(results[i]["ItemAttributes"][0]["ListPrice"]);
      // console.log(results[0]["BrowseNodes"][0]["BrowseNode"][0]["Ancestors"][0]["BrowseNode"][0]["Name"][0]);
      // console.log(results[i]["BrowseNodes"]);
    //   console.log(results[i]["BrowseNodes"][0]["BrowseNode"][0]["BrowseNodeId"][0]);
    //   console.log(results[i]["BrowseNodes"][0]["BrowseNode"][0]["Name"][0]);
    // }
    return results;
  }).catch(function(err){
    console.log(err[0]["Error"]);
  });
};

// const additionalSearch = (keywords) => {
//   client.itemSearch({
//     keywords: keywords,
//     responseGroup: 'ItemAttributes,Offers,Images'
//   }, function(err, results, response) {
//     if (err) {
//       console.log("in error!");
//       console.log(err[0]["Error"]);
//     } else {
//       // console.log("in results!");
//       // console.log(results);  // products (Array of Object)
//       return results;
//       // console.log("in response!");
//       // console.log(response[0]["Item"][0]); // response (Array where the first element is an Object that contains Request, Item, etc.)
//     }
//   });
// };

const additionalSearch = keywords => {
  return client.itemSearch({
    keywords: keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results) {
    // for (let i = 0; i < results.length; i++) {
      // console.log("item " + i);
    // }
    console.log("////// additional search");
    console.log(results);
    return results;
  }).catch(function(err) {
    console.log(err[0]["Error"]);
  });
};

module.exports = {
  searchItem: searchItem,
  additionalSearch: additionalSearch
};
