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
  say(sessionId, context, message, cb) {
    console.log(message);

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
      FB.fbMessage(recipientId, message, (err, data) => {
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

  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    console.log("this is merging....");
    console.log(entities);
    const giftRecipient = firstEntityValue(entities, 'giftRecipient');
    const giftType = firstEntityValue(entities, 'giftType');
    const gender = firstEntityValue(entities, 'gender');
    const filterByPrice = firstEntityValue(entities, 'filterByPrice');

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
    console.log("this is what the context looks like");
    console.log("giftRecipient: " + giftRecipient);
    console.log("giftType: " + giftType);
    console.log("gender: " + gender);
    console.log("filterByPrice: " + filterByPrice);
    cb(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  // fetch-weather bot executes
  ['getGift'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.gift = 'shoes';
    cb(context);
  },

  ['searchGifts'](sessionId, context, cb) {
    console.log("in searchGifts.... ");
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.possibleGifts = 'POSSIBLE GIFTS';
    console.log(context.gender);
    console.log(context.giftType);
    console.log(context.giftRecipient);
    //YOU CAN ACCESS giftRecipient, giftType, and gender
    cb(context);
  },
  ['filterByPrice'](sessionId, context, cb) {
    console.log("in searchGifts.... ");
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.filteredGifts = 'FILTERED GIFTS';

    //YOU CAN ACCESS giftRecipient, giftType, and gender
    cb(context);
  }

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
