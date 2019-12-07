const readlineSync = require('readline-sync')
console.log('Thank you for using my tool.');
const rp = require('request-promise');
const exsample = 'https://raw.githubusercontent.com/triggeredLife/radio2spotify/master/example.js'

var clientId = readlineSync.question('Please enter your Spotify Client Id ');

var clientSecret = readlineSync.question('Please enter your Spotify Client Secret ');

var AccessToken = readlineSync.question('Please enter your Spotify Access Token ');

var RefreshToken = readlineSync.question('Please enter your Spotify Refresh Token ');

var name = readlineSync.question('Please enter the name of the Radio Channel ').replace(' ', '_');

var uri = readlineSync.question('Please enter the URI of your Playlist (e.g. 3etIBt3wCSGny0MGgCwiHq) ');

var url = readlineSync.question('Please enter the URL of the Channel from OnlineRadioBox (e.g. https://onlineradiobox.com/ae/virgin) ') + '/playlist';

var fs = require('fs');

var settings = `{"name": "${name}", "uri": "${uri}", "url": "${url}", "clientId": "${clientId}", "clientSecret": "${clientSecret}", "AccessToken": "${AccessToken}", "RefreshToken": "${RefreshToken}"}`;

var last = '{"song": ""}';

if (!fs.existsSync(name)){
    fs.mkdirSync(name);
    rp(exsample).then(function(html) {
      fs.appendFile(`${name}/${name}.js`, html, function (err) {
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

    if (fs.existsSync("start.sh")){
      fs.readFile('start.sh', 'utf8', function(err, contents) {
        contents = contents.replace('done', '')
        contents = contents.replace('  sleep 60', '')
        contents = contents + `  echo - - - - - ${name} - - - - -\r\n  cd -\r\n  cd ${name}\r\n  node ${name}.js\r\n  sleep 60\r\ndone`
        fs.unlink('start.sh', (err) => {
          if(err) return console.log(err);
          console.log('Deleted the file');
        })
        setTimeout(function () {
          fs.appendFile('start.sh', contents, function (err) {
            if (err) throw err;
            console.log('Saved start file!');
          })
        }, 5000);
      });
    } else {
      var startMuster = `while true\r\ndo\r\n  echo - - - - - ${name} - - - - -\r\n  cd -\r\n  cd ${name}\r\n  node ${name}.js\r\n  sleep 60\r\ndone`
      fs.appendFile('start.sh', startMuster, function (err) {
        if (err) throw err;
        console.log('Saved start file!');
      })
    }

} else {
  console.log('This name does already exist.');
  return;
}

// fs.unlink('start.sh', (err) => {
//   if(err) return console.log(err);
//   console.log('Deleted the start file');
// })
