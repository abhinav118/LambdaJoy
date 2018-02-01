'use strict'

const fbTemplate = require('claudia-bot-builder').fbTemplate
const rp = require('minimal-request-promise')
const orderCategories = require('./orderCategories')

function resetOrderCategories() {



// console.log("Extracted REPLY:",msg,buttons)
return [ 'Order Canceled!!👍🏼',
orderCategories()
]

}




  // return new fbTemplate.Generic()
  //   .addBubble(`Bowl\'d Acai`, 'Acai Bowls | Poke Bowls | Smoothies | Juices')
  //     .addImage('https://scontent-ort2-2.cdninstagram.com/vp/38f2d4fdd9e99861291afcf1fa3b00cf/5B00B795/t51.2885-15/s640x640/sh0.08/e35/26864190_1017152231768316_1408968483923820544_n.jpg')
  //     .useSquareImages('YES')
  //     .addButton('Order 👍🏼', 'ORDER')
  //     .addButton('What is Acai? 🤔', 'ABOUT_ACAI')
  //     .addButton('Locations 📌', 'ABOUT_LOCATIONS')
  //   // .addBubble(`Photos from NASA's rovers on Mars`, 'Curiosity Rover icon by Oliviu Stoian from the Noun Project')
  //   //   .addImage('https://raw.githubusercontent.com/stojanovic/space-explorer-bot/master/assets/images/rovers.png')
  //   //   .addButton('Curiosity', 'CURIOSITY_IMAGES')
  //   //   .addButton('Opportunity', 'OPPORTUNITY_IMAGES')
  //   //   .addButton('Spirit', 'SPIRIT_IMAGES')
  //   // .addBubble('International Space Station', 'Space station icon by Lucid Formation from the Noun Project')
  //   //   .addImage('https://raw.githubusercontent.com/stojanovic/space-explorer-bot/master/assets/images/iss.png')
  //   //   .addButton('Current position', 'ISS_POSITION')
  //   //   .addButton('Website', 'https://www.nasa.gov/mission_pages/station/')
  //   // .addBubble('How many people are in Space right now?', 'Astronaut icon by Javier Cabezas from the Noun Project')
  //   //   .addImage('https://raw.githubusercontent.com/stojanovic/space-explorer-bot/master/assets/images/astronaut.png')
  //   //   .addButton('Show', 'PEOPLE_IN_SPACE')
  //   //   .addButton('Website', 'http://www.howmanypeopleareinspacerightnow.com')
  //   // .addBubble('Help & info', 'Monster icon by Paulo Sá Ferreira from the Noun Project')
  //   //   .addImage('https://raw.githubusercontent.com/stojanovic/space-explorer-bot/master/assets/images/about.png')
  //   //   .addButton('About the bot', 'ABOUT')
  //   //   .addButton('Credits', 'CREDITS')
  //   //   .addButton('Report an issue', 'https://github.com/stojanovic/space-explorer-bot/issues')
  //   .get()
//}

module.exports = resetOrderCategories