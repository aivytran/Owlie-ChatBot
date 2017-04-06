'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');

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
  say(sessionId, context, response, cb) {
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
      if(response.quickreplies) { // Wit.ai wants us to include quickreplies, alright!
          response.quick_replies = [];

          for(var i = 0, len = response.quickreplies.length; i < len; i++) { // Loop through quickreplies
              response.quick_replies.push({ title: response.quickreplies[i], content_type: 'text', payload: 'CUSTOM_TEXT' });
          }
          delete response.quickreplies;
      }
      return FB.fbMessage(recipientId, response, (err, data) => {
        console.log("in Facebook");
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
    // console.log("this is what the context looks like ");
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

  ['searchGifts'](sessionId, context, cb) {
    console.log("gender in searchGifts " + context.gender);
    console.log("giftType in searchGifts " + context.giftType);
    console.log("giftRecipient in searchGifts " + context.giftRecipient);
    // console.log("keywords in searchGifts" + context.keywords);

    context.possibleGifts = 'POSSIBLE GIFTS';
    context.filteredGifts = 'FILTERED GIFTS';
    // let stringifiedKeywords;
    // context.stringifiedKeywords  = context.keywords[0];
    context.stringifiedKeywords  = context.newKeyword;

    //YOU CAN ACCESS giftRecipient, giftType, and gender
    cb(context);
  }
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
