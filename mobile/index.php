<html>
  <head>
    <link rel="stylesheet" type="text/css" href="style.css">
    <!--<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">-->
  </head>
  <body>
      <form id="input_form" onsubmit="return false;">
        <input type="text" name="input" autocomplete="off" maxlength="15">
      </form>
      <canvas id="canvas"></canvas>
      <button id="send_button">Send</button>
      <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
      <script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
      <script src="../lib/main.js"></script>
      <script src="mobile.js"></script>
  </body>
</html>
