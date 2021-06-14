var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var createMountain = function(color, opacity, steepness, complexity, shadow) {

	// set up default options
	color = color || '#111';
	opacity = opacity || 0.618;
	steepness = steepness || 0.618;
	complexity = complexity || 1.618;

	var	maxHeight = canvas.height;

	var x,
		height = Math.random() * maxHeight,
		slope = (Math.random() * steepness) * 2 - steepness;


	// creating the landscape

	for (x = 0; x < canvas.width; x++) {
		// change height and slope
		height += slope * 0.5;
		slope += (Math.random() * complexity) * 2 - complexity;

		//console.log(slope);

		// clip height and slope to maximum
		if (slope > steepness) {
			slope = steepness;
		}

		if (slope < -steepness) {
			slope = -steepness * 0.25;
		}

		if (height > maxHeight) {
			height = maxHeight;
			slope *= -1;

		}

		if (height < 0) {
			height = 0;
			slope *= -1;
		}

		// draw column
		ctx.beginPath();
		ctx.moveTo(x * 2, maxHeight );
		ctx.lineTo(x, height);

		ctx.globalAlpha = opacity;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.globalCompositeOperation = 'multiply';    


/*normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity*/

		// draw clone

		if (shadow) {
	//		ctx.moveTo(x, maxHeight - canvas.height);
			ctx.lineTo(x, height - shadow);
			ctx.globalAlpha = 0.125;
			ctx.stroke();

		}

	}

}

// color, opacity, steepness, complexity, add shadow


// createMountain('#555', 0.7, 2, 0.2, 20, true);
// createMountain('#666', 0.9, 2, 0.5, 40, true);
// createMountain('#aaa', 0.4, 1, 0.75, 30);
// createMountain('#ddd', 1, 2, 0.5, 15);

createMountain('#000000', 0.3, 1, 50, true);
createMountain('#101010', 0.3, 1, 50, true);
createMountain('#1b1b1b', 0.3, 1, 50, true);
createMountain('#242424', 0.3, 1, 50, true);
createMountain('#2c2c2c', 0.3, 1, 50, true);
createMountain('#333333', 0.3, 1, 50, true);
createMountain('#3a3a3a', 0.3, 1, 50, true);
createMountain('#414141', 0.3, 1, 50, true);
createMountain('#484848', 0.3, 1, 50, true);
createMountain('#4f4f4f', 0.3, 1, 50, true);
createMountain('#565656', 0.3, 1, 50, true);
createMountain('#5d5d5d', 0.3, 1, 50, true);
createMountain('#646464', 0.3, 1, 50, true);
createMountain('#6b6b6b', 0.3, 1, 50, true);
createMountain('#727272', 0.3, 1, 50, true);
createMountain('#797979', 0.3, 1, 50, true);
createMountain('#818181', 0.3, 1, 50, true);
createMountain('#898989', 0.3, 1, 50, true);
createMountain('#919191', 0.3, 1, 50, true);
createMountain('#999999', 0.3, 1, 50, true);
createMountain('#a2a2a2', 0.3, 1, 50, true);
createMountain('#ababab', 0.3, 1, 50, true);
createMountain('#b4b4b4', 0.3, 1, 50, true);
createMountain('#bebebe', 0.3, 1, 50, true);
createMountain('#c8c8c8', 0.3, 1, 50, true);
createMountain('#d2d2d2', 0.3, 1, 50, true);
createMountain('#dddddd', 0.3, 1, 50, true);
createMountain('#e8e8e8', 0.3, 1, 50, true);
createMountain('#f3f3f3', 0.3, 1, 50, true);
createMountain('#ffffff', 0.3, 1, 50, true);