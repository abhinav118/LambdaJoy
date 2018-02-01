
function ucwords (str) {
  return (str + '')
    .replace(/^(.)|\s+(.)/g, function ($1) {
      return $1.toUpperCase()
    })
}

const request = require('request');
const rp=require('request-promise');
const Promise = require('bluebird')

module.exports = function (controller) {
  this.config = controller.config.botConfig;

  this.displayMainMenu = (bot, message) =>  {

return rp.get("http://ec2-13-58-255-26.us-east-2.compute.amazonaws.com/menu/square/5a00b54b1166db0018f17f77/2EBEQKQ103WMM")
.then(response=>{


     console.log(">>Response:",response,"incoming message",message)
let categories='';
let categoryNames='';
let buttons=[];
  categories=JSON.parse(response.body).menu
    console.log("Extracted items:",categories.length)
    for (let j = 0; j < categories.length;j++){
        
       
        // buttons.push({
        //       "content_type": "text",
        //       "title":  items[j].name ? `${items[j].name} $${items[j].price.toFixed(2)}`: '',
        //       "payload": `ORDER_${items[j].id}`
        //     });
        buttons.push({
            "title": categories[j].name,
            "image_url":categories[j].items[0].image,
            "subtitle": categories[j].name, 
            "buttons":[
              {
                "type":"postback",
                "payload":`ORDER_CAT_${j}`,
                "title": `${categories[j].name} MENU`
              }]  
          });
    }
    // let msg = {
    //       "text": "Please Select",
    //       "quick_replies": buttons
    //   }


      let msg={
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "image_aspect_ratio":"square",
        "elements":buttons
      }
    }
  }

console.log("Extracted REPLY:",msg,buttons)
bot.reply(message, {
      attachment: msg
    });
//return msg;

});

//    let elements = [];

//    // each generic template supports a maximum of 3 buttons
//    // For every 3 buttons we need a new generic template element

//    let menuItems = this.config.menuItems;
//   //  let menuCategories = Object.keys(menuItems);
//    //let menuCategories = menuItems.map(menuItem => menuItem.name);
//    let menuIds = Object.keys(menuItems).filter(menuId => menuItems[menuId].subcategories || Object.keys(menuItems[menuId].items).length > 0);

//    //console.log(menuIds);


//   // sort categories based on average price of items
//   // menuIds.sort((a, b) => {
//   //   let aAvg = Object.keys(menuItems[a].items).reduce((c, d) => c + menuItems[a].items[d].price, 0) / Object.keys(menuItems[a].items).length;
//   //   let bAvg = Object.keys(menuItems[b].items).reduce((c, d) => c + menuItems[b].items[d].price, 0) / Object.keys(menuItems[b].items).length;
//   //
//   //   return bAvg - aAvg;
//   // });

//   // sort by # of products per category
//   menuIds.sort((a, b) => {
//     let aAvg = Object.keys(menuItems[a].items).length;
//     let bAvg = Object.keys(menuItems[b].items).length;

//     return bAvg - aAvg;
//   });

//    // always put the other category at the end
//    let otherIndex = menuIds.indexOf("other");
//    if (otherIndex !== -1) {
//      menuIds.splice(otherIndex, 1);
//      menuIds.push("other");
//    }

//   //  for (let i = 0; i < menuCategories.length / 3; i++) {
//   //    elements.push({
//   //      "title": "Our Menu",
//   //      "image_url": this.config.page_picture,
//   //      "subtitle": "We are pleased to offer you a wide-range of menu for lunch or dinner",
//   //      "buttons": menuCategories.filter(menuCategory => !menuCategory.subcategories).slice(i * 3, i * 3 + 3).map((menuCategory => {
//   //        return {
//   //          type: "postback",
//   //          title: `${menuCategory} Menu`,
//   //          payload: `Menu/${menuCategory}`
//   //        };
//   //      }))
//   //    });
//   //  }

//   for (let i = 0; i < menuIds.length / 3; i++) {
//     elements.push({
//       "title": "Our Menu",
//         "image_url": this.config.page_picture instanceof Array ? (this.config.page_picture[i]?this.config.page_picture[i]:this.config.page_picture[0]):this.config.page_picture,
//      "subtitle": "We are pleased to offer you a wide-range of menu for lunch or dinner",
//       "buttons": menuIds.slice(i * 3, i * 3 + 3).map((menuId => {
//         let menuCategory = menuItems[menuId].name;
//         return {
//           type: "postback",
//           title: `${ucwords(menuCategory.toLowerCase())} Menu`,
//           payload: `Menu/${menuId}`
//         };
//       }))
//     });
//   }

