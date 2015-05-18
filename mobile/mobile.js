
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var maybePreventPullToRefresh = false;
var color = "#df4b26";
var drawing = false;
var joined = false;
var named = false;
var icon = false;
var socket;
var height = $(window).height()-50;
var width = $(window).width()-20;

context = document.getElementById('canvas').getContext("2d");


$(document).ready(function(){
  $("#canvas").attr("height", height + "px");
  $("#canvas").attr("width", width + "px");
});

$('#canvas').bind("touchstart",function(e){

  maybePreventPullToRefresh = window.pageYOffset == 0;

  var mouseX = e.originalEvent.touches[0].pageX - this.offsetLeft;
  var mouseY = e.originalEvent.touches[0].pageY - this.offsetTop;

  paint = true;
  addClick(mouseX, mouseY);
  main.redraw(clickX, clickY, clickDrag, color, false);
});

$('#canvas').bind("touchmove", function(e){
  if(paint){
    addClick(e.originalEvent.touches[0].pageX - this.offsetLeft, e.originalEvent.touches[0].pageY - this.offsetTop, true);
    main.redraw(clickX, clickY, clickDrag, color, false);
  }
  e.preventDefault();
});


$('#canvas').bind("touchend", function(e){
  paint = false;
});

$('#canvas').mouseleave(function(e){
  paint = false;
});

document.getElementById("send_button").addEventListener("click", function(){
  if(!joined)
  {
    room = document.getElementById("input_form").input.value;
    document.getElementById("input_form").input.value = "";
    joined = true;
    socket = io.connect('http://'+window.location.hostname+':3000');
    socket.emit("type", ["client", room]);
  }else if(!named)
  {
    name = document.getElementById("input_form").input.value;
    socket.emit("name", name);
    $("#canvas").css("display", "block");
    named = true;
    $("#input_form").css("display", "none");
  }else
  {
    console.log("drawing");
    drawing != drawing;
    socket.emit("draw", [clickX, clickY, clickDrag, height, width, color]);
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    $("#canvas").css("display", "none");
    $("button").css("display", "none");
  }
});


function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}
