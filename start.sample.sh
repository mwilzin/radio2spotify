while true
do
  echo - - - - - Virgin Radio Dubai - - - - -
  cd VirginRadioDubai
  node VirginRadioDubai.js
  currenttime=$(date '+%-d.%-m.%Y')
  if ! grep -q $currenttime "/var/www/html/r2s/followers.json"; then
    node chart.js
  fi
  cd -
  sleep 10
  echo - - - - - Side Street Radio - - - - -
  cd SideStreetRadio
  node SideStreetRadio.js
  cd -
  sleep 10
  echo - - - - - One World Radio - - - - -
  cd OneWorldRadio
  node OneWorldRadio.js
  cd -
  sleep 10
  echo - - - - - Virgin Radio BEAT - - - - -
  cd VirginRadioBEAT
  node VirginRadioBEAT.js
  cd -
  sleep 20
done
