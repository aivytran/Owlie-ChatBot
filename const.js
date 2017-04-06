'use strict';

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;
if (!WIT_TOKEN) {
  throw new Error('missing WIT_TOKEN');
}

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
if (!FB_VERIFY_TOKEN) {
  FB_VERIFY_TOKEN = "just_do_it";
}

// AWS API parameters
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_ASSOCIATE_TAG = process.env.AWS_ASSOCIATE_TAG;

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  AWS_ACCESS_KEY: AWS_ACCESS_KEY,
  AWS_SECRET_KEY: AWS_SECRET_KEY,
  AWS_ASSOCIATE_TAG: AWS_ASSOCIATE_TAG
};
