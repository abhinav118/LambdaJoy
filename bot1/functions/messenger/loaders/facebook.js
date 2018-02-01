var rp = require('request-promise');

module.exports = function (page_token) {
  // FB Page info

  console.log('Loading FB page info');

  return rp('https://graph.facebook.com/me/picture?width=500&height=500&redirect=0&access_token=' + page_token);

  // request.get(,
  //   function(err, res, body) {
  //     if (err) {
  //       debug('Could not load FB page info!');
  //       throw new Error(err);
  //     } else {
  //       let data = JSON.parse(body).data;
  //       botConfig.page_picture = data.url;
  //       debug('Successfully loaded page info');
  //     }
  //   });
}