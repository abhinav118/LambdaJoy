'use strict'

const fbTemplate = require('claudia-bot-builder').fbTemplate

const Q = require('q');
var AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
AWS.config.setPromisesDependency(Q.Promise);

const DEFAULT_ERR_REPLY = 'Sorry, I\'m taking a break right now. Please come back later.';

// const WORKSPACE_ID = 'your-workspace-id';
// var conversation = watson.conversation ( {
//   username: 'your-username',
//   password: 'your-password',
//   version_date: '2016-07-01',
//   version: 'v1'
// } );

// var AWS = require('aws-sdk');
// const dynamodb = new AWS.DynamoDB.DocumentClient();

// AWS.config.setPromisesDependency(Q.Promise);

const CTX_TBL_NAME = 'Conv';

// restore conversation context from dynamodb
function restoreCtx(sender)
{
  console.log("Trying to restore context for sender", sender);

  var params = {
    TableName: CTX_TBL_NAME,
    Key: {
      'senderId': sender
    }
  };

  return dynamodb.get(params).promise();
}

// persist context to dynamodb
function persistCtx(sender, context)
{
  
   console.log("Trying to restore context for sender", sender);

  // var params = {
  //   TableName: CTX_TBL_NAME,
  //   Key: {
  //     'senderId': sender
  //   }
  // };
console.log("Persisting context for sender", sender,context);


  return restoreCtx(sender).then(function(existingCtx) {

 console.log(">>existingCtx :", existingCtx);
 	
    var context = {};
    if (existingCtx.Item) {
      context = existingCtx.Item; // we have a previously stored context
    }

     const newMessage = new fbTemplate.Text(context);

    return newMessage
      .addQuickReply('Stark', 'STARK')
      .addQuickReply('Lannister', 'LANNISTER')
      .addQuickReply('Targaryen', 'TARGARYEN')
      .addQuickReply('None of the above', 'OTHER')
      .get();
    return new fbTemplate.Text(context);
});
  //return dynamodb.get(params).promise();
  // var params = {
  //     TableName: CTX_TBL_NAME,
  //     Item:{
  //         'senderId': sender,
  //         'msg': context
  //     }
  // };

  // return dynamodb.put(params).promise();
}

module.exports = persistCtx

// botBuilder(request => {

//   console.log('Request:', request)

//   // we're going to store the context under this key
//   var sender = request.type + '.' + request.sender ;

//   return restoreCtx(sender).then(function(existingCtx) {

//     var context = {};
//     if (existingCtx.Item) {
//       context = existingCtx.Item.x; // we have a previously stored context
//     }

//     var payload = {
//       workspace_id: workspace_id,
//       input: {
//         text: request.text
//       },
//       context: context // pass it in to watson
//     };

//     return sendMessageToWatson(payload) // not shown here, but very similar to the first code example
//     .then(function (data) {
//       console.log('Response:', JSON.stringify(data));

//       // persist the updated context, then reply to the user
//       return persistCtx(sender, data.context)
//       .then(function(result) {
//         return data.output.text;
//       });
//     })
//   })
//   .catch(function (error) { 
//     console.error('Error:', JSON.stringify(error));
//     return DEFAULT_ERR_REPLY;
//   });
// });