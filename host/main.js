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

var clients;
//context = document.getElementById('canvas').getContext("2d");

socket.on('drawing', function(data)
{
  drawing = data[0];
  name = data[1];
  name.replace(" ", "%20");
  template = '<div id="'+name+'" class="player"><canvas class="player_icon" width="490" height="220"></canvas><span class="player_name"></span>';
  $("#players").append(template);
  $("#"+name).find("canvas").attr("class", name);
  $("#"+name).find("span").html(name)
  context = document.getElementsByClassName(name)[0].getContext("2d");
  $("."+name).attr("height", drawing[3] + "px");
  $("."+name).attr("width", drawing[4] + "px");
  main.redraw(drawing[0], drawing[1], drawing[2], drawing[5]);
});

socket.on("player_name", function(name)
{
  console.log("Player " + name + " has joined the game");
});
