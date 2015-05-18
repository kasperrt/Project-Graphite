
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

socket.on("to_draw", function(object)
{
  print_message(object);
  hide(false, false, false, true);
});

socket.on("started", function(data)
{
  console.log("already started");
  joined = false;
  named = false;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  print_message("Game already started");
  hide(true, false, false, false);
});

socket.on("leave", function(){
  socket.emit("leave");
});

document.getElementById("send_button").addEventListener("click", function(){
  if(!joined)
  {
    room = document.getElementById("input_form").input.value;
    document.getElementById("input_form").input.value = "";
    joined = true;

    print_message("Enter playername");
    hide(true, false, false, false);

    socket.emit("type", ["client", room]);
  }else if(!named)
  {
    name = document.getElementById("input_form").input.value;
    socket.emit("name", name);
    $("#canvas").css("display", "block");
    named = true;

    print_message("Draw your icon");
    hide(false, false, false, true);
  }else
  {
    console.log("drawing");
    socket.emit("draw", [clickX, clickY, clickDrag, height, width, color]);
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    print_message("Waiting for other players");
    hide(true, true, false, true);
  }
});

function print_message(string)
{
  $("#message").html(string);
}

function hide(canvas, button, message, form)
{
  if(canvas) $("#canvas").css("display", "none");
  else if(!canvas) $("#canvas").css("display", "block");
  if(button) $("button").css("display", "none");
  else if(!button) $("button").css("display", "block");
  if(message) $("#message").css("display", "none");
  else if(!message) $("#message").css("display", "block");
  if(form) $("#input_form").css("display", "none");
  else if(!form) $("#input_form").css("display", "block");
}


function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}
