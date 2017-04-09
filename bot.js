'use strict';

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
    // console.log(response);

    // Bot testing mode
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    const recipientId = context._fbid_;
    if (recipientId) {

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
        // Give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      cb();
    }
  },

  clearContext(sessionId, context, cb) {
    console.log(context);
    console.log("clearing context..");
    context.giftRecipient = undefined;
    context.giftType = undefined;
    context.itemPage = 0;
    context.gender = undefined;
    context.newKeyword = undefined;
    console.log(context);

    cb(context);
  },

  merge(sessionId, context, entities, response, cb) {
    const giftRecipient = firstEntityValue(entities, 'giftRecipient');
    const giftType = firstEntityValue(entities, 'giftType');
    const gender = firstEntityValue(entities, 'gender');
    const filterByPrice = firstEntityValue(entities, 'filterByPrice');
    const newKeyword = firstEntityValue(entities, 'keyword');

    if (giftRecipient) {
      context.giftRecipient = giftRecipient;
    }
    if (giftType) {
      context.giftType = giftType;
      context.itemPage = 0;
    }
    if (gender) {
      context.gender = gender;
    }
    if (filterByPrice) {
      context.filterByPrice = filterByPrice;
    }
    if (newKeyword) {
      context.newKeyword = newKeyword;
    }

    cb(context);
  },

  ['incrementItemPage'](sessionId, context, cb) {
    console.log("Inside incrementItemPage function ....");
    context.itemPage += 1;
    console.log(context);

    console.log("ending incrementItemPage.. ");
  },

  // clearContext(sessionId, context, entities, response, cb) {
  //   const clearContext = firstEntityValue(entities, 'clearContext');
  //
  //
  //   if (clearContext) {
  //     context.giftRecipient = undefined;
  //     context.giftType = undefined;
  //     context.gender = undefined;
  //     context.newKeyword = undefined;
  //     console.log("clearing context");
  //   }
  //
  //   cb(context);
  // },

  // findMethod(sessionId, context, entities, response, cb) {
  //   const method = firstEntityValue(entities, 'method');
  //
  //   if (method === 'more suggestions') {
  //     this.getGift();
  //   }
  //   if (method === "showButtons") {
  //     this.showButtons();
  //   }
  // },


  error(sessionId, context, error) {
    console.log(error.message);
  },

  //bot executes
  ['getGift'](sessionId, context, cb) {
    context.itemPage += 1;

    console.log("gift type is: " + context.giftType);
    console.log("the item page is " + context.itemPage);
    console.log(" ");
    console.log("beginning of context .....");
    console.log(context);
    console.log("end of context .....");
    console.log(" ");

    searchItem(context.giftType, context.itemPage)
      .then(response => {
        let cards = [];
        let title;
        let price;
        let imageUrl;
        let url;

        for (let i = 0; i < response.length; i++) {
          title = response[i];
          if (!!title["ItemAttributes"][0]["Title"]) {
            title = title["ItemAttributes"][0]["Title"][0];
          } else {
            title = "";
          }

          price = response[i];
          if (!!price["ItemAttributes"][0]["ListPrice"]) {
            price = price["ItemAttributes"][0]["ListPrice"][0]["FormattedPrice"][0];
          } else {
            price = "";
          }

          imageUrl = response[i];
          if (!!imageUrl["LargeImage"]) {
            imageUrl = imageUrl["LargeImage"][0]["URL"][0];
          } else {
            imageUrl = "http://res.cloudinary.com/d239j12/image/upload/v1491707637/noimagefound_vcaxfn.jpg";
          }

          url = response[i];
          if (!!url["DetailPageURL"]) {
            url = url["DetailPageURL"][0];
          } else {
            url = "http://www.amazon.com";
          }

          cards.push( {
            "title": title,
            "subtitle": price,
            "image_url": imageUrl,
            "buttons": [
              {
                "type": "web_url",
                "url": url,
                "title": "details & buy"
              }
            ],
          });
        }

        let template = JSON.stringify({
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": cards
            }
          }
        });

        context.gift = template;
      });
    // context.giftRecipient = undefined;
    // context.gender = undefined;
    // context.gift = undefined;
    cb(context);
  },

  ['showButtons'](sessionId, context, cb) {
    // console.log(context);
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


  // ['clearContext'](sessionId, context, cb) {
  //   console.log(context);
  //   console.log("clearing context..");
  //   context.giftRecipient = undefined;
  //   context.giftType = undefined;
  //   context.itemPage = 0;
  //   context.gender = undefined;
  //   context.newKeyword = undefined;
  //   console.log(context);
  //
  //   cb(context);
  // },

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
  }

};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}
