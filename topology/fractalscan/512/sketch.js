"use strict";

const svg = SVG({
	name: "fractal terrain",
	author: "https://codepen.io/ge1doot/",
	size: 200, // millimeters
	background: "none",
	stroke: "#fff",
	strokeWidth: 0.05,
	cpuTime: 60 // milliseconds / frame
});

/////////////////////////////////////
const size = 512;
const water = 0; // 0 for no water
let seed = (Math.random() * 100000) | 0;
const hmap = [];
let line;
let pen = false;
/////////////////////////////////////

console.log("seed: " + seed);
function random() {
	seed = (seed * 16807) % 2147483647;
	return (seed - 1) / 2147483646;
}

function setup() {
	let randomLevel = 20;
	const nbits = size.toString(2).length - 1;
	const rnd = () => randomLevel * (-1 + 2 * random());
	line = new Float32Array(size + 1);
	for (let i = 0; i <= size; i++) hmap[i] = new Float32Array(size + 1);
	let t = 1;
	let x = size / 2;
	for (let s = 1; s <= nbits; s++) {
		for (let v = 0; v <= size; v += 2 * x) {
			for (let n = 1; n <= t; n += 2) {
				hmap[n * x][v] = (hmap[(n - 1) * x][v] + hmap[(n + 1) * x][v]) / 2 + rnd();
				hmap[v][n * x] = (hmap[v][(n - 1) * x] + hmap[v][(n + 1) * x]) / 2 + rnd();
			}
		}
		for (let n = 1; n <= t; n += 2) {
			for (let m = 1; m <= t; m += 2) {
				hmap[n * x][m * x] =
					0.25 *
						(hmap[n * x + x][m * x] +
							hmap[n * x - x][m * x] +
							hmap[n * x][m * x + x] +
							hmap[n * x][m * x - x]) +
					rnd();
			}
		}
		t = 2 * t + 1;
		x /= 2;
		randomLevel /= 2;
	}
	for (let w = 0; w <= size; w++) {
		for (let z = 0; z <= size; z++) {
			if (hmap[w][z] < 0) hmap[w][z] = 0;
		}
	}
}

function draw(w) {
	const r = 200 / size;
	let k = 0;
	pen = false;
	for (let z = 0; z <= size; z++) {
		let xe = r * z;
		let ye = r * 0.77 * w + hmap[z][w] * 1;
		if (ye <= line[z] || (hmap[z][w] === 0 && w / water !== ((w / water) | 0))) {
			pen = false;
		} else {
			if (pen === false) svg.moveTo(xe, 200 - ye);
			else svg.lineTo(xe, 200 - ye);
			pen = true;
			line[z] = ye;
		}
	}
	return w < size;
}