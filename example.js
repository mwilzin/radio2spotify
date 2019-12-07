console.log('Getting song');
const rp = require('request-promise');
var fs = require('fs');
const $ = require('cheerio');
const settings = require('./settings.json')
var uri = settings.uri;
var url = settings.url;
var clientId = settings.clientId;
var clientSecret = settings.clientSecret;
var AccessToken = settings.AccessToken;
var RefreshToken = settings.RefreshToken

setTimeout (function () {
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
  rp(url)
    .then(function(html) {
      var last = require('./last.json');
      var songs = $('.tablelist-schedule', html).html();
      var song = songs.toUpperCase().split('>')[8];
      song = song.replace('</A', '')
      setTimeout(function () {
        console.log(song);
        // Spotify
        spotifyApi.searchTracks(`${song}`)
        .then(function(data) {
          var finalSong = data.body.tracks.items.map(r => r.id)[0];
          if(!finalSong)return;
          console.log(finalSong);
          if(finalSong === last.song) return console.log('Already added this song.');
          // Add Song
          spotifyApi.addTracksToPlaylist(uri, [`spotify:track:${finalSong}`])
          .then(function(data) {
            console.log('Added tracks to playlist!');
            last.song = finalSong;
            fs.writeFile('last.json', JSON.stringify(last), (err) => {
              if (err) console.error(err);
            })
            spotifyApi.getPlaylist(uri)
              .then(function(data) {
                if (data.body.tracks.total > 50) {
                  var tracks = [{uri: `spotify:track:${data.body.tracks.items[0].track.id}`}];
                  spotifyApi.removeTracksFromPlaylist(uri, tracks)
                    .then(function(data) {
                      console.log('Tracks removed from playlist!');
                    }, function(err) {
                      console.log('Something went wrong!', err);
                    });
                }
              }, function(err) {
                console.log('Something went wrong!', err);
              });
          }, function(err) {
            console.log('Something went wrong!', err);
            return;
          });
        }, function(err) {
          console.log('Something went wrong!', err);
          return;
        });
      }, 3000);
    })
    .catch(function(err) {
      throw err;
  })
}, 3000);
