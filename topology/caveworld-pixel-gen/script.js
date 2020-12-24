const simplex = new SimplexNoise();

// settings
let ores = [
	{ rarity: 0.3, id: 0.75 },
	{ rarity: 0.2, id: 0.5 },
	{ rarity: 0.1, id: 0.25 },
]

let speed = 5;

// temp
let xoffset = 0;
let yoffset = 0;
let xdirection = 0; // -1 left, 1 right
let ydirection = 0; // -1 up, 1 down

// dimensions
const scale = 20;
const width = grid(document.body.clientWidth, scale);
const height = grid(document.body.clientHeight, scale);

// initialize display
let c = document.createElement("canvas");
document.body.appendChild(c);
c.width = width;
c.height = height;

let ctx = c.getContext("2d");
ctx.lineWidth = 2;
ctx.font = "1em Arial";

// "controls"
xoffset = width * 5;
yoffset = height * 5;

document.addEventListener("keydown", (e) => {
	switch (e.code) {
		case "KeyW": ydirection = -1; break;
		case "KeyA": xdirection = -1; break;
		case "KeyS": ydirection = 1; break;
		case "KeyD": xdirection = 1; break;
	}
});

// generate terrain
let terrain = generateCave((width / scale) * 10, (height / scale) * 10);

document.addEventListener("keyup", (e) => {
	switch (e.code) {
		case "KeyW": case "KeyS": ydirection = 0; break;
		case "KeyA": case "KeyD": xdirection = 0; break;
	}
});

(function render() {
	window.requestAnimationFrame(render);
	
	xoffset += xdirection * speed;
	yoffset += ydirection * speed;
	
	ctx.fillStyle = "#161621";
	ctx.fillRect(0, 0, width, height);
	
	for (let i = grid(yoffset, scale) / scale; i < height / scale + grid(yoffset, scale) / scale + scale; i++) {
		if (terrain[i]) for (let j = grid(xoffset, scale) / scale; j < width / scale + grid(xoffset, scale) / scale + scale; j++) {
			if (terrain[i][j]) {
				let point = terrain[i][j];

				if (point > 0) {
					let x = grid(j * scale, scale) - xoffset;
					let y = grid(i * scale, scale) - yoffset;

					ctx.fillStyle = `rgba(250, 250, 250, ${point})`;
					ctx.fillRect(x, y, scale, scale);
				}
			}
		}
	}
})();

function generateCave(width, height) {
	let cave = [];
	
	ores.forEach((ore, i) => {
		ores[i].offset = Math.random() * 1024;
	});
	
	for (let i = 0; i < height; i++) {
		cave[i] = [];
		
		for (let j = 0; j < width; j++) {
			let point = (simplex.noise2D(j / 25, i / 25) + 1) / 2;
			
			if (point < 0.5) {
				cave[i][j] = 1;
				
				ores.forEach((ore) => {
					let opoint = (simplex.noise3D(j / 25, i / 25, ore.offset) + 1) / 2;
					
					if (opoint < ore.rarity) {
						cave[i][j] = ore.id;
					}
				});
			} else {
				cave[i][j] = 0;
			}
		}
	}
	
	return cave;
}

function grid(x, size) {
    return size * Math.floor(x / size);
}