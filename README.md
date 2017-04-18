# Owlie the GiftBot

[Owlie the Giftbot live](https://owliethegiftbot.herokuapp.com)

## Description

Owlie the GiftBot is a Facebook Messenger chatbot that helps you find gifts for people as well as reminds you to buy gift for those important people in your life (It can send you a FB message at a specific date and time that you set).

We learned the necessary technologies and completed the project all within 7 days.

## Instructions

Go to the link above and click the "Message Us" button, which will lead you to FB Messenger. You can start chatting with our bot once you log in!

## Demo

![Gif of Owlie](http://res.cloudinary.com/candycanetrain/video/upload/c_scale,q_57,w_308/v1491812527/official1small_wiyl6c.gif)

### Persistent Menu

![Gif of Persistent Menu](http://res.cloudinary.com/candycanetrain/video/upload/c_scale,w_308/v1491809314/official2_biuvj9.gif)

## Technologies and Development

* Wit.ai
* Facebook Messenger developer's platform
* Node.js with Express.js
* MongoDB
* Amazon API
* Heroku

We used Wit.ai, a machine learning API that processes natural language into actionable data, and combined it with the Facebook Messenger platform in order to create an interactive chatbot. For the backend, we used Express.js, a web application framework for Node.js, and MongoDB for the database.

### Real-time interactive chat
Facebook Messenger provides our app with real-time information (i.e. whenever someone sends a message to our chatbot), so we set up a webhook through Heroku to receive these real-time POST requests. When our web app receives a POST request, it will either process the message itself or deliver the message to Wit.ai for processing. This is dependent on the user's message.

### Set Reminders
For our Set Reminder feature, when the user sets a reminder, Wit.ai calls `setReminder()` in our web app, giving it `giftRecipient` and `reminderDate` as the `context`. The information is then saved to MongoDB. Meanwhile, in `index.js`, we set up `setInterval(createReminderProcessor(), 15000);` to check the database every 15 seconds for any expired reminders. When there is an expired reminder, the web app fires a POST request to the FB Messenger API, which then sends a message to the user, and deletes the reminder from our database.

### Gift Suggestions using Amazon API
The Gift Suggestions feature utilizes Amazon API. When the user provides a `giftType`, Wit.ai calls `getGift()` in our app, which then makes a POST request to Amazon API. Then we parse the XML response into JSON, so that it could be sent to Messenger API for rendering.

## Technical Implementation Decisions

* Due to the interactive nature of our chatbot, we chose Node.js with Express.js over  Ruby on Rails.
* We chose MongoDB over PostgreSQL because it is more suited to dynamic queries of frequently written or read data.
* We chose Wit.ai over Api.ai for its voice recognition feature, which we plan to implement in the future.

## Challenges

* Since Wit.ai is relatively new, we encountered a lot of bugs that were out of our control. Wit.ai has a 'stories' feature that is in Beta, which was not as reliable as we had expected. We had to devise ways to work around the unreliability of the technology.
* Amazon API calls returned XML responses that were formatted differently based on the search item. We had to take that into consideration when rendering gift details.

## Future features!
* Incorporate voice recognition so that user can speak to Owlie.
* Allow in-app, automatic order through Facebook Messenger (using Messenger's payment option feature).
* Deploy it on other platforms, such as Skype, LINE, and Slack.
