//This finds the position on the canvas 

var frame = document.getElementById('frame');
frame.width = 800;
frame.height = 600;
var context = frame.getContext('2d');

var solution_frame = document.getElementById('solution_frame');
var solution_context = solution_frame.getContext('2d');
solution_frame.width = 25;
solution_frame.height = 25;


function scale_to_fit(img){
    //get the scale
    var scale = Math.min(frame.width/img.width, frame.height/img.height);
    var x = (frame.width/2) - (img.width/2) * scale;
    var y = (frame.height/2) - (img.height/2) * scale;
    context.drawImage(base_image,x,y,img.width*scale, img.height*scale);
}

$('#frame').mousemove(function(e) {
    var pos = findPos(this);
    
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var context = this.getContext('2d');
    var pixel = context.getImageData(x, y, 1, 1).data; 
    var hex_value = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
    solution_context.fillStyle = hex_value;
    solution_context.fillRect(0,0,solution_frame.width, solution_frame.height);
    $('#solution').html(hex_value);
});

function findPos(obj) {
    var cursor_left = 0, cursor_top = 0;
    if (obj.offsetParent) {
        do {
            cursor_left += obj.offsetLeft;
            cursor_top += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: cursor_left, y: cursor_top };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Not a valid color";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function getColor() {
    document.getElementById("colorHex").innerHTML = 'HEX : ' + document.getElementById("inputColor").value;
    document.getElementById("colorRGB").innerHTML = 'RGB : '+ hexToRgb(document.getElementById("inputColor").value);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    return 'RGB('+r+','+g+','+b+')'; 
}