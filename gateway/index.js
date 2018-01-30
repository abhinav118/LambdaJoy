// 'use strict';

// console.log('Loading function');

// const doc = require('dynamodb-doc');
// const https = require('https');

// const dynamo = new doc.DynamoDB();


// /**
//  * Demonstrates a simple HTTP endpoint using API Gateway. You have full
//  * access to the request and response payload, including headers and
//  * status code.
//  *
//  * To scan a DynamoDB table, make a GET request with the TableName as a
//  * query string parameter. To put, update, or delete an item, make a POST,
//  * PUT, or DELETE request respectively, passing in the payload to the
//  * DynamoDB API as a JSON body.
//  */
// exports.handler = (event, context, callback) => {
//     console.log('Received event:', JSON.stringify(event, null, 2));
    
//     var optionspost = {
//         host: 'https://uml0653di0.execute-api.us-east-1.amazonaws.com',
//         path: '/prod/processMessages',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     };

//     var reqPost = https.request(optionspost, function(res) {
//         console.log("statusCode: ", res.statusCode);
//         res.on('data', function (chunk) {
//             body += chunk;
//         });
//         context.succeed('Blah');
//     });

//     reqPost.write(jsonObject);
//     reqPost.end();
    
//     const done = (err, res) => callback(null, {
//         statusCode: err ? '400' : '200',
//         body: err ? err.message : JSON.stringify(res),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

//     switch (event.httpMethod) {
//         case 'DELETE':
//             dynamo.deleteItem(JSON.parse(event.body), done);
//             break;
//         case 'GET':
//             dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
//             break;
//         case 'POST':
//             dynamo.putItem(JSON.parse(event.body), done);
//             break;
//         case 'PUT':
//             dynamo.updateItem(JSON.parse(event.body), done);
//             break;
//         default:
//             done(new Error(`Unsupported method "${event.httpMethod}"`));
//     }
// };
'use strict';
var VERIFY_TOKEN = "my_awesome_token";
var https = require('https');
//var PAGE_ACCESS_TOKEN = "EAAa3rjvslPEBAKhZCbRhZA2IWtaQ5dUsZCMtDuwZCTrMLEmCiDXOEheajCZAhGdkkLdaD1S3TSgLkpD70FeGZAOY50mmIcy5gxiV895btKATDqsiVRCQDTZAZAxZAXGgnU0RyOrdhO5tuYxyMnsMkz5s2gTps02ggjFVjp4xtztCsHQZDZD";
exports.handler = (event, context, callback) => {
    //  console.log('Received event Router called:', JSON.stringify(event, null, 2),event);
  // process GET request
  if(event.queryStringParameters){
    var queryParams = event.queryStringParameters;
 
    var rVerifyToken = queryParams['hub.verify_token']
 
    if (rVerifyToken === VERIFY_TOKEN) {
      var challenge = queryParams['hub.challenge']
      
      var response = {
        'body': parseInt(challenge),
        'statusCode': 200
      };
      
      callback(null, response);
    }else{
      var response = {
        'body': 'Error, wrong validation token',
        'statusCode': 422
      };
      
      callback(null, response);
    }
  
  // process POST request
  }else{
    
console.log('>>>Received event to RELAY', JSON.stringify(event));
    
    //check recepient id:
    var receiver=JSON.parse(event.body).entry[0].id;
    console.log('>>>Received PAGE_ID to RELAY', receiver);
    var path='/prod/processMessages';
        switch (receiver) {
        case '1249100721847943':
            path='/prod/processMessages';
            break;
        case '281264632312453':
            path='/prod/bot2'
            break;
        }
    var optionspost = {
        host: 'uml0653di0.execute-api.us-east-1.amazonaws.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    var body = '';
    var reqPost = https.request(optionspost, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function (chunk) {
            body += chunk;
            
            }); 
        context.succeed('Blah');
    });
  
  console.log(">>Forward",JSON.stringify(event));
    reqPost.write(JSON.stringify(event));
    reqPost.end();
    
    
     var response = {
      'body': "ok",
      'statusCode': 200
    };
      
    callback(null, response); 
    
    // var data = JSON.parse(event.body);
    //  console.log(">>data",data);
    // // Make sure this is a page subscription
    // if (data.object === 'page') {
    // // Iterate over each entry - there may be multiple if batched
    // data.entry.forEach(function(entry) {
    //     var pageID = entry.id;
    //     var timeOfEvent = entry.time;
    //     // Iterate over each messaging event
    //     entry.messaging.forEach(function(msg) {
    //       if (msg.message) {
    //         receivedMessage(msg);
    //       } else {
    //         console.log("Webhook received unknown event: ", event);
    //       }
    //     });
    // });
    
    // }
    // // Assume all went well.
    // //
    // // You must send back a 200, within 20 seconds, to let us know
    // // you've successfully received the callback. Otherwise, the request
    // // will time out and we will keep trying to resend.
    // var response = {
    //   'body': "ok",
    //   'statusCode': 200
    // };
      
    // callback(null, response);
  }
}
