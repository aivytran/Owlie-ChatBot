'use strict';

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const request = require('request');
const Config = require('./const.js');

const createGreetingApi = (data) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {
      access_token: Config.FB_PAGE_TOKEN
    },
    method: 'POST',
    json: data

  }, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("Greeting set successfully!");
  } else {
    console.error("Failed calling Thread Reference API", response.statusCode,     response.statusMessage, body.error);
  }
  });
}

const setGreetingText = () => {
  const greetingData = {
    setting_type: "greeting",
    greeting:{
    text:"Welcome!!!!"
    }
  };
  createGreetingApi(greetingData);
}

const fbReq = request.defaults({
  uri: 'https://graph.facebook.com/me/messages',
  method: 'POST',
  json: true,
  qs: {
    access_token: Config.FB_PAGE_TOKEN
  },
  headers: {
    'Content-Type': 'application/json'
  },
});


const fbMessage = (recipientId, data, cb) => {
  const opts = {
    form: {
      recipient: {
        id: recipientId,
      },
      message: data,
    },
  };

  fbReq(opts, (err, resp, data) => {
    if (cb) {
      cb(err || data.error && data.error.message, data);
    }
  });
};


// See the Webhook reference
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
const getFirstMessagingEntry = (body) => {
  const val = body.object === 'page' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].messaging &&
    Array.isArray(body.entry[0].messaging) &&
    body.entry[0].messaging.length > 0 &&
    body.entry[0].messaging[0];

  return val || null;
};


module.exports = {
  getFirstMessagingEntry: getFirstMessagingEntry,
  fbMessage: fbMessage,
  fbReq: fbReq,
  setGreetingText: setGreetingText
};
