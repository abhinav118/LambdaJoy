'use strict';

const env = require('node-env-file');
const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const path = require('path');
const loadFBPageInfo = require('../loaders/facebook');
const loadSquareV2PosDetails = require('../loaders/square');
const loadRevelPosDetails = require('../loaders/revel');
const orderCategories = require('../conversation_helpers/orderCategories');
const orderItems = require('../conversation_helpers/orderItems');

const Botkit = require('botkit');
const debug = require('debug')('botkit:main');
//const prod = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'PRODUCTION';

// const mongoStorage = require('botkit-storage-mongo')({
//   mongoUri: process.env.CHATBOTDB_URL,
//   tables: ['chat']
// })

global.Promise = require('bluebird');



let botConfigs = [
  {
    "name": "Ramen",
    "pos_type": "square",
    "page_token": "EAAa3rjvslPEBAF8ZCrfmPDOZAkGZCjjdQR6aTnitPXDZAHSJuISnMRNZBZBtGGeeoZAcuI8D0ffjkukPgmeaWzblmZC14OTAEfiaVdp1utIS9L5mlm0WXb7Bsa0Jzgr1QqMTZBjL4A9lIJOB2CO8xpPmRZCPt6t9mb60D4eZBFrRBqu4gZDZD",
    "page_id": "1249100721847943",
    "page_picture": [
      "https://scontent-atl3-1.xx.fbcdn.net/v/t31.0-8/21055937_751993558317593_5146325322411466746_o.jpg?oh=617937698804ea668c2b5167fad5f266&oe=5A4D7531",
      "https://scontent-atl3-1.xx.fbcdn.net/v/t31.0-8/20229716_736162716567344_8300090306879866688_o.jpg?oh=ef5effe11707dd6c61e67f75629b8d25&oe=5A453755",
      "https://scontent-atl3-1.xx.fbcdn.net/v/t31.0-8/18953511_716242958559320_4015504055810388617_o.jpg?oh=3bdebcd300504df0ff25a926fb92fd93&oe=5A3E8F58"
    ],
    "page_picture": [
      "https://d2isyty7gbnm74.cloudfront.net/unsafe/1292x1292/https://square-production.s3.amazonaws.com/files/8a74baee4eeddb2df68eaf56963dec9513bb5f09/original.jpeg",
      "https://d2isyty7gbnm74.cloudfront.net/unsafe/1292x1292/https://square-production.s3.amazonaws.com/files/2745d0c52f0a632aee926579a139ff2443de1601/original.jpeg",
      "https://d2isyty7gbnm74.cloudfront.net/unsafe/1292x1292/https://square-production.s3.amazonaws.com/files/7d3495d17a2c0a0e3655abb3c3ebe523bdd3c3d1/original.jpeg",
      "https://d2isyty7gbnm74.cloudfront.net/unsafe/1292x1292/https://square-production.s3.amazonaws.com/files/4ae409269d1751901777d7f8fac026e1fa3b9679/original.jpeg"
    ],
    "merchant_uid": "5a70fcfab4cd49001afd2e63",
    "vendor_id": "2NNZN11XG0MT3",
    "square_location_id": "1KQM383TVN13E",
    "square_access_token": "sq0atp-Nv2tdgdgkK77jnHA6-TN_A",
    "product_images": {}
  }];

let controllers = {};
let botConfigLoaders = [];
 var controller;
var bot ;
var orderHelper;
botConfigs.forEach(botConfig => {
  // Create the Botkit controller, which controls all instances of the bot.
   controller = Botkit.facebookbot({
      debug: true,
      receive_via_postback: true,
      verify_token: botConfig.verify_token,
      access_token: botConfig.page_token,
      studio_token: botConfig.studio_token,
      studio_command_uri: botConfig.studio_command_uri,
      facebook_referral:botConfig.facebook_referral,
      botConfig: botConfig
      // require_delivery: true,
      // dashbot_key: botConfig.dashbot_key || undefined,
      // storage: mongoStorage
  });

  controllers[botConfig.page_id] = controller;
  bot = controller.spawn({});
 orderHelper= new (require('../conversation_helpers/orders.js'))(controller);

  // Load POS API data for the bot
  botConfigLoaders.push(loadBotDetails(controller));
});



console.log('Initializing Bot Configuration Loaders');

