'use strict'

const rp = require('request-promise')
const getConv =  require('./getConv')

var itemNames='';
var itemIds='';
var itemData='';
function payItems(bot, message, senderId, categorySelected,itemSelected) {

return rp.get("http://ec2-13-58-255-26.us-east-2.compute.amazonaws.com/menu/square/5a00b54b1166db0018f17f77/2EBEQKQ103WMM")
.then(response=>{
console.log(">>PAY SELECTED",categorySelected,itemSelected);
let item='';
  item=JSON.parse(response).menu[categorySelected].items[itemSelected];
    console.log("Extracted items:",item);
    itemNames=item.name;
    itemIds=item.id;
    itemData=JSON.parse(response);
 
    return itemNames;
  }).then(item=> {
    //get history of items if available
    //LOAD PREVIOUSLY SAVED ITEMS
    return getConv(senderId).then(function(data) {
       console.log("step2:",data)
      return data 
    });
    
  //   }


  // {

  //   console.log("step2:",item)
  //   return new Promise((resolve, reject) => {
  //      // getConv(senderId)
  //   setTimeout(() => resolve(getConv(senderId)), 1500);
  // });
    // return getConv(senderId);

  }).then(response=> {

    // let ret= new fbTemplate.Button(`Love your selection 😍:${itemNames}`)
    //       .addButton('Pay 👍🏼', `PAY_${itemNames}`)
    //       .addButton('Add More 👉🏼', `ADDMORE_${categorySelected}_${itemSelected}`)
    //       .addButton('Cancel 🛑', 'RESTART_ORDER')
    //       .get();

    console.log("step3:",response,itemNames)
    if(response){
        itemNames+=';'
        var extracted=response.Item.msg.S;
          console.log("step3: extracted",extracted)
        if (extracted.includes("ADDMORE_")){
        //PARSE to extract item NAME
        var selected=extracted.replace("ADDMORE_", "");
        var result = selected.split('_')
        itemNames+=itemData.menu[result[0]].items[result[1]].name;
        
          console.log("adding to previous item ; returning from step3:")
         return new fbTemplate.Button(`Love your selection 😍:${itemNames}`)
          .addButton('Pay 👍', `PAY_${itemNames}`)
          .addButton('Add More 👉', `ADDMORE_${categorySelected}_${itemSelected}`)
          .addButton('Cancel 🛑', 'RESTART_ORDER')
          .get();
        
        }
        else {
            console.log("else ; returning from step3:",ret,itemNames,itemIds,categorySelected,itemSelected)
            return new fbTemplate.Button(`Love your selection 😍:${itemNames}`)
          .addButton('Pay 👍', `PAY_${itemNames}`)
          .addButton('Add More 👉', `ADDMORE_${categorySelected}_${itemSelected}`)
          .addButton('Cancel 🛑', 'RESTART_ORDER')
          .get();
        }
  }


return new fbTemplate.Button(`Love your selection 😍:${itemNames}`)
            .addButton('Pay 👍🏼', `PAY_${itemNames}`)
            .addButton('Add More 👉🏼', `ADDMORE_${categorySelected}_${itemSelected}`)
            .addButton('Cancel 🛑', 'RESTART_ORDER')
            .get();


  });
}
    
    

module.exports = payItems