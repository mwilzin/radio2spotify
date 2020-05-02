const readlineSync = require('readline-sync')
console.log('Thank you for using my tool.');
const rp = require('request-promise');
const collector = 'https://raw.githubusercontent.com/triggeredLife/radio2spotify/master/example.js'
const chart = 'https://raw.githubusercontent.com/triggeredLife/radio2spotify/master/chart.js'
const chartSite = 'https://raw.githubusercontent.com/triggeredLife/radio2spotify/master/chart.php'

var clientId = readlineSync.question('Please enter your Spotify Client Id ');

var clientSecret = readlineSync.question('Please enter your Spotify Client Secret ');

var AccessToken = readlineSync.question('Please enter your Spotify Access Token ');

var RefreshToken = readlineSync.question('Please enter your Spotify Refresh Token ');

var name = readlineSync.question('Please enter the name of the Radio Channel ').replace(' ', '_');

var uri = readlineSync.question('Please enter the URI of your Playlist (e.g. 3etIBt3wCSGny0MGgCwiHq) ');

var url = readlineSync.question('Please enter the URL of the Channel from OnlineRadioBox (e.g. https://onlineradiobox.com/ae/virgin) ') + '/playlist';

var charta = readlineSync.question("Do you want to activate the chart module? (It collects at 0:00 o'clock the number of followers and adds them into a JSON File.)? (Y/N (Default: No))")

if (charta = "Y") {
  var webdir = readlineSync.question("Please enter the Webdirectory for the Chartsite.")
}

var fs = require('fs');

var settings = `{"name": "${name}", "uri": "${uri}", "url": "${url}", "clientId": "${clientId}", "clientSecret": "${clientSecret}", "AccessToken": "${AccessToken}", "RefreshToken": "${RefreshToken}", "webdir": "${webdir}"}`;

var last = '{"song": ""}';

if (!fs.existsSync(name)){
    fs.mkdirSync(name);
    rp(collector).then(function(collectorRAW) {
      fs.appendFile(`${name}/${name}.js`, collectorRAW, function (err) {
        if (err) throw err;
        console.log('Created script!');
      })
    });

    fs.appendFile(`${name}/settings.json`, settings, function (err) {
      if (err) throw err;
      console.log('Created settings!');
    })

    fs.appendFile(`${name}/last.json`, last, function (err) {
      if (err) throw err;
      console.log('Created file for the last song!');
    })

    if (charta = "Y") {
      rp(chart).then(function(chartRAW) {
        fs.appendFile(`${name}/chart.js`, chartRAW, function (err) {
          if (err) throw err;
          console.log('Created Chart script.');
        })
      });

      fs.appendFile(`${webdir}/followers.json`, '{"xaxes": [], "yaxes": []}', function (err) {
        if (err) throw err;
        console.log('Created file for the followers chart!');
      })

      rp(chartSite).then(function(chartSiteRAW) {
      fs.appendFile(`${webdir}/chart.php`, chartSiteRAW, function (err) {
        if (err) throw err;
        console.log('Created Website file!');
      })
    })
    }

} else {
  console.log('This name does already exist.');
  return;
}
