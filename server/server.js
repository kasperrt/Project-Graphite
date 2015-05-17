var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var crypto = require('crypto');

var port = 3000;
var lists = [];

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


io.on('connection', function(socket){

  var guid = hash_pass(socket.handshake.headers["user-agent"] + socket.handshake.address + socket.handshake.headers["accept-language"]).substring(0,8);
  var room;
  var n;

  socket.on('type', function(type)
  {
      room = type[1];
      switch (type[0]){
        case "host":
          console.log('host present');
          socket.join(room);
          break;
        case "client":
          socket.join('client');
          io.to(room).emit('client-join', guid);
          break;
      }
  });

  socket.on("draw", function(data)
  {
    socket.broadcast.to(room).emit('drawing', [data, n]);
  });

  socket.on("name", function(name)
  {
    n = name;
    socket.broadcast.to(room).emit("player_name", n);
  });

  socket.on('disconnect', function()
  {
    console.log("disconnected");
  });
});

function hash_pass(adminpass)
{
  return crypto.createHash('sha256').update(adminpass).digest('base64');
}
