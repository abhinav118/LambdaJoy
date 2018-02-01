'use strict'

const fbTemplate = require('claudia-bot-builder').fbTemplate

function credits() {

  return [
    'Acai bowls are thick parfaits on tropical, chilled steroids. First, we blend organic frozen Acai Roots with various fruits and coconut water',
    'Next, the thick, creamy blend is topped with One Planet custom homemade granola and lovingly adorned with fresh cut strawberries, blueberries, bananas, and coconut shavings. A delicate drizzle of honey adds a certain luster to the whole affair.',
    'Healthy and Yummmm 😋',
    new fbTemplate.Generic()
          .addBubble('Bowl\'d Acai', 'Acai Bowls \• Poke \• Smoothies \• Juices')
            .addImage('https://s3-us-west-1.amazonaws.com/5a00b54b1166db0018f17f77-assets/Screen+Shot+2018-01-26+at+3.03.08+AM.png')
            .useSquareImages('YES')
            .addButton('Need a pick me up 👍', 'ORDER')
          .get()
  ]
}

module.exports = credits
