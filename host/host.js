var host =
{

    get_clientsize: function(obj)
    {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    }
}

var clients = new Array();;
var started = false;
//context = document.getElementById('canvas').getContext("2d");

socket.on('drawing', function(data)
{
  if(!started)
  {
    drawing = data[0];
    name = data[1];
    template = '<li id="'+name+'" class="player"><span class="player_name"></span><canvas class="player_icon" width="490" height="220"></canvas></li>';
    $("#players").append(template);
    $("#"+name).find("canvas").attr("class", name);
    $("#"+name).find("span").html("Room code: "+name)

    context = document.getElementsByClassName(name)[0].getContext("2d"); //defines the new context variable to be used by main.redraw();
    $("."+name).attr("height", drawing[3] + "px");
    $("."+name).attr("width", drawing[4] + "px");
    main.redraw(drawing[0], drawing[1], drawing[2], drawing[5], true);
    clients.push([name, drawing]);
  }
});

socket.on("player_name", function(name)
{
  console.log("Player " + name + " has joined the game");
});

socket.on("room_name", function(name)
{
  $("#room_name").html(name);
});
