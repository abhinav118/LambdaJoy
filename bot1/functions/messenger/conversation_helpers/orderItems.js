'use strict'

const rp = require('request-promise')

function orderItems(bot,message,index) {

return rp.get("http://ec2-13-58-255-26.us-east-2.compute.amazonaws.com/menu/square/5a00b54b1166db0018f17f77/2EBEQKQ103WMM")
.then(response=>{
     console.log(">>orderItems Response:",response,message)
let items='';
let item_Names='';
let buttons=[];
  items=JSON.parse(response).menu[index].items;
    console.log("Extracted items:",items.length)
    for (let j = 0; j < items.length;j++){
        
        // if(items[j].image==='' || items[j].price <10 ){
        //   continue;
        // }
        // buttons.push({
        //       "content_type": "text",
        //       "title":  items[j].name ? `${items[j].name} $${items[j].price.toFixed(2)}`: '',
        //       "payload": `ORDER_${items[j].id}`
        //     });
        buttons.push({
            "title": items[j].name ? `${items[j].name} $${items[j].price.toFixed(2)}`: '',
            "image_url":items[j].image,
            "subtitle": items[j].title, 
            "buttons":[
              {
                "type":"postback",
                "payload":`ORDERITEM_${index}_${j}`,
                "title":items[j].name ? `${items[j].name} $${items[j].price.toFixed(2)}`: ''
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
bot.reply(message, msg);

});

}

module.exports = orderItems