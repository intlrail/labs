"use strict";

//////////////////////////////////////////////////////////////////
// Adapted from a CFDG program
// https://www.contextfreeart.org/gallery2/index.html#design/688
// cubies by Guigui, May 7th, 2007
//////////////////////////////////////////////////////////////////
{
	
	const code = {
		setup() {
			this.render({
				startShape: 'START',
				background: '#000',
				transform: {sat: -1, b: 0.1},
				zoom: 1,
				maxShapesPerFrame: 100
			});
		},
		rules() { 
			return {
				START: s => {
					this.loop(4, s, {}, s => {
						this.CUBIES(s);
					});
				},
				CUBIES: [
					10, s => {
						this.CUBE(s);
						this.CUBIES(s, {x: -1, y: .5774, z: -1, s: .99});
					},
					10, s => {
						this.CUBE(s);
						this.CUBIET(s, {x: -1, y: .5774, z: -1, s: .99});
					},
					10, s => {
						this.CUBE(s);
						this.CUBIES(s, {x: 1, y: .5774, z: -1, s: .99});
					},
					10, s => {
						this.CUBE(s);
						this.CUBIETT(s, {x: 1, y: .5774, z: -1, s: .99});
					},
					10, s => {
						this.CUBE(s);
						this.CUBIES(s, {y: -1, z: -1, s: .99, b: 0.04});
					},
					10, s => {
						this.CUBE(s);
						this.CUBIETTT(s, {y: -1, z: -1, s: .99});
					},
					0.5, s => {}
				],
				/*
				CUBIET: [
					10, s => {
						this.CUBE(s);
						this.CUBIET(s, {x: -1, y: .5774, z: -1, s: .99, b: 0.04});
					},
					0.3, s => {
						this.CUBE(s);
						this.CUBIES(s, {x: -1, y: .5774, z: -1, s: .99});
					}
				],
				CUBIETT: [
					10, s => {
						this.CUBE(s);
						this.CUBIETT(s, {x: 1, y: .5774, z: -1, s: .99, b: 0.04});
					},
					0.3, s => {
						this.CUBE(s);
						this.CUBIES(s, {x: 1, y: .5774, z: -1, s: .99});
					}
				],
				CUBIETTT: [
					10, s => {
						this.CUBE(s);
						this.CUBIETTT(s, {y: -1, z: -1, s: .99});
					},
					0.3, s => {
						this.CUBE(s);
						this.CUBIES(s, {y: -1, z: -1, s: .99});
					}
				],
				CUBE: [
					0.1, s => {	},
					1, s => {
						this.loop(2, s, {s: [-1, 1]}, s => {
							this.SIDE(s, {});
							this.TOP(s, {b: 0.2});
						});
					}
				],
				*/
				SIDE: s => {
					this.FACE(s, {skew: [0, 30]});
				},
				TOP: s => {
					this.FACE(s, {s:[1.413, 0.816], r: 135});
				},
				FACE: s => {
					this.SQUARE(s, {x: .5, y: -.5});
					this.SQU(s, {y: -.5, b: 1});
					this.SQU(s, {x: 1, y: -.5});
					this.SQU(s, {x: .5, r: 90, b: 1});
					this.SQU(s, {x: .5, r: 90, y: -1});
				},
				SQU: [
					1, s => {
						this.SQUARE(s, {s: [.01, 1], b: -1});
					},
					0.3, s => {
						this.SQU(s, {s: [1, 1.5]});
					}
				]
			}
		}
	};
	// import cfdg library
	cfdg.apply(code);
	// run code
	code.setup();
	// Click canvas to generate a new image
	["click", "touchdown"].forEach(event => {
		document.addEventListener(event, e => code.setup(), false);
	});

}