"use strict";

const svg = SVG({
	name: "our new land",
	size: 200, // millimeters
	background: "#fff",
	stroke: "#333",
	opacity: 1,
	strokeWidth: 0.1,
	cpuTime: 2 // milliseconds
});

let y, perlin, line;

function setup() {
	perlin = svg.perlin({ octaves: 2 });
	y = 207;
	line = Array.from({ length: 210 }, () => 207);
}

function draw(i) {
	y -= 0.3;
	svg.moveTo(-5, y);
	let v = false;
	for (let x = -5; x < 207; x++) {
		let z = y + 0.25 * ((2048 * perlin.noise(x * 0.02, 6 + y * 0.03)) & (16 + 32 + 0 + 128 + 256));
		if (z > 0) v = true;
		if (z > line[x+10]) z = line[x+10] - 0.05;
		line[x+10] = z;
		svg.lineTo(x, z);
	}
	return v;
}