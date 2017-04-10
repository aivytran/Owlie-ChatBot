'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const createReminderProcessor = require('./helpers/reminderProcessor');

//setup mongodb
mongoose.connect("mongodb://heroku_2gt6f8p3:p475lmnk33sei94t8f6r5eo7hh@ds155820.mlab.com:55820/heroku_2gt6f8p3", err => {
    if (err) {
        return console.error(err);
    }
    console.log("Connected to MongoDB");
});

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

const findUserID = (sessionId) => {
  console.log(sessions);
  Object.values(sessions);
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

  // retrieve the Facebook user ID
  const sender = messaging.sender.id;

  // retrieve the user's current session or create one if it doesn't exist
  const sessionId = findOrCreateSession(sender);

  if (messaging.postback) {
    const payload = messaging.postback.payload;
    if (payload === "USER_BUY_GIFT") {
      console.log("in user buy gift");
      wit.runActions(
        sessionId, // the user's current session
        "buy gift", // the user's message
        {_fbid_: sender}, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            console.log('Waiting for futher messages.');
            sessions[sessionId].context = context;
          }
        }
      );
    } else if (payload === "USER_REMINDER") {
      console.log("in user reminder");
      wit.runActions(
        sessionId, // the user's current session
        "set reminder", // the user's message
        {_fbid_: sender}, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            console.log('Waiting for futher messages.');
            sessions[sessionId].context = context;
          }
        }
      );
    } else if (payload === "USER_GET_STARTED") {
      console.log("index");
      let name = "test";
      FB.getProfile(messaging.sender.id, (body) => {
        name = body.first_name;
      });
      FB.fbMessage(
        sender,
        {attachment:{
          type:"image",
          payload:{
            "url":"http://res.cloudinary.com/candycanetrain/image/upload/v1491616754/owlie_slow_aqj8yo.gif"
            }
          }
        }
      );

      setTimeout(() => {
        FB.fbMessage(
        sender,
        {text: `Oh, hey ${name} 👋. I'm Owlie! I'm here to help you with gifts! 😍`}
      )}, 2000);

      setTimeout(() => {
        FB.fbMessage(
        sender,
        {"attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"What would you like to do?",
              "buttons":[
                {
                  "type":"postback",
                  "title":"🎁  Buy gift",
                  "payload":"USER_BUY_GIFT"
                },
                {
                  "type":"postback",
                  "title":"⏰  Remind to send gift",
                  "payload":"USER_REMINDER"
                },
                {
                  "type":"postback",
                  "title":"😭  Help",
                  "payload":"USER_HELP"
                }
              ]
            }
          }
        }
      )}, 3000);
    }
  }
  else if (messaging && messaging.message) {
    // retrieve the message content
    const msg = messaging.message.text;
    const atts = messaging.message.attachments;
    console.log("  ");
    console.log("..printing messaging.message..");
    console.log(messaging.message);
    console.log("..ending messaging.message..");
    console.log("  ");


    if (atts) {
      FB.fbMessage(
        sender,
        {text: 'Sorry I can only process text messages for now.'}
      );
    }
    // else if (messaging.message.quick_reply) {
    //   const payload = messaging.message.quick_reply.payload;
    //   if (payload === 'MORE_SUGGESTIONS'){
    //         sessions[sessionId].context.itemPage += 1;
    //         console.log("INSIDE MORE SUGGESTIONS FUNCTION!!");
    //         wit.runActions(
    //           sessionId, // the user's current session
    //           "buy gift", // the user's message
    //           {_fbid_: sender,
    //             giftRecipient: sessions[sessionId].context.giftRecipient,
    //             gender: sessions[sessionId].context.gender,
    //             giftType: sessions[sessionId].context.giftType,
    //             itemPage: sessions[sessionId].context.itemPage }, // the user's current session state
    //           (error, context) => {
    //             if (error) {
    //               console.log('Oops! Got an error from Wit:', error);
    //             } else {
    //               console.log('Waiting for futher messages.');
    //               sessions[sessionId].context = context;
    //             }
    //           }
    //         );
    //   }
    // }
    else if (msg === "more suggestions") {
      sessions[sessionId].context.itemPage += 1;
      console.log("INSIDE MORE SUGGESTIONS FUNCTION!!");
      wit.runActions(
        sessionId, // the user's current session
        "buy gift", // the user's message
        {_fbid_: sender,
          giftRecipient: sessions[sessionId].context.giftRecipient,
          gender: sessions[sessionId].context.gender,
          giftType: sessions[sessionId].context.giftType,
          itemPage: sessions[sessionId].context.itemPage }, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            console.log('Waiting for futher messages.');
            sessions[sessionId].context = context;
          }
        }
      );
    }
    else if (msg === "new search please!") {
      console.log("INSIDE CLEAR FUNCTION!!");
      wit.runActions(
        sessionId, // the user's current session
        "new search please!", // the user's message
        {_fbid_: sender}, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            console.log('Waiting for further messages.');
            sessions[sessionId].context = context;
          }
        }
      );
    }
    else if (msg) {
      wit.runActions(
        sessionId, // the user's current session
        msg, // the user's message
        sessions[sessionId].context, // the user's current session state
        (error, context) => {
          if (error) {
            console.log('Oops! Got an error from Wit:', error);
          } else {
            console.log('Waiting for futher messages.');
            sessions[sessionId].context = context;
          }
        }
      );
    }
  }

  res.sendStatus(200);
});


// Set up interval to process reminder
setInterval(createReminderProcessor(), 15000);
