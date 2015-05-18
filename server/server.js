var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var crypto = require('crypto');

var socketport = 3000;
var port = 80;
var lists = [];

var static = require('node-static');
var MobileDetect = require('mobile-detect');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {

        md = new MobileDetect(request.headers['user-agent']);
        if(md.mobile() === null) type = "host";
        else type = "mobile";
        if(request.url == "/style.css") file.serveFile(type+'/style.css', 200, {}, request, response);
        else if(request.url == "/lib/main.js") file.serveFile('lib/main.js', 200, {}, request, response);
        else if(request.url == "/host.js" || request.url == "/mobile.js") file.serveFile(type+'/'+type+'.js', 200, {}, request, response);
        else file.serveFile(type+'/index.html', 200, {}, request, response);

    }).resume();
}).listen(port, function(){console.log('HTTP Server lsitening at port %d', port)});

server.listen(socketport, function () {
  console.log('Socket.io listening at port %d', port);
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
          console.log('client present');
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
