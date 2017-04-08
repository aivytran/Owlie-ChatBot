'use strict';

const bodyParser = require('body-parser');
const express = require('express');

// get Bot, const, and Facebook API
const bot = require('./bot.js');
const Config = require('./const.js');
const FB = require('./facebook.js');

// Set up bot
const wit = bot.getWit();

// Webserver parameter
const PORT = process.env.PORT || 8445;

const sessions = {};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Check if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    };
  }
  return sessionId;
};

// Starting our webserver and putting it all together
const app = express();
app.set('port', PORT);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.use(bodyParser.json());

// index
app.get('/', function(req, res) {
  res.send('"Only those who will risk going too far can possibly find out how far one can go." - T.S. Eliot');
});


// Webhook verify setup using FB_VERIFY_TOKEN
app.get('/webhook', (req, res) => {
  if (!Config.FB_VERIFY_TOKEN) {
    throw new Error('missing FB_VERIFY_TOKEN');
  }
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

// The main message handler
app.post('/webhook', (req, res) => {
  // Parsing the Messenger API response
  const messaging = FB.getFirstMessagingEntry(req.body);
  console.log(messaging);

  if (messaging.postback) {
    if (messaging.postback.payload === "USER_GET_STARTED") {
      console.log("index");
      let name = "test"
      FB.getProfile(messaging.sender.id, (body) => {
        name = body.first_name;
      })
      FB.fbMessage(
        messaging.sender.id,
        {attachment:{
          type:"image",
          payload:{
            "url":"http://res.cloudinary.com/candycanetrain/image/upload/v1491616754/owlie_slow_aqj8yo.gif"
            }
          }
        }
      );
      setTimeout(() => FB.fbMessage(
        messaging.sender.id,
        {text: `Oh, hey ${name} 👋. I'm Owlie! I'm here to help you with gifts!😍 You can tell me things like: buy gift 🎁 or remind me to send gift ⏰`}
      ), 2000);
    }
  }
  else if (messaging && messaging.message) {
    // retrieve the Facebook user ID
    const sender = messaging.sender.id;

    // retrieve the user's current session or create one if it doesn't exist
    const sessionId = findOrCreateSession(sender);

    // retrieve the message content
    const msg = messaging.message.text;
    const atts = messaging.message.attachments;

    if (atts) {
      FB.fbMessage(
        sender,
        {text: 'Sorry I can only process text messages for now.'}
      );
    } else if (msg) {
      wit.runActions(
        sessionId, // the user's current session
        msg, // the user's message
        sessions[sessionId].context, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            console.log('Waiting for futher messages.');

            // Updating the user's current session state
            sessions[sessionId].context = context;
          }
        }
      );
    }
  }
  res.sendStatus(200);
});