//    // add hours and directions element
//    if(this.config.page_id=="115860695094668"){
//    elements.push({
//      "title": "Hours and Directions",
//      "image_url": "https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-9/419042_394081527272582_388320477_n.jpg?oh=8c894bc38ca0a376e011f37e8f626143&oe=59F94316",
//      "buttons": [{
//          "type": "web_url",
//          "title": "Directions",
//          "url": "https://www.google.com/maps/place/The+Crepe+House/@37.7547153,-122.4232757,17z/data=!3m1!4b1!4m5!3m4!1s0x808f7e3f0150397f:0xa347f6a6dbcbb86d!8m2!3d37.7547153!4d-122.421087"
//        },
//        {
//          "type": "postback",
//          "title": "Contact",
//          "payload": "Contact"
//        }
//      ]
//    });
//  }
// else if(this.config.page_id=="585642968118982"){
//  elements.push({
//      "title": "Hours and Directions",
//      "image_url": "https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-9/12311058_1239670849382854_7051986136540182700_n.jpg?oh=1f7ba72fad08d2f629f996db71972dc9&oe=5A25E692",
//      "buttons": [{
//          "type": "web_url",
//          "title": "Directions",
//          "url": "https://www.google.com/maps/place/La+Fromagerie+Cheese+Shop/@37.7904282,-122.4062111,16z/data=!4m5!3m4!1s0x0:0xdb7eb4b7552ad44!8m2!3d37.79053!4d-122.402597"
//        },
//        {
//          "type": "postback",
//          "title": "Contact",
//          "payload": "Contact"
//        }
//      ]
//    });

//  }
//  else if(this.config.page_id=="644041822348467"){
//  elements.push({
//      "title": "Directions",
//      "image_url": "https://scontent-atl3-1.xx.fbcdn.net/v/t1.0-9/14233183_1119989661420345_1956825327282166207_n.jpg?oh=b6e4a631189cf5f9ebe4b6b24820a2b8&oe=5A1A32FE",
//      "buttons": [{
//          "type": "web_url",
//          "title": "Directions",
//          "url": "https://www.google.com/maps/place/Spark+Social+SF/@37.7707579,-122.3915964,15z/data=!4m5!3m4!1s0x0:0xb5383aac2dbd7b2a!8m2!3d37.7707579!4d-122.3915964"
//        },
//        {
//          "type": "postback",
//          "title": "Contact",
//          "payload": "Contact"
//        }
//      ]
//    });

//  }
//   else if(this.config.page_id=="193480617824454"){
//  elements.push({
//      "title": "Directions",
//      "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/gv2Vs8oN2z_k4H43KOnBpg/o.jpg",
//      "buttons": [{
//          "type": "web_url",
//          "title": "Directions",
//          "url": "https://www.google.com/maps/place/Sinceretea/@37.3529468,-121.8919138,15z/data=!4m5!3m4!1s0x0:0x198452e5a7107af2!8m2!3d37.3529468!4d-121.8919138"
//        },
//        {
//          "type": "postback",
//          "title": "Contact",
//          "payload": "Contact"
//        }
//      ]
//    });
// }

//    //https://www.google.com/maps/place/La+Fromagerie+Cheese+Shop/@37.7926163,-122.4199302,14z/data=!4m17!1m11!4m10!1m3!2m2!1d-122.4024208!2d37.7934981!1m5!1m1!1s0x80858089ebb36c5f:0xdb7eb4b7552ad44!2m2!1d-122.4024186!2d37.7905344!3m4!1s0x80858089ebb36c5f:0xdb7eb4b7552ad44!8m2!3d37.7905344!4d-122.4024186

//    var attachment = {
//      "type": "template",
//      "payload": {
//        "template_type": "generic",
//        "elements": elements
//      }
//    };

//   //  if (this.config.pos_type == "square") {
//   //    const controllerGetAsync = Promise.promisify(controller.storage.users.get)

