let limit;
let count;
let space;
let min;
let anchorHue;
let hueRange;
let smoothness;
let mappingDirection;

function setup() {
	createCanvas(innerWidth, innerHeight, WEBGL);
	noLoop();
	noStroke();
	angleMode(DEGREES);
	reset();
	colorMode(HSB, 360, 100, 100);
}

function reset() {
	min = innerWidth < innerHeight ? innerWidth : innerHeight;
	limit = min / random(1.3, 2);
	count = random(100, 150); // resolution
	space = innerWidth / count;
	hueRange = random(160, 300);
	anchorHue = random(360);
	smoothness = random(10, 15);
	mappingDirection = random([true, false]);
}

const getNoise = (i, j) => {
	const value = noise(i / smoothness, j / smoothness);
	return map(value, 0, 1, -limit / 3, limit);
};

function mountainMaker() {
	for (let i = 0; i < count; i += 1) {
		for (let j = 0; j < count; j += 1) {
			let from, to;
			if (mappingDirection) {
				from = -limit / 3;
				to = limit;
			} else {
				from = limit;
				to = -limit / 3;
			}
			const hue = map(
				getNoise(i, j),
				from,
				to,
				anchorHue - hueRange,
				anchorHue + hueRange
			);

			fill(hue, 100, 100);
			beginShape();
			vertex((i + 1) * space, (j + 1) * space, getNoise(i + 1, j + 1));
			vertex((i + 1) * space, (j - 1) * space, getNoise(i + 1, j - 1));
			vertex((i - 1) * space, (j - 1) * space, getNoise(i - 1, j - 1));
			vertex((i - 1) * space, (j + 1) * space, getNoise(i - 1, j + 1));
			endShape();
		}
	}
}

function draw() {
	background(0);
	push();
	translate(-innerWidth / 2, min / 10);
	rotateX(random(50, 65));
	mountainMaker();

	pop();
}

function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
	reset();
}

document.querySelector(".download").addEventListener("click", function () {
	this.download = "crystal-mountain.png";
	this.href = document.querySelector("canvas").toDataURL();
});

document.querySelector(".instruction").addEventListener("click", (e) => {
	if (e.target.classList.contains("generating")) return;
	const original = e.target.textContent;
	e.target.classList.add("generating");
	e.target.textContent = "Generating ...";
	setTimeout(() => {
		reset();
		clear();
		draw();
		e.target.textContent = original;
		e.target.classList.remove("generating");
	}, 0);
});