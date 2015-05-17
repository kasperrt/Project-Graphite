<html>
  <head>
      <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
      <div id="players"></div>
      <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
      <script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
      <script>
          var socket = io.connect('http://'+window.location.hostname+':3000');
          socket.emit("type", ["host", "123"]);
      </script>
      <script src="../main.js"></script>
      <script src="main.js"></script>
  </body>
</html>
