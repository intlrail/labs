"use strict";
{
	const Noise = class {
		// http://mrl.nyu.edu/~perlin/noise/
		constructor(setup) {
			this.p = new Uint8Array(512);
			this.octaves = setup.octaves || 1;
			this.init();
		}
		init() {
			const p = new Uint8Array(256);
			for (let i = 0; i < 256; i++) p[i] = i;
			for (let i = 255; i > 0; i--) {
				const n = Math.floor((i + 1) * Math.random());
				const q = p[i];
				p[i] = p[n];
				p[n] = q;
			}
			for (let i = 0; i < 512; i++) {
				this.p[i] = p[i & 255];
			}
		}
		lerp(t, a, b) {
			return a + t * (b - a);
		}
		grad2d(i, x, y) {
			const v = (i & 1) === 0 ? x : y;
			return (i & 2) === 0 ? -v : v;
		}
		noise2d(x2d, y2d) {
			const X = Math.floor(x2d) & 255;
			const Y = Math.floor(y2d) & 255;
			const x = x2d - Math.floor(x2d);
			const y = y2d - Math.floor(y2d);
			const fx = (3 - 2 * x) * x * x;
			const fy = (3 - 2 * y) * y * y;
			const p0 = this.p[X] + Y;
			const p1 = this.p[X + 1] + Y;
			return this.lerp(
				fy,
				this.lerp(
					fx,
					this.grad2d(this.p[p0], x, y),
					this.grad2d(this.p[p1], x - 1, y)
				),
				this.lerp(
					fx,
					this.grad2d(this.p[p0 + 1], x, y - 1),
					this.grad2d(this.p[p1 + 1], x - 1, y - 1)
				)
			);
		}
		noise(x, y) {
			let e = 1,
				k = 1,
				s = 0;
			for (let i = 0; i < this.octaves; ++i) {
				e *= 0.5;
				s += e * (1 + this.noise2d(k * x, k * y)) / 2;
				k *= 8;
			}
			return s;
		}
	}
	const perlin = new Noise({ octaves: 1.618 });
	///////// canvas /////////////
	const canvas = {
		init() {
			this.elem = document.querySelector("canvas");
			const gl = this.elem.getContext("webgl", { alpha: true });
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(vertexShader,	`
				uniform mat4 camProj, camView;
				attribute vec3 aPosition, aNormal;
				varying vec3 vColor;
				const vec3 lightDir = vec3(0, -1, -2);
				const vec3 lightColor = vec3(0.9, 0.9, 0.9);
				void main(void) {
					vec3 normal = mat3(camView) * aNormal;
					vec4 pos = camView * vec4(aPosition, 1.0);
					vColor = (aPosition.y > 1.5 && aNormal.y == 1.0) ? vec3(1) : (lightColor * dot(-0.15 * pos.y * normal, lightDir) + 0.55 * aPosition.y - 0.2);				
					vColor = mix(vColor, vec3(0.5 * pos.z * pos.z), 0.005);
					gl_Position = camProj * pos;
				}
			`
			);
			gl.shaderSource(fragmentShader,	`
				precision highp float;
				varying vec3 vColor;
				void main(void) {
					gl_FragColor = vec4(vColor, 1.0);
				}
			`
			);
			gl.compileShader(vertexShader);
			gl.compileShader(fragmentShader);
			this.program = gl.createProgram();
			gl.attachShader(this.program, vertexShader);
			gl.attachShader(this.program, fragmentShader);
			gl.linkProgram(this.program);
			gl.useProgram(this.program);
			return gl;
		},
		resize() {
			this.width = this.elem.width = this.elem.offsetWidth;
			this.height = this.elem.height = this.elem.offsetHeight;
			camera.proj.perspective(60, this.width / this.height).load();
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		}
	};
	//////// uniforms /////////
	const Mat4 = class {
		constructor(program, uName) {
			this.u = gl.getUniformLocation(program, uName);
			this.data = new Float32Array([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]);
		}
		identity() {
			const d = this.data;
			d[0] = 1;
			d[1] = 0;
			d[2] = 0;
			d[3] = 0;
			d[4] = 0;
			d[5] = 1;
			d[6] = 0;
			d[7] = 0;
			d[8] = 0;
			d[9] = 0;
			d[10] = 1;
			d[11] = 0;
			d[12] = 0;
			d[13] = 0;
			d[14] = 0;
			d[15] = 1;
			return this;
		}
		translate(x, y, z) {
			const d = this.data;
			d[12] = d[0] * x + d[4] * y + d[8] * z + d[12];
			d[13] = d[1] * x + d[5] * y + d[9] * z + d[13];
			d[14] = d[2] * x + d[6] * y + d[10] * z + d[14];
			d[15] = d[3] * x + d[7] * y + d[11] * z + d[15];
			return this;
		}
		rotateX(angle) {
			const d = this.data;
			const s = Math.sin(angle);
			const c = Math.cos(angle);
			const a10 = d[4];
			const a11 = d[5];
			const a12 = d[6];
			const a13 = d[7];
			const a20 = d[8];
			const a21 = d[9];
			const a22 = d[10];
			const a23 = d[11];
			d[4] = a10 * c + a20 * s;
			d[5] = a11 * c + a21 * s;
			d[6] = a12 * c + a22 * s;
			d[7] = a13 * c + a23 * s;
			d[8] = a10 * -s + a20 * c;
			d[9] = a11 * -s + a21 * c;
			d[10] = a12 * -s + a22 * c;
			d[11] = a13 * -s + a23 * c;
			return this;
		}
		rotateY(angle) {
			const d = this.data;
			const s = Math.sin(angle);
			const c = Math.cos(angle);
			const a00 = d[0];
			const a01 = d[1];
			const a02 = d[2];
			const a03 = d[3];
			const a20 = d[8];
			const a21 = d[9];
			const a22 = d[10];
			const a23 = d[11];
			d[0] = a00 * c + a20 * -s;
			d[1] = a01 * c + a21 * -s;
			d[2] = a02 * c + a22 * -s;
			d[3] = a03 * c + a23 * -s;
			d[8] = a00 * s + a20 * c;
			d[9] = a01 * s + a21 * c;
			d[10] = a02 * s + a22 * c;
			d[11] = a03 * s + a23 * c;
			return this;
		}
		perspective(fov, aspect) {
			const d = this.data;
			const near = 0.001;
			const far = 10000;
			const top = near * Math.tan(fov * Math.PI / 360);
			const right = top * aspect;
			const left = -right;
			const bottom = -top;
			d[0] = 2 * near / (right - left);
			d[1] = 0;
			d[2] = 0;
			d[3] = 0;
			d[4] = 0;
			d[5] = 2 * near / (top - bottom);
			d[6] = 0;
			d[7] = 0;
			d[8] = (right + left) / (right - left);
			d[9] = (top + bottom) / (top - bottom);
			d[10] = -(far + near) / (far - near);
			d[11] = -1;
			d[12] = 0;
			d[13] = 0;
			d[14] = -(2 * far * near) / (far - near);
			d[15] = 0;
			return this;
		}
		load() {
			gl.uniformMatrix4fv(this.u, gl.FALSE, this.data);
			return this;
		}
	};
	///////////// init //////////////
	const gl = canvas.init();
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	const camera = {
		proj: new Mat4(canvas.program, "camProj").load(),
		view: new Mat4(canvas.program, "camView").load()
	};
	canvas.resize();
	window.addEventListener("resize", () => canvas.resize(), false);
	////////// geometry /////////
	const geometry = () => {
		let iV = 0;
		const vertices = new Float32Array(3400000);
		const cubeLeft = (x, y, z, l, h, w) => [x-l,y-h,z-w,1,0,0,x-l,y-h,z+w,1,0,0,x-l,y+h,z+w,1,0,0,x-l,y-h,z-w,1,0,0,x-l,y+h,z+w,1,0,0,x-l,y+h,z-w,1,0,0];
		const cubeRight = (x, y, z, l, h, w) => [x+l,y-h,z-w,-1,0,0,x+l,y+h,z-w,-1,0,0,x+l,y+h,z+w,-1,0,0,x+l,y-h,z-w,-1,0,0,x+l,y+h,z+w,-1,0,0,x+l,y-h,z+w,-1,0,0];
		const cubeBack = (x, y, z, l, h, w) => [x-l,y-h,z-w,0,0,1,x-l,y+h,z-w,0,0,1,x+l,y+h,z-w,0,0,1,x-l,y-h,z-w,0,0,1,x+l,y+h,z-w,0,0,1,x+l,y-h,z-w,0,0,1];
		const cubeFront = (x, y, z, l, h, w) => [x-l,y-h,z+w,0,0,-1,x+l,y-h,z+w,0,0,-1,x+l,y+h,z+w,0,0,-1,x-l,y-h,z+w,0,0,-1,x+l,y+h,z+w,0,0,-1,x-l,y+h,z+w,0,0,-1];
		const cubeTop = (x, y, z, l, h, w) => [x-l,y+h,z-w,0,1,0,x-l,y+h,z+w,0,1,0,x+l,y+h,z+w,0,1,0,x-l,y+h,z-w,0,1,0,x+l,y+h,z+w,0,1,0,x+l,y+h,z-w,0,1,0];
		const attribute = (program, name, data, size, stride, offset) => {
			if (data !== null) {
				const buffer = gl.createBuffer();
			  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
			}
			const index = gl.getAttribLocation(program, name);
			gl.enableVertexAttribArray(index);
			gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride, offset);

		};
		const concat = (a1, a2, index) => {
			for (let i = 0, l = a2.length; i < l; i++) {
				a1[index++] = a2[i];
			}
			return index;
		};
		const hmap = new Float32Array((200 * 200) * 100);
		for (let x = -100; x <= 100; x++) {
			for (let z = -100; z <= 100; z++) {
				if (Math.sqrt(x * x + z * z) < 99) {
					const y = 1 + (Math.floor(1024 * perlin.noise(x * 0.05, z * 0.05)) & (32 + 64 + 128));
					hmap[(z + 100) * 200 + (x + 100)] = y;
				}
			}
		}
		let cy = 0, cz = 0, cw = 0;
		for (let x = -100; x <= 100; x++) {
			for (let z = -100; z <= 100; z++) {
				const y = hmap[(z + 100) * 200 + (x + 100)];
				if (y !== 0) {
					const yl = hmap[(z + 100) * 200 + (x + 99)];
					const yr = hmap[(z + 100) * 200 + (x + 101)];
					const yb = hmap[(z + 99) * 200 + (x + 100)];
					const yf = hmap[(z + 101) * 200 + (x + 100)];
					if (y > yl) iV = concat(vertices, cubeLeft(x * 0.1, y * 0.004, z * 0.1, 0.05, y * 0.004, 0.05), iV);
					if (y > yr) iV = concat(vertices, cubeRight(x * 0.1, y * 0.004, z * 0.1, 0.05, y * 0.004, 0.05), iV);
					if (y > yb) iV = concat(vertices, cubeBack(x * 0.1, y * 0.004, z * 0.1, 0.05, y * 0.004, 0.05), iV);
					if (y > yf) iV = concat(vertices, cubeFront(x * 0.1, y * 0.004, z * 0.1, 0.05, y * 0.004, 0.05), iV);
					if (y !== yb) {
						if (cy !== 0) iV = concat(vertices, cubeTop(x * 0.1, cy * 0.004, cz, 0.05, cy * 0.004, cw), iV);
						cy = y;
						cz = z * 0.1;
						cw = 0.05;
					} else {
						cz += 0.05;
						cw += 0.05;
					}
				}
			}
			if (cy !== 0) iV = concat(vertices, cubeTop(x * 0.1, cy * 0.004, cz, 0.05, cy * 0.004, cw), iV);
			cy = 0;
		}
		attribute(canvas.program, "aPosition", vertices, 3, 24, 0);
		attribute(canvas.program, "aNormal", null, 3, 24, 12);
		return iV / 6;
	}
	let numElements = geometry();
	///////// main loop /////////
	let ry = 0, time = 0, dt = 0.0009;
	const run = (newTime) => {
		requestAnimationFrame(run);
		// delta time
		let d = 0.000075 * (newTime - time);
		if (d > 0.1) d = 0.1;
		dt += (d - dt) * 0.01;
		time = newTime;
		// clear screen
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		// move camera
		camera.view
			.identity()
			.rotateX(0.5)
			.translate(0, -3, -7)
			//.rotateY(ry -= dt)
			.load();
		gl.drawArrays(gl.TRIANGLES, 0, numElements);
	};
	// start
	requestAnimationFrame(run);
	["click", "touchdown"].forEach(event => {
		document.addEventListener(event, () => {
			perlin.init();
			numElements = geometry();
		}, false);
	});
}