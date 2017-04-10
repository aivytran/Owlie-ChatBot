'use strict';

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const request = require('request');
const Config = require('./const.js');

const getProfile = (id, cb) => {
  request({
    method: 'GET',
    uri: `https://graph.facebook.com/v2.6/${id}`,
    qs: {
      fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
      access_token: Config.FB_PAGE_TOKEN
    },
    json: true
    }, (err, res, body) => {
      if (err) return cb(err)
      if (body.error) return cb(body.error)
      cb(body)
    })
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
      sender_action:"typing_on",
      message: data,
      sender_action:"typing_off"
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
  getProfile: getProfile
};
