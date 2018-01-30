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
    
  }
}