Promise.all(botConfigLoaders).then((data) => {
  console.log('Bot Configurations loaded successfully');

  console.log('Initializing bots..');

  // Set up an Express-powered webserver to expose oauth and webhook endpoints
  // var webserver = require(__dirname + '/components/express_webserver.js')(controllers);

  // Object.keys(controllers).forEach(botid => {
  //   let controller = controllers[botid];
  
  //   // Tell Facebook to start sending events to this application
  //   require(__dirname + '/components/subscribe_events.js')(controller);

  //   // Set up Facebook "thread settings" such as get started button, persistent menu
  //   require(__dirname + '/components/thread_settings.js')(controller);


  //   // Send an onboarding message when a user activates the bot
  //   require(__dirname + '/components/onboarding.js')(controller);

  //   // Enable Dashbot.io plugin
  //   require(__dirname + '/components/plugin_dashbot.js')(controller);

  //   var normalizedPath = require("path").join(__dirname, "skills");
  //   require("fs").readdirSync(normalizedPath).forEach(function(file) {
  //     let skill = require("./skills/" + file);

  //     let skillInst = new skill(controller);
  //     //require("./skills/" + file)(controller);
  //   });
  // })

}).catch((err) => {
  console.log('Error loading bot configurations: ' + err);
})




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

controller.hears([/main menu/i,/menu/i,/order 👍/i,/Main Menu/i,/MainMenu/i,/Mainmenu/i,/Menu/i], 'message_received', function(bot, message) {
    //orderHelper.resetOrder(message);
    console.log('>>Main menu called');
    // TODO: integrate messenger profile API to get name
  //  bot.replyWithTyping(message, "Hi there!! Welcome to The Crepe House 👋");
    // orderHelper.displayMainMenu(bot, message);
    orderCategories(bot,message);
  });
controller.hears([/ordercato/i,new RegExp('ORDERKEY.*','i')], 'message_received', function(bot, message) {
 
 console.log('>>ITEMS MENU called',message.text,controller.config.botConfig);

  orderItems(bot,message,message.text.replace("ORDERKEY_", ""));
  // let botConfig = controller.config.botConfig;

  //   let [action, ...details] = message.text.split('/');
  //   //let [menuCategory] = details;
  //   let [menuId, subMenuId] = details;
  //  // console.log('menuId: ' + menuId,'subMenuId' + subMenuId);
  //   if (botConfig.menuItems[menuId].subcategories && !subMenuId) {
  //     // menu option has subcategories
  //     orderHelper.displaySubMenu(bot, message, menuId);
  //   } else {
  //     displayItems(bot, message, menuId, subMenuId);
  //   }
    });
//ORDER_CAT

controller.hears([new RegExp('ORDERCAT.*','i')], 'message_received', function(bot, message) {
 
 console.log('>>ITEMS MENU called',message.text,controller.config.botConfig);

  orderItems(bot,message,message.text.replace("ORDERCAT_", ""));
  
    });
controller.hears([/^ORDERCAT\/.*/i ], 'message_received', function(bot, message) {
 
 console.log('>>ITEMS MENU called',message.text,controller.config.botConfig);

  orderItems(bot,message.text.replace("ORDERCAT_", ""));
  // let botConfig = controller.config.botConfig;

  //   let [action, ...details] = message.text.split('/');
  //   //let [menuCategory] = details;
  //   let [menuId, subMenuId] = details;
  //  // console.log('menuId: ' + menuId,'subMenuId' + subMenuId);
  //   if (botConfig.menuItems[menuId].subcategories && !subMenuId) {
  //     // menu option has subcategories
  //     orderHelper.displaySubMenu(bot, message, menuId);
  //   } else {
  //     displayItems(bot, message, menuId, subMenuId);
  //   }
    });
controller.hears([new RegExp('ORDERITEM.*','i')], 'message_received', function(bot, message) {
  
  var selected=message.text.replace("ORDERITEM_", "");

  var result = selected.split('_')

  
    payItems(bot,bot.sender,result[0],result[1]);
   // });
    
    // const args = request.text.split('_')
    // return getRoverPhotos(args[1], args[2], originalApiRequest.env.nasaApiKey)
  });

  if (request.text.indexOf('ADDMORE_') === 0) {
   //SAVE SELCTION
  // putConvMongo(request.sender,request.text);

   return putConv(request.sender,request.text )
   // .then(
   //  data=>{
   //      console.log(">>>Put conversation done",data)

   //    return orderCategories()
   // });
  
  }

if (request.text.indexOf('PAY_') === 0) {

  var selected=request.text.replace("PAY_", "");

  return donePay(selected)
   //  putConv(request.sender,'NULL').then(
   //  data=>{
   //      console.log(">>>Put conversation done",data)

   //    return donePay(selected)
   // });
    
  }
  

  if (request.text === 'RESTART_ORDER'){
     putConv(request.sender,'NULL').then(
    data=>{
        console.log(">>>Put conversation done",data)

      return resetOrderCategories()
   });
  }
