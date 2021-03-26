class Line {
	constructor(x, y, a, c) {
		this.x1 = x;
		this.y1 = y;
		this.x2 = x;
		this.y2 = y;
		this.angle = a;
		this.cos = Math.cos(a);
		this.sin = Math.sin(a);
		this.draw();
		this.x2 += this.cos;
		this.y2 += this.sin;
		this.color = c * 1;
		this.collisionLines = new Set();
		for (let line of lines) {
			if (this.raytoline(line) && line.raytoline(this)) {
				this.collisionLines.add(line);
			}
		}
	}
	anim() {
		if (Math.random() > 0.96) {
			const a = this.angle + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
			const line = new Line(
				this.x2 + Math.cos(a), 
				this.y2 + Math.sin(a), 
				a, 
				Math.max(10, this.color - 10)
			);
			lines.add(line);
			activeLines.add(line);
		}
		for (let line of this.collisionLines) {
			if (this !== line) {
				const collision = this.intersect(line);
				if (collision) {
					const x = collision.x;
					const y = collision.y;
					if (
						Math.abs(x - this.x2) < Math.abs(x - line.x2) && 
						Math.abs(y - this.y2) < Math.abs(y - line.y2)
					) activeLines.delete(this);
					else activeLines.delete(line);
				}
			}
		}
		this.x2 += this.cos;
		this.y2 += this.sin;
		if (this.x2 < 0 || this.x2 > width || this.y2 < 0 || this.y2 > height) {
			activeLines.delete(this);
		}
	}
	draw() {
		ctx.beginPath();
		ctx.fillStyle = `hsla(42, 0%, ${this.color}%, 1)`;
		ctx.arc(this.x2, this.y2, 0.5 + Math.random() * 0.5, 0, 2 * Math.PI);
		ctx.fill();
	}
	raytoline(line) {
		if (
			(this.y2 - this.y1) / (this.x2 - this.x1) !== (line.y2 - line.y1) / (line.x2 - line.x1)
		) {
			const d = (((this.x2 - this.x1) * (line.y2 - line.y1)) - (this.y2 - this.y1) * (line.x2 - line.x1));
			if (d !== 0) {
				const r = (((this.y1 - line.y1) * (line.x2 - line.x1)) - (this.x1 - line.x1) * (line.y2 - line.y1)) / d;
				if (r >= 0) return true;
			}
		}
		return false;
	}
	intersect(line) {
		const td = this.x1 * this.y2 - this.y1 * this.x2;
		const ld = line.x1 * line.y2 - line.y1 * line.x2;
		const x = (td * (line.x1 - line.x2) - (this.x1 - this.x2) * ld) / ((this.x1 - this.x2) * (line.y1 - line.y2) - (this.y1 - this.y2) * (line.x1 - line.x2));
		if (isNaN(x)) return false;
		const y = (td * (line.y1 - line.y2) - (this.y1 - this.y2) * ld) / ((this.x1 - this.x2) * (line.y1 - line.y2) - (this.y1 - this.y2) * (line.x1 - line.x2));
		if (isNaN(y)) return false;
		if (this.x1 >= this.x2) {
			if (!(this.x2 - 0.01 <= x && x <= this.x1 + 0.01)) return false;
		} else {
			if (!(this.x1 - 0.01 <= x && x <= this.x2 + 0.01)) return false;
		}
		if (this.y1 >= this.y2) {
			if (!(this.y2 - 0.01 <= y && y <= this.y1 + 0.01)) return false;
		} else {
			if (!(this.y1 - 0.01 <= y && y <= this.y2 + 0.01)) return false;
		}
		if (line.x1 >= line.x2) {
			if (!(line.x2 - 0.01 <= x && x <= line.x1 + 0.01)) return false;
		} else {
			if (!(line.x1 - 0.01 <= x && x <= line.x2 + 0.01)) return false;
		}
		if (line.y1 >= line.y2) {
			if (!(line.y2 - 0.01 <= y && y <= line.y1 + 0.01)) return false;
		} else {
			if (!(line.y1 - 0.01 <= y && y <= line.y2 + 0.01)) return false;
		}
		return {
			x: x,
			y: y
		};
	}
}
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const width = canvas.width = canvas.offsetWidth * 1;
const height = canvas.height = canvas.offsetHeight * 1;
const size = Math.max(width, height);
const lines = new Set();
const activeLines = new Set();
function init() {
	ctx.clearRect(0,0, width, height);
	lines.clear();
	activeLines.clear();
	for (let j = 0; j < 3; j++) {
		const sx = width * 0.1 + Math.random() * width * 0.618;
		const sy = height * 0.1 + Math.random() * height * 0.382;
		for (let i = 0; i < 60; i++) {
			const a = Math.random() * 2 * Math.PI;
			const x = sx + (Math.random() - 0.618) * size * 0.05;
			const y = sy + (Math.random() - 0.382) * size * 0.05;
			let line = new Line(x, y, a, 90);
			lines.add(line);
			activeLines.add(line);
			line = new Line(x, y, a + Math.PI, 90);
			lines.add(line);
			activeLines.add(line);
		}
	}
}
function run() {
	requestAnimationFrame(run);
	for (let line of activeLines) {
		line.draw();
		line.anim();
	}
}
canvas.addEventListener('click', init, false);
init();
run();