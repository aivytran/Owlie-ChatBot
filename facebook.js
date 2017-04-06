'use strict';

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const request = require('request');
const Config = require('./const.js');

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
      message: {
  	    "attachment": {
  		    "type": "template",
  		    "payload": {
  				"template_type": "generic",
  			    "elements": [{
  					"title": "First card",
  				    "subtitle": "Element #1 of an hscroll",
  				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
  				    "buttons": [{
  					    "type": "web_url",
  					    "url": "https://www.messenger.com",
  					    "title": "web url"
  				    }, {
  					    "type": "postback",
  					    "title": "Postback",
  					    "payload": "Payload for first element in a generic bubble",
  				    }],
  			    }, {
  				    "title": "Second card",
  				    "subtitle": "Element #2 of an hscroll",
  				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
  				    "buttons": [{
  					    "type": "postback",
  					    "title": "Postback",
  					    "payload": "Payload for second element in a generic bubble",
  				    }],
  			    }]
  		    }
  	    }
      };,
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
  fbReq: fbReq
};
