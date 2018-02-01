'use strict'

const rp = require('minimal-request-promise')
const fbTemplate = require('claudia-bot-builder').fbTemplate
const AWS = require("aws-sdk");


function getConv(senderId) {
  console.log(">>>getConv",senderId)

// Set the region 
AWS.config.update({region: 'us-west-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});



var params = {
  Key: {
   "senderId": {
     S: senderId
    }
  }, 
  TableName: "Conv"
 };


return new Promise( ( resolve, reject ) => {

      ddb.getItem(params, function(err, data) {

          console.log(">>GetItem>>");
    if (err) {
      console.log(">>GetItem ERR:",err);
      return reject( err ); // an error occurred
      } 
    else {
      console.log(">>GetItem DATA:",data);
       // successful response
       return resolve( data );
      }
    
    });
  });


// ddb.getItem(params, function(err, data) {


//   console.log(">>GetItem>>");
//     if (err) {
//       console.log(">>GetItem ERR:",err); // an error occurred
//       } 
//     else {
//       console.log(">>GetItem DATA:",data); // successful response
//       }
//     return data;
//   });


}

module.exports = getConv
