'use strict'

const fbTemplate = require('claudia-bot-builder').fbTemplate

function donePay(selected) {
  console.log("donePay",selected)


  // let msg={
  //     "attachment":{
  //       "type":"template",
  //       "payload":{
  //         "template_type":"generic",
  //         "elements":[
  //           {
  //             "title":"Get in touch",
  //             "image_url":"https://rockets.chatfuel.com/img/contact.png",
  //             "subtitle":"Feel free to hit us up!",
  //             "buttons":[
  //               {
  //                 "type":"phone_number",
  //                 "phone_number":"+19268881413",
  //                 "title":"Call"
  //               },
  //               {
  //                 "type":"element_share"
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     }
  //   }

  let msg={
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "image_aspect_ratio":"square",
        "elements":[{
            "title":"I just had the best Acai Bowl 🙌",
            "image_url":"https://s3-us-west-1.amazonaws.com/5a00b54b1166db0018f17f77-assets/originalgangster.jpg",
            "subtitle":"We\'ve got the right acai bowl for everyone.",
            "buttons":[{
  "type": "element_share",
  "share_contents": { 
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "I just had the best Acai Bowl 🙌",
                "subtitle": "The right acai bowl for everyone",
                "image_url": "https://s3-us-west-1.amazonaws.com/5a00b54b1166db0018f17f77-assets/originalgangster.jpg",
                "default_action": {
                  "type": "web_url",
                  "url": "http://m.me/281264632312453?ref=invited_by_24601"
                },
                "buttons": [
                  {
                    "type": "web_url",
                    "url": "http://m.me/281264632312453?ref=invited_by_24601", 
                    "title": "Try it out 😋"
                  }
                ]
              }
            ]
          }
        }
      }
}]
}]
      }
    }
  };

console.log("donePay",selected,msg)
return msg;
      // return new fbTemplate.Generic()
      // .addBubble('Share it with your friends 🙌')
      // .addImage('https://s3-us-west-1.amazonaws.com/5a00b54b1166db0018f17f77-assets/originalgangster.jpg')
      // .addShareButton()
      // .get();
       
    
}

module.exports = donePay