//   //    controllerGetAsync(message.user)
//   //     .then(({ user }) => {
//   //       return user.first_name
//   //     })
//   //     .then((name) => {
//   //       bot.startConversation(message, (err, convo) => {
//   //         if (err) console.log(`Bot Conversation Error: ${err}`)
//   //         convo.sayFirst(`Hey ${name}, you receive $2 off on your order. Enjoy!`);
//   //         convo.say({
//   //           attachment: {
//   //             type: 'image',
//   //             payload: {
//   //               url: "https://i.imgur.com/NTLeMkT.gif"
//   //             }
//   //           }
//   //         })
//   //         convo.say({
//   //           attachment: attachment
//   //         })
//   //         convo.next()
//   //       })
//   //     })
//   //     .catch(e => console.log(e))
//   //  }
//   //  else {
//     bot.reply(message, {
//       attachment: attachment
//     });
  //  }
 }

 this.displaySubMenu = (bot, message, menuId) => {
   let elements = [];
   let subMenuIds = Object.keys(this.config.menuItems[menuId].subcategories);

   for (let i = 0; i < subMenuIds.length / 3; i++) {
     elements.push({
       "title": "Our Menu",
       "image_url": this.config.page_picture instanceof Array ? (this.config.page_picture[i]?this.config.page_picture[i]:this.config.page_picture[0]):this.config.page_picture,
       "subtitle": "We are pleased to offer you a wide-range of menu for lunch or dinner",
       "buttons": subMenuIds.slice(i * 3, i * 3 + 3).map((subMenuId => {
         let menuCategory = this.config.menuItems[menuId].subcategories[subMenuId].name;
         return {
           type: "postback",
           title: `${ucwords(menuCategory.toLowerCase())} Menu`,
           payload: `Menu/${menuId}/${subMenuId}`
         };
       }))
     });
   }

    var attachment = {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": elements
      }
    };

    bot.reply(message, {
      attachment: attachment
    });
 }

 this.resetOrder = (message, bot) => {
  let emptyOrder = {
    totalPrice: 0,
    totalTaxes: 0,
    items: []
  };

  const controllerGetAsync = Promise.promisify(controller.storage.users.get);
  const controllerSaveAsync = Promise.promisify(controller.storage.users.save);
  // RESET RAN
  controllerGetAsync(message.user)
    .then(user => {
      if (!user) {
        user = {
          orderData: emptyOrder
          // id: message.user
        };
        return user
      }
      else {
        user.user.orderData = emptyOrder
        return user.user;
      }
    })
    .then(user => {
      // CHANGED for mongo storage

      controllerSaveAsync({id: message.user, user })
        .then(() => {
          if (bot) {
            bot.reply(message, "Order Cancelled")
          }
          console.log('Finished Cancelling Order')
        })
        .catch(err => console.log(`Error at saving order ${err}`));
    })
    .catch(err => console.log(`Error at getting order ${err}`));
  // return new Promise((resolve) => {
  //   console.log("RESETTING ORDER")
  //   controller.storage.users.get(message.user, function(err, user) {
  //     if (!user) {
  //       user = {
  //         orderData: emptyOrder,
  //         id: message.user
  //       };
  //     } 
  //     else {
  //       user.orderData = emptyOrder;
  //     }
  //       resolve(user)
  //     })
  // }).then(user => {
  //   controller.storage.users.save(user, function(err, saved) {
  //     if (err) {
  //       console.log('error saving user data: ' + err);
  //     } else {
  //       console.log('user data saved');
  //     }
  //   });
  // })
  // .then(() => {
  //   if (bot) {
  //     bot.reply(message, 'Order Cancelled')
  //   }
  //   console.log("FINISHED RESET ORDER")
  // })
 }

 this.addItemToOrder = (bot, message, item) => {
   // add item to order details
   // display order details
   // prompt confirm order, add more items, cancel
   controller.storage.users.get(message.user, (err, user) => {
     user.user.orderData.items.push(item);
     user.user.orderData.pendingItem = {}

     const updated = user.user
     controller.storage.users.save({ id: message.user, user: updated }, (err, saved) => {
       if (err) throw new Error
     })
     if(err) console.log(`Error: ${err} - occurring at addItemToOrder`)
     console.log('Order Data at addItemToOrder', user.user.orderData)
     let orderDetails = this.getOrderDetails(user.user.orderData);
     
     bot.startConversation(message, (err, convo) => {
      convo.sayFirst(orderDetails);

      setTimeout(() => {
        this.displayPayButton(bot, message, user.user.orderData);
        convo.next();
      }, 1500)
     })

    //  bot.startConversation(message, (err, convo) => {
    //    convo.say(orderDetails);
    //    convo.ask({
    //      "text": "Please Select:",
    //      "quick_replies": [{
    //          "content_type": "text",
    //          "title": "Confirm Order",
    //          "payload": "Confirm"
    //        },
    //        {
    //          "content_type": "text",
    //          "title": "Add more items",
    //          "payload": "AddMore"
    //        },
    //        {
    //          "content_type": "text",
    //          "title": "Restart Order",
    //          "payload": "Restart"
    //        }
    //      ]
    //    }, (response, convo) => {
    //      // if the user responds with something other than a quick reply option
    //      // response.text
    //     console.log(`Response Object at Confirm Order: ${response.quick_reply}`)
    //      if (response.quick_reply) {
    //        switch (response.quick_reply.payload) {
    //          case "Confirm":
    //            // display receipt card
    //            console.log("INSIDE CONFIRM SWITCH ")
    //            this.displayPayButton(bot, message, user.orderData);
    //            convo.next();
    //            break;
    //          case "AddMore":
    //            this.displayMainMenu(bot, message);
    //            convo.next();
    //            break;
    //          case "Restart":
    //            this.resetOrder(message);
    //            bot.reply(message, "Order Canceled");
    //            this.displayMainMenu(bot, message);
    //            convo.next();
    //            break;
    //        }
    //      }
    //      convo.next();
    //    });
    //    if (err) console.log(`Error: ${err} - occuring within startConversation`)
    //  });
   });
 }

 this.displayPayButton = (bot, message, orderDetails) => {

   let totalPrice = 0;
   let totalTaxes = 0;
   let itemPrices = [];
   let itemSpecialInstructions = [];


   for (let item of orderDetails.items) {
     // if an item has an option, that's the option selected
     console.log(`Item Options: ${item.options}`)
     let price;
     
    if (item.options) {
      price = (typeof item.options == Array) ? item.options[0].price : item.price
    } else {
      price = item.price;
    }

     let modPrice = 0;
     item.modifiers.forEach(mod => {
       if (mod.admin_mod_key != 'SIZE') {
         modPrice += Number(mod.price);
         console.log('Display Receipt Card', totalPrice)
       }
     });
     itemPrices.push(price);
     totalPrice += Number(price) + modPrice;

     itemSpecialInstructions.push(item.special_instructions || "");

     //item.modifiers.forEach(mod => totalPrice += Number(mod.price));
   };

   totalPrice = parseFloat(totalPrice).toFixed(2);

   request({
     url: `https://graph.facebook.com/v2.8/${message.user}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${this.config.page_token}`
   }, (err, response, body) => {
     if (err) {
       console.log(err);
     } else {
       let data = JSON.parse(body);

       let orderItems = orderDetails.items.map(item => item.name).join('|');
       let itemIds = orderDetails.items.map(item => item.id).join('|');

       let payUrl;

       if (this.config.pos_type == 'square') {
         payUrl = `${process.env.BACKEND_BASE_URI}/payment/squarePay?`;
       } else if (this.config.pos_type == 'revel') {
         payUrl = `${process.env.BACKEND_BASE_URI}/revelpayment/page?`;
       }

       let params = {
         botid: this.config.page_id,
         fb_first_name: data.first_name,
         fb_id: message.user,
         profile_pic: data.profile_pic,
         fb_last_name: data.last_name,
         merchant_id: this.config.merchant_uid,
         location_id: this.config.square_location_id,
         vendor: this.config.vendor_id,
         items: orderItems,
         itemIds: itemIds,
         price: totalPrice,
         psid: message.user,
         created: Date.now(),
         itemPrices: itemPrices.join('|'),
         establishment: this.config.revel_establishment || 0,
         itemSpecialInstructions: itemSpecialInstructions.join("||")
       };

       if (this.config.pos_type == 'revel') {
         params.modifiers = orderDetails.items.map(item => {
           return item.modifiers.map(modifier => {
             return [modifier.id, modifier.name, modifier.price, modifier.admin_mod_key].join(',,');
           }).join('||');
         }).join('##');
       }

      if (this.config.pos_type == 'square') {
        params.modifiers = orderDetails.items.map(item => {
          return item.modifiers.map(modifier => {
            return [modifier.name].join(',');
          }).join('||');
        }).join('##');
      }

       for (let param in params) {
         params[param] = encodeURIComponent(params[param]);
         payUrl += `${param}=${params[param]}&`;
       }
       payUrl = payUrl.slice(0, -1);

       let payAttachment = {
         "type": "template",
         "payload": {
           "template_type": "button",
           "text": "Click below to pay for your order",
           "buttons": [{
             "type": "web_url",
             "messenger_extensions": true,
             "url": payUrl,
             "title": "Pay"
           },{
             "type": "postback",
             "title": "Add More",
             "payload": "AddMore" 
           },{
             "type": "postback",
             "title": "Restart Order",
             "payload": "Restart"
           }]
         }
       };

       console.log(payUrl)

       bot.reply(message, {
         attachment: payAttachment
       });
     }
   })
 }

 this.getOrderDetails = (orderData) => {
     let msg = '';
     let totalPrice = 0;
     
     function map(item) {
      let itemName = (item.name ? item.name : item.options.name);
      let itemPrice = (item.options.length > 0 && typeof item.options == Array) ? item.options[0].price : Number(item.price);
     
      // for revel merchants, add modifiers
      if (item.modifiers.length > 0) {
        itemName += " w/ ";
      }
      itemName += item.modifiers.map(mod => mod.name).join(', ');
      item.modifiers.forEach(mod => {
    
        if (mod.admin_mod_key=== undefined) {//for square
          itemPrice += Number(mod.price);
        }
  
        if (mod.admin_mod_key !== undefined) {//revel 
          if (mod.admin_mod_key !== 'SIZE') {
            itemPrice += Number(mod.price);
          }
          else {
            itemPrice = Number(mod.price);
          }
        }
  
       });
      msg += itemName + ' - $' + itemPrice + '\n\n';
      totalPrice += itemPrice;
      //session.userData.orderDetails.totalPrice += item.price;
     }
    
      for (let item of orderData.items) {
       console.log('item', item)
       if(item.options) {
         if (item.options.length > 0) {
           console.log('(item.options.length > 0 case runs')
           item.options.forEach(option => {
             if (!option.name) {
               return;
             }
             msg += item.name + ' (' + option.name +')' + ' - $' + option.price + '\n\n';
             totalPrice += option.price;
           });
           console.log(`Total price is ${totalPrice}`)
          }
          else {
            map(item);
          }
        }
        else {
          map(item);
        }
          
        
      };
      
    totalPrice = parseFloat(totalPrice).toFixed(2);
    // msg += '*Total - $' + totalPrice + '*' + (this.config.pos_type == "square" ? '\nDiscount applied when you hit pay.' : '');
   msg += '*Total - $' + totalPrice + '*';
     return msg;
 }

 this.displayReceiptCard = (bot, message, orderDetails, order, username, tip) => {
   let elements = [];
   let totalPrice = 0;
   let totalTaxes = 0;

   orderDetails.items.forEach(item => {
     // if an item has an option, that's the option selected
     let name = item.options.length ? item.options[0].name : item.name;
     let price = item.options.length ? item.options[0].price : item.price;

     elements.push({
       title: name,
       price: price,
       currency: "USD",
       quantity: 1,
       image_url: item.image
     });
     totalPrice += price;

     item.modifiers.forEach(mod => {
       if (mod.admin_mod_key != 'SIZE') {
         totalPrice += Number(mod.price);
       }
     })
   });

   tip = Number(tip);

  // Order Object 
  //  order = {
  //    id: squareOrder.id,
  //    card: {
  //     type: squareTransaction.tenders[0].card_details.card.card_brand,
  //     digits: squareTransaction.tenders[0].card_details.card.last_4
  //    }
  //  }

   // TODO: Research why orderId and recipient_name is not being pulled in
   // This is causing the error for which the receiept is not being displayed via messenger 
   let receiptAttachment = {
     "type": "template",
     "payload": {
       "template_type": "receipt",
       "order_number": order.id || '111',
       "currency": "USD",
       "payment_method": `${(!order.card) ? "Credit Card" : order.card.type + " " + order.card.digits}`,
       "elements": elements,
       "recipient_name": username || 'XXX',
       // "address":{
       //   "street_1":"1 Hacker Way",
       //   "street_2":"",
       //   "city":"Menlo Park",
       //   "postal_code":"94025",
       //   "state":"CA",
       //   "country":"US"
       // },
       "summary": {
         "subtotal": totalPrice,
         // "shipping_cost":4.95,
         "total_tax": (totalPrice * 0.085).toFixed(2),
         "total_cost": (Number(((totalPrice * 1.085)).toFixed(2)) + tip).toFixed(2)
       },
       "adjustments": [
       ]
     }
   };

  console.log(receiptAttachment);
  console.log('PSID ', message.channel)
  return bot.reply(message, {
    attachment: receiptAttachment
  });

   console.log('Message with receipt is supposed to be sent')

 }
}
