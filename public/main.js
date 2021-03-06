// Global variables
var selectedColor //store the selected color globally.
var canvas //the <canvas>
var context //the context of the canvas, aka what's inside it.
var tempCanvas
var tempContext
var zoom = 20 //how big our pixel block is.
var screenX = $(window).width()
var screenY = $(window).height()
var isDown = false
var startCoords = []
var last = [0, 0]
var windowWidth = 500;
var windowHeight = 500
var socket = io()
//^this is the actual size of the image. We want to zoom in on this and base it off that.
//however when we save we need to assure that it's 500

var windowX = 0;
var windowY = 0;

function initializeCanvas(){
    canvas = $('#board').get(0) //get that canvas...
    context = canvas.getContext("2d")
    canvas.width = 0
    canvas.height = 0
	context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
}

function convertImageToCanvas(img) {
	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = img.width;
	tempCanvas.height = img.height;
	tempCanvas.getContext("2d").drawImage(img, 0, 0);
	return canvas;
}

function convertCanvasToImage(can) {
	var tempImg = new Image();
	tempImg.src = can.toDataURL("image/png");
	return tempImg;
}

function zoomIn(){
    console.log("I was clicked")
    imgContent.src = "./img/image.bmp"
    imgContent.onload = function(){
        canvas.width = imgContent.width
        canvas.height = imgContent.height
        context.drawImage(imgContent, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width*1.5, canvas.height*1.5)
    }
}

function zoomOut(){
    console.log("I was clicked")
    imgContent.src = "./img/image.bmp"
    imgContent.onload = function(){
        canvas.width = imgContent.width
        canvas.height = imgContent.height
        context.drawImage(imgContent, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width*1, canvas.height*1)
    }
}

//Start jQuery
$(function(){
    
    //Declare our variables.
    selectedColor = $("#selection")
    initializeCanvas()
    
    //draw the image.bmp to the canvas.
    imgContent = new Image()
    imgContent.src = "./img/image.bmp" //must be 500x500!
    imgContent.onload = function(){
        canvas.width = imgContent.width
        canvas.height = imgContent.height
    //     context.drawImage(photo, windowX, windowY, windowWidth, windowHeight, 0, 0,
    // windowWidth,windowHeight);
        context.drawImage(imgContent, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
    }


    canvas.onmousedown = function(e){
        if(selectedColor.css('display') != 'none'){
            var x = Math.floor(selectedColor.x)
            var y = Math.floor(selectedColor.y)
            isDown = true
            startCoords = [x - last[0], y - last[0]]
            context.fillStyle = selectedColor.css('background-color')
            context.fillRect(x, y, zoom, zoom)
            selectedColor.hide()
            //user put in a block, run socket
            socket.emit('block', convertCanvasToImage(canvas).src)
            socket.on('load image', function(bin){
                imgContent.onload = function(){
                    canvas.width = imgContent.width
                    canvas.height = imgContent.height
                    context.drawImage(imgContent, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
                }
                imgContent.src = bin;
                console.log("image received")
            })
        }
    }

    canvas.onmouseup = function(e){
        isDown = false
        last = [
            e.offsetX - startCoords[0],
            e.offsetY - startCoords[1]
        ]
    }

    canvas.onmousemove = function(e){
        if(!isDown) return;
        //else pan the canvas...somehow.
        console.log("user is holding mouse and moving on canvas...pan...")
    }

    //When a user clicks on a div inside the palettes, store the data of that div to our other div (selectedColor)
    $('#palettes div').click(function(e){
        selectedColor.css('background-color', $(this).css("background-color"))
        selectedColor.attr('class', $(this).attr('class'))
        selectedColor.show() //by default we set display:none.
    })

    //this will always track the mouse movement.
    //But we only want to follow/write to the variable if we are display: block for the selected color.
   $(document).mousemove(function(e){
       if(selectedColor.css('display') != 'none'){
	       selectedColor.x = (Math.floor(e.pageX / zoom) * zoom)
	       selectedColor.y = (Math.floor(e.pageY / zoom) * zoom)
	       selectedColor.css("left", selectedColor.x+1)
	       selectedColor.css("top", selectedColor.y+1)
	       selectedColor.css("width", zoom)
	       selectedColor.css("height", zoom)
           //attempt at something cool.
            //    context.rect(selectedColor.x, selectedColor.y, zoom, zoom)
            //    context.fillStyle = "rgba(0,0,0, 0.3)"
            //    context.strokeStyle = 'black'
            //    context.fill()
            //    context.stroke()
       }
	})
    $(window).resize(function(e){
        //do something here to account for window resize. 
    })
})