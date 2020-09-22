// Adapted from a CFDG source by Erwin, November 4th, 2007
// http://www.contextfreeart.org/gallery/view.php?id=947

var code = {
	setup: {
		background: '#000',
		minimumSize: 0.125,
		globalScale: 10
	},
	startShape: 'start',
	start: {
		shapes: [
			{ shape: "element", hsla: [27, 0.7, 1, 1] },
			{ shape: "element", hsla: [47, 0.7, 1, 1], rotate: 30 },
			{ shape: "element", hsla: [80, 0.7, 1, 1], rotate: 60 },
			{ shape: "element", hsla: [120, 0.7, 1, 1], rotate: 180 },
			{ shape: "element", hsla: [160, 0.7, 1, 1], rotate: 240 },
			{ shape: "element", hsla: [200, 0.7, 1, 1], rotate: 360 }
		]
	},
	element: [
		{
			shapes: [
				{ shape: "SQUARE" },
				{ shape: "element", x: .59, scale: .99 }
			]
		},
		{
			weight: 0.026,
			shapes: [
				{ shape: "SQUARE" },
				{ shape: "element", x: .29, rotate:  90, scale: .99, light: -0.075 },
				{ shape: "element", x: .29, rotate: -90, scale: .99, light: -0.075 }
			]
		},
		{
			weight: 0.013,
			shapes: [
				{ shape: "SQUARE", scale: 1 },
				{ shape: "element", translate: [ 0.3, -0.3 ], rotate: 30, scale: .99, light: -0.125 }
			]
		},
		{
			weight: 0.01,
			shapes: [
				{ shape: "SQUARE", scale: 1 },
				{ shape: "element", translate:[ 0.3, 0.3 ], rotate: -30, scale: .99 }
			]
		},
		{
			weight: 0.005,
			shape: "SQUARE",
			scale: 10
		}
	]
};

document.getElementById("generate").onclick = CFAjs.render;

CFAjs.render(code);