controller.hears([/^Menu\/.*/i], 'message_received', function(bot, message) {
 
 console.log('>>ITEMS MENU called',message.text,controller.config.botConfig);

  let botConfig = controller.config.botConfig;

    let [action, ...details] = message.text.split('/');
    //let [menuCategory] = details;
    let [menuId, subMenuId] = details;
   // console.log('menuId: ' + menuId,'subMenuId' + subMenuId);
    if (botConfig.menuItems[menuId].subcategories && !subMenuId) {
      // menu option has subcategories
      orderHelper.displaySubMenu(bot, message, menuId);
    } else {
      displayItems(bot, message, menuId, subMenuId);
    }
  });

//SELECT ITEMS
let displayItems = (bot, message, menuId, subMenuId) => {
  let botConfig = controller.config.botConfig;
   //  console.log( "displayItems 2",bot,">>>>>>>", message,">>>>>>>", menuId, ">>>>>>>",subMenuId);
    let subMenu = subMenuId ? botConfig.menuItems[menuId].subcategories[subMenuId] : botConfig.menuItems[menuId];
    
    console.log(botConfig.menuItems)

    let parsedIds=[]
    let itemIds = Object.keys(subMenu.items);
    //parse items for la fram 
     for (let j = 0; j < itemIds.length;j++){
        if( "585642968118982"==botConfig.page_id && menuId=="Breakfast" && (subMenu.items[itemIds[j]].name.includes("Oatmeal") || subMenu.items[itemIds[j]].name.includes("Bacon") || subMenu.items[itemIds[j]].name.includes("Le Poitou") ||
         subMenu.items[itemIds[j]].name.includes("Croissant") )){
          
         
        parsedIds.push(itemIds[j]);
      }
     }
     // console.log("////parsedids:",parsedIds,parsedIds.length );
    let elements = [];
   
    if(parsedIds.length==0){
      parsedIds=itemIds;
    }
   // console.log("////parsedids:",parsedIds,parsedIds.length );
   
    
  if(parsedIds.length<=10){
     for (let i = 0; i < parsedIds.length; i++) {
    
      let imageUrl = subMenu.items[parsedIds[i]].image;
      let menuCategory = subMenu.name;
  //    let menuItem=subMenu.items[itemId].name
      let subTitle= subMenu.description?subMenu.description:'';
      elements.push({
        "title": subMenu.items[parsedIds[i]].name,
        "subtitle":subMenu.items[parsedIds[i]].description,
        "image_url": imageUrl,
        "buttons": parsedIds.slice(i , i +1).map((itemId => {
           //  console.log(subMenu.items[itemId].name,"<<<<<<here>>>>>>>>>",menuId)
           
          let item = subMenu.items[itemId];
          let payload;
          if (subMenuId) {
            payload = `SelectItem/${menuId}/${subMenuId}/${item.id}`
          } else {
            payload = `SelectItem/${menuId}/${item.id}`
          }
          let itemTitle = item.name;
          let itemSubtitle=item.description?item.description:"";
          if (item.price) {
            itemTitle += '-$' + item.price ;
          }
          return {
            type: "postback",
            title: itemTitle,
            payload: payload
          };
        }))
      });
    
    }
    var attachment = {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": elements,
        "image_aspect_ratio":"square"
      }
    };
  //  console.log("attachment=",attachment);
    bot.reply(message, {
      attachment: attachment
    });
  }
  else{//Greater length will be parsed

    parsedIds = parsedIds.length <= 30 ? parsedIds : parsedIds.slice(0, 30)

    for (let i = 0; i < parsedIds.length / 3; i++) {
      console.log('else: too many here')
      let imageUrl = subMenu.items[parsedIds[i * 3]].image;
      let menuCategory = subMenu.name;
      elements.push({
        "title": `${menuCategory}`,
        "image_url": imageUrl,
        "buttons": parsedIds.slice(i * 3, i * 3 + 3).map((itemId => {
            // console.log(subMenu.items[itemId].name,"<<<<<<here>>>>>>>>>",menuId)
           
          let item = subMenu.items[itemId];
          let payload;
          if (subMenuId) {
            payload = `SelectItem/${menuId}/${subMenuId}/${item.id}`
          } else {
            payload = `SelectItem/${menuId}/${item.id}`
          }
          let itemTitle = item.name;
          if (item.price) {
            itemTitle += '-$' + item.price + ' ' + item.title;
          }
          return {
            type: "postback",
            title: itemTitle,
            payload: payload
          };
        }))
      });
    
    }
    var attachment = {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": elements,
        "image_aspect_ratio":"square"
      }
    };
   // console.log("attachment=",attachment);
    bot.reply(message, {
      attachment: attachment
    });

  }
  }


