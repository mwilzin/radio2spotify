console.log('Getting followers');
var fs = require('fs');
const settings = require('./settings.json')
var uri = settings.uri;
var url = settings.url;
var clientId = settings.clientId;
var clientSecret = settings.clientSecret;
var AccessToken = settings.AccessToken;
var RefreshToken = settings.RefreshToken
let followers = JSON.parse(fs.readFileSync('followers.json', "utf8"));


var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.setAccessToken(AccessToken);
spotifyApi.setRefreshToken(RefreshToken);

spotifyApi.refreshAccessToken().then(
  function(data) {
    console.log('The access token has been refreshed!');

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Could not refresh access token', err);
  }
);
setTimeout(function () {
  spotifyApi.getPlaylist(uri).then(function(data) {
    var curFollowers = data.body.followers.total;
    console.log(curFollowers);
    if (!followers[Date.now()]) followers[Date.now()] = curFollowers;
    fs.writeFile('followers.json', JSON.stringify(followers), (err) => {
      if (err) console.error(err);
    })
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}, 1000);
