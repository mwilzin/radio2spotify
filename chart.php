<!DOCTYPE html>
<html lang="de" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
  </head>
  <body>
    <canvas id="chart" width="400" height="100"></canvas>
    <script>
      var folFile = <?php echo(file_get_contents("followers.json")) ?>;
      var xaxes = folFile.xaxes
      var yaxes = folFile.yaxes;
      console.log(folFile);

      var ctx = document.getElementById('chart').getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: xaxes,
              datasets: [{
                  label: 'Followers of Virgin Radio Dubai LIVE',
                  data: yaxes,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      });
    </script>
  <br>
  <?php
    function ceilPrecision($val, $precision = 0){
      return round(ceil($val * pow(10, $precision)) / pow(10, $precision), $precision);
    }
    $someJSON = '{"xaxes":["1.5.2020"],"yaxes":[185]}';
    $followers =  json_decode($someJSON);
  ?>
  <table>
    <tr>
    <th>Current followers</th>
    <th>New followers per day Ø (since 100 Followers)</th>
    <th>Time to <?php echo ceilPrecision(185, -2); ?></th>
    </tr>
    <tr>
    <td><?php echo $followers[0]->xaxes ?></td>
    <td>(PHP Code)</td>
    <td>(PHP Code)</td>
    </tr>
    </table>
  </body>
</html>