//EXTRAS
controller.hears([/Contact/], 'message_received', function (bot, message) {
  let botConfig = controller.config.botConfig;
  if(botConfig.page_id=="115860695094668"){
    bot.reply(message, "Contact us on 🤙 (415) 285-2423");
  }
  else if(botConfig.page_id=="585642968118982"){
    bot.reply(message, "Contact us on 🤙 (415) 349-6092");
  }
  });
  controller.hears([/Locations/i], 'message_received', function (bot, message) {
    let botConfig = controller.config.botConfig;
    if (botConfig.page_id == "641127986070818") {
      bot.reply(message, "We are located at 📌 1466 HAIGHT STREET, SAN FRANCISCO, CA, 94117");
      bot.reply(message, "Hours: 11:00A.M.-9:00P.M. Sunday-Thursday & 11:00A.M.-10:00P.M. Friday-Saturday 👍");
    } 
    else if(botConfig.page_id=="115860695094668"){//
    bot.reply(message, "We are located at 📌 1132 Valencia St, San Francisco, CA 94110");
     bot.reply(message, "Hours: 8AM-9:30PM Everyday 👍");
   }
   else if(botConfig.page_id=="585642968118982"){//lafrom
    bot.reply(message, "We are located at 📌 101 Montgomery St, San Francisco, CA 94104");
     bot.reply(message, "Hours: 7AM-7PM Mon-Fri 👍");
   }
   else if(botConfig.page_id=="996502603827009"){//kokio
    bot.reply(message, "We are located at 📌 Spark Social SF , 601 Mission Blvd, San Francisco, CA 94158");
     bot.reply(message, "Hours: 11AM-3pm 5PM-11PM Everyday 👍");
     let locationWeb = {
            "type": "template",
            "payload": {
              "template_type": "button",
              "text": "Directions to Truck Location 🗺",
              "buttons": [{
                "type": "web_url",
                "messenger_extensions": true,
                "url": "https://www.google.com/maps/place/Spark+Social+SF/@37.7707579,-122.3915964,15z/data=!4m5!3m4!1s0x0:0xb5383aac2dbd7b2a!8m2!3d37.7707579!4d-122.3915964",
                "title": "Directions"
              }]
            }
          };

          bot.reply(message, {
            attachment: locationWeb
          });
   }
    else if(botConfig.page_id=="193480617824454"){//Sincere tea
    bot.reply(message, "We are located at 📌 392 E Taylor st, San jose, 95112");
     bot.reply(message, "Hours: 11AM-8PM Mon-Sun 👍");
   }
  });
  controller.hears([/getstarted/i, /get started/i,/Getstarted/i,/Get started/i,/Get Started/i,/GetStarted/i], 'message_received', function(bot, message) {
    orderHelper.resetOrder(message);
    console.log('get started called');
    // TODO: integrate messenger profile API to get name
   // bot.replyWithTyping(message, "Hi there!! Welcome to The Crepe House 👋");
    orderHelper.displayMainMenu(bot, message);
  });
  controller.hears([/main menu/i,/menu/i,/order 👍/i,/Main Menu/i,/MainMenu/i,/Mainmenu/i,/Menu/i], 'message_received', function(bot, message) {
    
    orderHelper.resetOrder(message);
    console.log('main menu called');
    // TODO: integrate messenger profile API to get name
  //  bot.replyWithTyping(message, "Hi there!! Welcome to The Crepe House 👋");
 //   orderHelper.displayMainMenu(bot, message);
 console.log('>>Main menu called');
    orderCategories(bot,message);
  });
  controller.hears([/restart/i, /reset/i], 'message_received', function(bot, message) {
    orderHelper.resetOrder(message, bot)
    orderHelper.displayMainMenu(bot, message);
  })

  controller.hears([/AddMore/i], 'message_received', function(bot, message) {
    orderHelper.displayMainMenu(bot, message);
  });
  
  controller.hears([/WALLET/i], 'message_received', function(bot, message) {
    let botConfig = controller.config.botConfig;
    if (botConfig.pos_type === "square") {
      let walletEdit = {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "You can check your wallet details here",
        "buttons": [{
          "type": "web_url",
          "messenger_extensions": true,
          "url": `${process.env.BACKEND_BASE_URI}/user_wallet.html?botid=${botConfig.page_id}&psid=${message.user}&merchant_id=${botConfig.merchant_uid}`,
          "title": "My Wallet 💳"
        }]
      }
    };
  
    bot.reply(message, {
      attachment: walletEdit
    });

  }
   
});

module.exports = { controller, bot }
