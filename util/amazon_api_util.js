// npm install amazon-product-api

const amazon = require('amazon-product-api');

let client = amazon.createClient({
  awsId: "AKIAIZPUSEQZQXJQRVKA",
  awsSecret: "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",
  awsTag: "owliethegiftb-20"
});

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
