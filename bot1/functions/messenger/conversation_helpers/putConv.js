'use strict'

const fbTemplate = require('claudia-bot-builder').fbTemplate

var AWS = require("aws-sdk");
var DOC = require("dynamodb-doc");
const rp = require('minimal-request-promise')
const credits = require('./credits')


function putConv(senderId,conversation) {



//var requestPromise = require('minimal-request-promise'),
  var options = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId:senderId,
        name:conversation
    })
  };
 
// requestPromise.post('https://graph.facebook.com/v2.6/me/messages?access_token=' + fbAccessToken, options).then(
//   function (response) {
//     console.log('got response', response.body, response.headers);
//   },
//   function (response) {
//     console.log('got error', response.body, response.headers, response.statusCode, response.statusMessage);
//   }
// );

//   var options = {
//     method: 'POST',
//     uri: 'https://hprkxasljj.execute-api.us-west-1.amazonaws.com/latest/user',
//     body: {
//         userId:senderId,
//         name:'xxx',
//         age:33
//     },
//     json: true // Automatically stringifies the body to JSON
// };

return rp.get(`https://hprkxasljj.execute-api.us-west-1.amazonaws.com/latest/user/${senderId}`)
    .then(function (parsedBody) {

      console.log('parsedBody',JSON.parse(parsedBody.body).name);

      const newMessage= new fbTemplate.Text(JSON.parse(parsedBody.body).name);
      return newMessage
      .addQuickReply('Generic 👉🏼', 'GENERIC')
      .addQuickReply('Receipt 📝', 'RECEIPT')
      .addQuickReply('Video 📹', 'VIDEO')
      .addQuickReply('Shuffle 🔀', 'Random')
      .get();
        // POST succeeded...
    })
    .catch(function (err) {
        // POST failed...
        console.log('err',err);
    });



//   console.log(">>>PutConv",senderId,conversation);

// AWS.config.update({region: "us-west-1"});

// var docClient = new DOC.DynamoDB();



// // Set the region 
// //AWS.config.update({region: 'us-west-1'});

// // Create the DynamoDB service object
// //var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

// var params = {
//   TableName: 'Conv',
//   Item: {
//     'senderId' : {S: senderId},
//     'msg' : {S: conversation},
//   }
// };

// console.log(">>>PutConv params",docClient,params);

// return docClient.putItem(params).promise();

// return ddb.get(params).promise();
// return new Promise( ( resolve, reject ) => {
//   console.log(">>putItem Promise");

//     //   ddb.putItem(params, function(err, data) {
//     //       console.log(">>putItem>>");
//     // if (err) {  
//     //   console.log(">>putItem ERR:",err);
//     //   return reject( err ); // an error occurred
//     //   } 
//     // else {
//     //   console.log(">>putItem DATA:",data);
//     //    // successful response
//     //    return resolve( data );
//     //   }
    
//     // });
//   });
// Call DynamoDB to add the item to the table
// ddb.putItem(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log(">>ddb Put Success", data);
//   }
// });

}

module.exports = putConv
