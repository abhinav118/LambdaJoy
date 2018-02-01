'use strict';

var Bot = require('./bot');

exports.handler = (event, context, cb) => {

  console.log(JSON.stringify(event));

  if(event.hub && event.hub.mode == 'subscribe') {
    if(event.hub.verify_token == TOKEN) {
      cb(null, parseInt(event.hub.challenge));
    }
  }
var parsedata = JSON.parse(event.body);
    var data=JSON.parse(parsedata.body);


//var data=JSON.parse(event.body);

  if(data && data.object == 'page') {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((message) => {
        if (message.optin) {
          var message = {
            optin: message.optin,
            user: message.sender.id,
            channel: message.sender.id,
            timestamp: message.timestamp
          };

          Bot.controller.trigger('optin', [Bot.bot, message]);
        } else if (message.message) {
          var message = {
            text: message.message.text,
            user: message.sender.id,
            channel: message.sender.id,
            timestamp: message.timestamp,
            seq: message.message.seq,
            mid: message.message.mid,
            attachments: message.message.attachments,
            quick_reply: message.message.quick_reply
          };


        console.log(">>>controller message",message)

          Bot.controller.receiveMessage(Bot.bot, message);
        } else if (message.delivery) {
          var message = {
            optin: message.delivery,
            user: message.sender.id,
            channel: message.sender.id,
            timestamp: message.timestamp
          };

          Bot.controller.trigger('message_delivered', [Bot.bot, message]);
        } else if (message.postback) {
          
          var message = {
            text: message.postback.payload,
            user: message.sender.id,
            channel: message.sender.id,
            timestamp: message.timestamp
          };
          console.log(">>>POSTBACK message called",message)

         // Bot.controller.trigger('postback', [Bot.bot, message]);

          Bot.controller.receiveMessage(Bot.bot, message);
        } else {
          Bot.controller.log('Got an unexpected message from Facebook: ', message);
        }
      })
    })

    cb(null, {});
  }
}

function loadBotDetails(controller) {
  let botConfig = controller.config.botConfig;

  let loadingPromises = [];

  if (botConfig.pos_type == 'square') {
    loadingPromises.push(loadSquareV2PosDetails(botConfig));
  } else if (botConfig.pos_type == 'revel') {
    loadingPromises.push(loadRevelPosDetails(botConfig));
  }

  loadingPromises.push(
    loadFBPageInfo(botConfig.page_token).then((body) => {
      let data = JSON.parse(body).data;
      botConfig.page_picture = controller.config.botConfig.page_picture;
    })
  );

  return Promise.all(loadingPromises);
}

