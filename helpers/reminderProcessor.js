// const builder = require('botbuilder');
// const consts = require('../helpers/consts');
const Reminder = require('../models/reminder');
const FB = require('../facebook.js');

/**
 * Returns a function that queries MongoDB for expired reminders, sends notifications and cleans up the database.
 * @param bot {UniversalBot}
 * @returns {Function}
 */
module.exports = () => {
    // if (!(bot instanceof builder.UniversalBot)) {
    //     throw new Error('Invalid argument: bot must be an instance of UniversalBot.')
    // }
    return () => {
        // Query MongoDB to retrieve the reminders that recently expired
        const currentDate = new Date()
        console.log(currentDate);
        Reminder.find({ expiration: { $lte: currentDate } }, (err, res) => {
            if (err !== null) {
                return console.error(err);
            }

            res.forEach(reminder => {
                // Build a notification message and address it to user who created the reminder
                // const msg = new builder.Message()
                //     .address(reminder.user_address)
                //     .text(consts.Messages.REMINDER, reminder.value);
                console.log("found reminder");
                console.log(reminder);
                FB.fbMessage(
                  reminder.user_id,
                  {text: "oh yayyyyyyyyy"},
                  (err) => {
                    if (err) {
                      console.log(
                        'Oops! An error occurred while forwarding the response to',
                        reminder.user_id,
                        ':',
                        err
                      );
                    } else {
                      Reminder.remove({ _id: reminder._id }, err => {
                          if (err !== null) {
                              console.error(err);
                          }
                      });
                    }
                });

                // Send message and remove each reminder afterwards
                // bot.send(msg, () => {
                //     Reminder.remove({ _id: reminder._id }, err => {
                //         if (err !== null) {
                //             console.error(err);
                //         }
                //     });
                // });
            });
        });
    };
};
