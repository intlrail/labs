var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var createMountain = function(color, opacity, steepness, complexity, shadow) {

	// set up default options
	color = color || '#111';
	opacity = opacity || 1;
	steepness = steepness || 2;
	complexity = complexity || 0.6;

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

		/*if (height > maxHeight) {
			height = maxHeight;
			slope *= -1;

		}

		if (height < 0) {
			height = 0;
			slope *= -1;
		}*/

		// draw column
		ctx.beginPath();
		ctx.moveTo(x * 2, maxHeight );
		ctx.lineTo(x, height);

		ctx.globalAlpha = opacity;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.globalCompositeOperation = 'screen';    



		/*

		normal | multiply | screen | overlay |
		              darken | lighten | color-dodge | color-burn | hard-light |
		              soft-light | difference | exclusion | hue | saturation |
		              color | luminosity
		                   */

		// draw clone

		if (shadow) {
	//		ctx.moveTo(x, maxHeight - canvas.height);
			ctx.lineTo(x, height - shadow);
			ctx.globalAlpha = 0.15;
			ctx.stroke();

		}



	}

}

// color, opacity, steepness, complexity, add shadow
createMountain('#555', 0.7, 2, 0.2, 20, true);
createMountain('#666', 0.9, 2, 0.5, 40, true);
createMountain('#aaa', 0.4, 1, 0.75, 30);
createMountain('#ddd', 1, 2, 0.5, 15);