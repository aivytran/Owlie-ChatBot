'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');
const {searchItem} = require('./util/amazon_api_util.js');
const JsonUtil = require('./util/json_util.js');


const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say (sessionId, context, response, cb) {
    console.log(response);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    const recipientId = context._fbid_;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // let data = {}
      // if(response.quickreplies) { // Wit.ai wants us to include quickreplies, alright!
      //     response.quick_replies = [];
      //
      //     for(var i = 0, len = response.quickreplies.length; i < len; i++) { // Loop through quickreplies
      //         response.quick_replies.push({ title: response.quickreplies[i], content_type: 'text', payload: 'CUSTOM_TEXT' });
      //     }
      //     delete response.quickreplies;
      // }
      console.log("SENDING RESPONSE");
      console.log(response);
      console.log(response.quickreplies);

      let data = null;

      if (JsonUtil.isJsonString(response)) {
        data = JSON.parse(response);
      } else {
        data = {"text": response};
      }

      return FB.fbMessage(recipientId, data, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Giving the wheel back to our bot
      cb();
    }
  },

  merge(sessionId, context, entities, response, cb) {
    // Retrieve the location entity and store it into a context field
    // console.log(entities);
    const giftRecipient = firstEntityValue(entities, 'giftRecipient');
    const giftType = firstEntityValue(entities, 'giftType');
    const gender = firstEntityValue(entities, 'gender');
    const filterByPrice = firstEntityValue(entities, 'filterByPrice');
    const newKeyword = firstEntityValue(entities, 'keyword');
    // context.keywords = ["orange", "yellow"];
    // let keywords;
    // if (context.keywords && newKeyword) {
    //   context.keywords.push(newKeyword);
    // } else if (!context.keywords && newKeyword) {
    //   context.keywords = [];
    //   context.keywords.push(newKeyword);
    // } else if (!context.keywords) {
    //   context.keywords = [];
    // }

    if (giftRecipient) {
      context.giftRecipient = giftRecipient; // store it in context
    }
    if (giftType) {
      context.giftType = giftType; // store it in context
    }
    if (gender) {
      context.gender = gender; // store it in context
    }
    if (filterByPrice) {
      context.filterByPrice = filterByPrice; // store it in context
    }
    if (newKeyword) {
      context.newKeyword = newKeyword; // store it in context
    }
    // console.log("giftRecipient: " + context.giftRecipient);
    // console.log("giftType: " + context.giftType);
    // console.log("gender: " + context.gender);
    // console.log("filterByPrice: " + context.filterByPrice);
    // console.log("newKeyword" + newKeyword);
    // console.log("context.keywords " + context.keywords[0]);
    // console.log("context.keywords " + context.keywords[1]);
    // console.log("context.keywords " + context.keywords[2]);
    // console.log("context.keywords length" + context.keywords.length);
    cb(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  // fetch-weather bot executes

  ['getGift'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    // console.log("gender in searchGifts" + context.gender);
    // console.log("giftType in searchGifts" + context.giftType);
    // console.log("giftRecipient in searchGifts" + context.giftRecipient);
    // console.log("keywords in searchGifts" + context.keywords);

    console.log("gift type is: " + context.giftType);
    // searchItem(context.giftType)
    //   .then(response => console.log(response[0]));

    searchItem(context.giftType)
      .then(response => {
        let template = JSON.stringify({
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": `${response[0]["ItemAttributes"][0]["Title"]}`,
                "subtitle": `${response[0]["ItemAttributes"][0]["ListPrice"]}`,
                "image_url": `${response[0]["MediumImage"][0]["URL"]}`,
                "buttons": [{
                  "type": "web_url",
                  "url": `${response[0]["DetailPageURL"]}`,
                  "title": "details & buy"
                }, {
                  "type": "web_url",
                  "title": "share"
                }],
              }, {
                "title": `${response[1]["ItemAttributes"][1]["Title"]}`,
                "subtitle": `${response[1]["ItemAttributes"][1]["ListPrice"]}`,
                "image_url": `${response[1]["MediumImage"][1]["URL"]}`,
                "buttons": [{
                  "type": "web_url",
                  "url": `${response[1]["DetailPageURL"]}`,
                  "title": "details & buy"
                }, {
                  "type": "web_url",
                  "title": "share"
                }],
              }, {
                "title": `${response[2]["ItemAttributes"][2]["Title"]}`,
                "subtitle": `${response[2]["ItemAttributes"][2]["ListPrice"]}`,
                "image_url": `${response[2]["MediumImage"][2]["URL"]}`,
                "buttons": [{
                  "type": "web_url",
                  "url": `${response[2]["DetailPageURL"]}`,
                  "title": "details & buy"
                }, {
                  "type": "web_url",
                  "title": "share"
                }],
              }, {
                "title": `${response[3]["ItemAttributes"][3]["Title"]}`,
                "subtitle": `${response[3]["ItemAttributes"][3]["ListPrice"]}`,
                "image_url": `${response[3]["MediumImage"][3]["URL"]}`,
                "buttons": [{
                  "type": "web_url",
                  "url": `${response[3]["DetailPageURL"]}`,
                  "title": "details & buy"
                }, {
                  "type": "web_url",
                  "title": "share"
                }],
              }, {
                "title": `${response[4]["ItemAttributes"][4]["Title"]}`,
                "subtitle": `${response[4]["ItemAttributes"][4]["ListPrice"]}`,
                "image_url": `${response[4]["MediumImage"][4]["URL"]}`,
                "buttons": [{
                  "type": "web_url",
                  "url": `${response[4]["DetailPageURL"]}`,
                  "title": "details & buy"
                }, {
                  "type": "web_url",
                  "title": "share"
                }],
              }]
            }
          }
        });
        context.gift = template;
      });
    // context.filteredGifts = 'FILTERED GIFTS';
    // let stringifiedKeywords;
    // context.stringifiedKeywords  = context.keywords[0];
    // console.log("this is the type:");
    // console.log(typeof(context.giftType));
    // context.stringifiedKeywords  = context.newKeyword;
    // console.log("beginning");
    // console.log(AmazonApiUtil.searchItem(context.giftType));
    // console.log("end");

    //YOU CAN ACCESS giftRecipient, giftType, and gender
    cb(context);
  },

  ['showButtons'](sessionId, context, cb) {
    console.log(context);
    context.showButtonOptions = JSON.stringify({
      "text":"showing Buttons..",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"more suggestions",
          "payload":"MORE_SUGGESTIONS"
        },
        {
          "content_type":"text",
          "title":"search by filters",
          "payload":"SEARCH_BY_FILTERS"
        },
        {
          "content_type":"text",
          "title":"new search please!",
          "payload":"NEW_SEARCH_PLEASE"
        }
      ]
    });
    cb(context);
  },

  ['showFilterOptions'](sessionId, context, cb) {
    context.showFilterOptions = JSON.stringify({
      "text":"filter options....",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Subject",
          "payload":"FILTER_BY_SUBJECT"
        },
        {
          "content_type":"text",
          "title":"Brand Name",
          "payload":"FILTER_BY_BRAND_NAME"
        },
        {
          "content_type":"text",
          "title":"Price Range",
          "payload":"FILTER_BY_PRICE_RANGE"
        },
        {
          "content_type":"text",
          "title":"Size",
          "payload":"FILTER_BY_SIZE"
        }
      ]
    });
    cb(context);
  },

  // ['filterByPrice'](sessionId, context, cb) {
  //   console.log("in searchGifts.... ");
  //   // Here should go the api call, e.g.:
  //   // context.forecast = apiCall(context.loc)
  //   context.filteredGifts = 'FILTERED GIFTS';
  //
  //
  //   //YOU CAN ACCESS giftRecipient, giftType, and gender
  //   cb(context);
  // }

  // ['setGiftRecipient'](sessionId, context, cb) {
  //   console.log("in searchGifts.... ");
  //   // Here should go the api call, e.g.:
  //   // context.forecast = apiCall(context.loc)
  //   context.giftRecipient = 'POSSIBLE GIFTS';
  //   cb(context);
  // },


};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}
