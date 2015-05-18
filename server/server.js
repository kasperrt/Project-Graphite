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
// Create a node-static server instance to serve the './' folder
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
}).listen(port, function(){console.log('HTTP Server listening at port %d', port)});

server.listen(socketport, function () {
  console.log('Socket.io listening at port %d', port);
});


io.on('connection', function(socket){

  var guid = hash_pass(socket.handshake.headers["user-agent"] + socket.handshake.address + socket.handshake.headers["accept-language"]).substring(0,8);
  var room;
  var n;

  socket.on('type', function(type)
  {
      switch (type[0]){
        case "host":
          room = guid.toUpperCase().substring(0,4);
          console.log('host present');
          socket.join(room);
          socket.emit("room_name", room);
          break;
        case "client":
          room = type[1];
          console.log('client present');
          socket.join(room + '_client');
          console.log(socket.id);
          io.to(room).emit('client-join', socket.id);
          break;
      }
  });

  socket.on("not_allowed", function(client_id)
  {
    io.to(client_id).emit('started');
    io.to(client_id).emit("leave");
  });

  socket.on("leave", function()
  {
    socket.leave(room+"_client");
  });

  socket.on("game_start", function(options)
  {
    var clients = io.sockets.adapter.rooms[room+"_client"];

    console.log(clients);

    //to get the number of clients
    var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;

    for (var clientId in clients ) {

         //this is the socket of each client in the room.
         var clientSocket = io.sockets.connected[clientId];
         //you can do whatever you need with this
         clientSocket.emit('to_draw', options[0]);
         options.shift();
    }
  });

  socket.on("draw", function(data)
  {
    socket.broadcast.to(room).emit('drawing', [data, n]);
  });

  socket.on("name", function(name)
  {
    n = name.replace(/[^a-zA-Z0-9]/gi,'');;
    //socket.set('nickname', n);
    socket.broadcast.to(room).emit("player_name", n);
  });

  socket.on('disconnect', function()
  {
    if(type == "host")
    {
      io.to(room+"_client").emit('started');
      io.to(room+"_client").emit('leave');
    }
    console.log("disconnected");
  });
});

function hash_pass(adminpass)
{
  return crypto.createHash('sha256').update(adminpass).digest('base64');
}
