// Adapted from a CFDG source by Erwin, November 4th, 2007
// http://www.contextfreeart.org/gallery/view.php?id=947

var code = {
	setup: {
		background: '#000',
		minimumSize: 0.1,
		globalScale: 10
	},
	startShape: 'start',
	start: {
		shapes: [
			{ shape: "CIRCLE" },
			{ shape: "element", hsla: [0, .33, 1, .33], rotate: 0 },
			{ shape: "element", hsla: [60, .33, 1, .33], rotate: 120 },
			{ shape: "element", hsla: [120, 0.618, 1, .66], rotate: 0 },
			{ shape: "element", hsla: [180, 0.66, 1, .77], rotate: 240 },
			{ shape: "element", hsla: [240, 0.77, 1, .66], rotate: 0 },
			{ shape: "element", hsla: [300, 0.88, 1, .618], rotate: 360 },
			{ shape: "element", hsla: [360, 1, 1, .55], rotate: 0 }
		]
	},
	element: [
		{
			shapes: [
				{ shape: "SQUARE" },
				{ shape: "element", x: .618, scale: .99 }
					]
		},
		{
			weight: 0.033,
			shapes: [
				{ shape: "SQUARE" },
				{ shape: "element", x: .77, rotate:  90, scale: .99, light: -0.075 },
				{ shape: "element", x: .29, rotate: -90, scale: .99, light: -0.075 }
			]
		},
		{
			weight: 0.0618,
			shapes: [
				{ shape: "CIRCLE", scale: 1 },
				{ shape: "element", translate: [ 0.3, -0.3 ], rotate: 30, scale: .99, light: -0.125 }
			]
		},
		{
			weight: 0.044,
			shapes: [
				{ shape: "SQUARE", scale: 1 },
				{ shape: "element", translate:[ 0.3, 0.3 ], rotate: -30, scale: .99 }
			]
		},
		{
			weight: 0.012,
			shape: "CIRCLE",
			scale: 10
		}
	]
};

document.getElementById("generate").onclick = CFAjs.render;

CFAjs.render(code);