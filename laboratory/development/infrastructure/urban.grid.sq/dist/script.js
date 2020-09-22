// Adapted from a CFDG source by Erwin, November 4th, 2007
// http://www.contextfreeart.org/gallery/view.php?id=947

var code = {
	setup: {
		background: '#111',
		minimumSize: 0.5,
		globalScale: 10
	},
	startShape: 'start',
	start: {
		shapes: [
			{ shape: "element", hsla: [47, 0.7, 1, 1] },
			{ shape: "element", hsla: [70 , 0.7, 1, 1], rotate: 180 }
		]
	},
	element: [
		{
			shapes: [
				{ shape: "SQUARE" },
				{ shape: "element", x: .9, scale: .99 }
			]
		},
		{
			weight: 0.026,
			shapes: [
				{ shape: "SQUARE" },
				{ shape: "element", x: .9, rotate:  90, scale: .99, light: -0.075 },
				{ shape: "element", x: .9, rotate: -90, scale: .99, light: -0.075 }
			]
		},
		{
			weight: 0.01,
			shapes: [
				{ shape: "SQUARE", scale: 1 },
				{ shape: "element", translate: [ 0.6, -0.15 ], rotate: 30, scale: .99 }
			]
		},
		{
			weight: 0.01,
			shapes: [
				{ shape: "SQUARE", scale: 1 },
				{ shape: "element", translate:[ 0.6, 0.15 ], rotate: -30, scale: .99 }
			]
		},
		{
			weight: 0.002,
			shape: "SQUARE",
			scale: 10
		}
	]
};

document.getElementById("generate").onclick = CFAjs.render;

CFAjs.render(code);