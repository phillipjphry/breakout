 $(document).ready(function(){
     $("button").click(function(){
	 location.reload();
    });
//code

     var x = 150;
     var y = 150;
     var dx = 2;
     var dy = 4;
     var WIDTH;
     var HEIGHT;
     var ctx;
     var paddlex;
     var paddleh = 10;
     var paddlew = 75;
     var intervalId = 0;
     var canvasMinX = 0;
     var canvasMaxX = 0;
     var bricks;
     var NROWS = 5;
     var NCOLS = 5;
     var BRICKWIDTH;
     var BRICKHEIGHT= 15;
     var PADDING = 1;
     var ballr = 10;
     var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
     var paddlecolor = "#FFFFFF";
     var ballcolor = "#FFFFFF";
     var backcolor = "#000000";
     rightDown = false;
     leftDown = false;

     //BEGIN LIBRARY CODE
     function drawbricks() {
	  for (i=0; i < NROWS; i++) {
	     ctx.fillStyle = rowcolors[i];
	     for (j=0; j < NCOLS; j++) {
		 if (bricks[i][j] == 1) {
		     rect((j * (BRICKWIDTH + PADDING)) + PADDING,
			  (i * (BRICKHEIGHT + PADDING)) + PADDING,
			  BRICKWIDTH, BRICKHEIGHT);
		 }
	     }
	 }
     }

     function initbricks() {
	 bricks = new Array(NROWS);
	 for (i=0; i < NROWS; i++) {
	     bricks[i] = new Array(NCOLS);
	     for (j=0; j < NCOLS; j++) {
		 bricks[i][j] = 1;
	     }
	 }
     }

     function init_mouse() {
	 canvasMinX = $("#canvas").offset().left;
	 canvasMaxX = canvasMinX + WIDTH;
     }

     function onMouseMove(evt) {
	 if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
	     paddlex = Math.max(evt.pageX - canvasMinX - (paddlew/2), 0);
	     paddlex = Math.min(WIDTH - paddlew, paddlex);
//	     paddlex = evt.pageX - canvasMinX - paddlew / 2;
	 }
     }

     $(document).mousemove(onMouseMove);

     function onKeyDown(evt) {
	 if (evt.keyCode == 39) rightDown = true;
	 else if (evt.keyCode == 37) leftDown = true;
     }
     
     function onKeyUp(evt) {
	 if (evt.keyCode == 39) rightDown = false;
	 else if (evt.keyCode == 37) leftDown = false;
     }

     $(document).keydown(onKeyDown);
     $(document).keyup(onKeyUp);

     function init() {
	 ctx = $('#canvas')[0].getContext("2d");
	 WIDTH = $("#canvas").width();
	 HEIGHT = $("#canvas").height();
	 paddlex = WIDTH / 2;
	 BRICKWIDTH = (WIDTH/NCOLS) - 1;
	 canvasMinX = $("#canvas").offset().left;
	 canvasMaxX = canvasMinX + WIDTH
	 intervalId =  setInterval(draw, 10);
     }

     function circle(x,y,r) {
	 ctx.beginPath();
	 ctx.arc(x, y, r, 0, Math.PI*2, true);
	 ctx.closePath();
	 ctx.fill();
     }
     
     function rect(x,y,w,h) {
	 ctx.beginPath();
	 ctx.rect(x,y,w,h);
	 ctx.closePath();
	 ctx.fill();
     }

     function clear() {
	 ctx.clearRect(0, 0, WIDTH, HEIGHT);
	 rect(0,0,WIDTH,HEIGHT);
     }


     //END LIBRARY CODE

     function draw() {
	 ctx.fillStyle = backcolor;
	 clear();
	 ctx.fillStyle = ballcolor;
	 circle(x, y, 10);
	 
	 //move the paddle if left or right is on
	 if (rightDown) paddlex += 5;
	 else if (leftDown) paddlex -= 5;
	 ctx.fillStyle = paddlecolor;
	 rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);

	 drawbricks();

	 //have we hit a brick?
	 rowheight = BRICKHEIGHT + PADDING;
	 colwidth = BRICKWIDTH + PADDING;
	 row = Math.floor(y/rowheight);
	 col = Math.floor(x/colwidth);
	 //if so, reverse the ball and mark the brick as broken
	 if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
	     dy = -dy;
	     bricks[row][col] = 0;
	 }
	 
	 if (x + dx > WIDTH || x + dx < 0)
	     dx = -dx;
	 
	 if (y + dy < 0)
	     dy = -dy;
	 else if (y + dy > HEIGHT) {
	     if (x > paddlex && x < paddlex + paddlew) {
		 dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
		 dy = -dy;
	     }
	     else
	      //gameover man! gameover!
		 clearInterval(intervalId);
	 }
	 x += dx;
	 y += dy;
     }
     
     init();
     initbricks();
 });