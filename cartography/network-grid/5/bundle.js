/**
* CF.js interpreter ( based on ContextFree http://www.contextfreeart.org/ )
* Author: gerard Ferrandez https://codepen.io/ge1doot
* Last update: 17 Mar 2016
*/


var CFAjs = { };

( function ( ) {

	"use strict";

	// private variables

	var resX, 
		resY, 
		setup, 
		kScale, 
		rScale, 
		minSize, 
		globalCompositeOperation,
		immediateMode = false,
		rendering = true,
		minX, 
		minY, 
		maxX, 
		maxY, 
		offsetX,
		offsetY, 
		background, 
		renderingIter,
		speed,
		seed, 
		generatedSeed,
		numLayers, 
		gLevel,
		compiledCode   = [ ],
		layers         = [ ], 
		layersContexts = [ ],
		requestID;

	// double queue

	var stack = {
		pushArray: [],
		popArray: [],
		length: 0,
		move: function () {
			while ( this.pushArray.length !== 0 ) {
				this.popArray.push( this.pushArray.pop() );
			}
		},
		push: function ( element ) {
			this.pushArray.push( element );
			this.length++;
		},
		shift: function () {
			if ( this.popArray.length === 0 ) this.move();
			if ( this.popArray.length === 0) return null;
			else {
				this.length--;
				return this.popArray.pop();
			}
		},
		reset: function () {
			this.pushArray.length = 0;
			this.popArray.length = 0;
			this.length = 0;
		}
	};

	// create main canvas

	var canvas = document.createElement( 'canvas' );
	var ftx = canvas.getContext( '2d' );
	document.body.appendChild( canvas );

	// random function ( for testing with a given seed )

	function random ( ) {
		seed = ( seed * 31415821 + 1 ) % 1E8;
		return  seed / 1E8;
	}

	// primitive shapes

	var primitives = {

		SQUARE: function ( ctx ) {

			ctx.fillRect( -1 * 0.5, -1 * 0.5, 1, 1 );

		},

		CIRCLE: function ( ctx ) {

			ctx.beginPath( );
			ctx.arc( 0, 0, 0.5, 0, 2 * Math.PI );
			ctx.fill( );

		},

		TRIANGLE: function ( ctx ) {

			ctx.beginPath();
			ctx.moveTo( -0.5,  0.5 );
			ctx.lineTo(  0.5,  0.5 );
			ctx.lineTo(    0, -0.5 );
			ctx.lineTo(    0, -0.5 );
			ctx.fill();

		},

		TRIANGLEEQ: function ( ctx ) {

  			ctx.beginPath();
  			ctx.moveTo(  0,   -0.57735  );
  			ctx.lineTo(  0.5,  0.288675 );
			ctx.lineTo( -0.5,  0.288675 );
			ctx.lineTo(  0,   -0.57735  );
			ctx.fill();

		}

	};

	// draw a shape

	function draw ( drawCall, composite, a00, a01, a10, a11, a20, a21, sh, ss, sl, sa, zIndex ) {

		if ( !rendering ) {

			autoPan ( a20, a21 );
			return;

		}

		var ctx = layersContexts[ zIndex ];

		ctx.fillStyle = 'hsla( ' +
			( sh | 0 ) + ',' +
			( ss * 100 | 0 ) + '%,' +
			( sl * 100 | 0 ) + '%,' +
			( sa ) +
		' )';

		ctx.globalCompositeOperation = composite;

		ctx.setTransform(
			kScale * a00,
			kScale * a01,
			kScale * a10,
			kScale * a11,
			kScale * a20 + resX * 0.5 + offsetX,
			kScale * a21 + resY * 0.5 + offsetY
		 );

		drawCall ( ctx );

	}

	// create z-index canvas

	function canvasResize ( ) {

		resX = canvas.offsetWidth;
		resY = canvas.offsetHeight;

		ftx.imageSmoothingEnabled = false;

		for ( var i = 0; i < numLayers; i++ ) {
			var backbuffer = document.createElement( 'canvas' );
			backbuffer.width = resX;
			backbuffer.height = resY;
			var context = backbuffer.getContext( '2d' );
			layers[ i ] = backbuffer;
			layersContexts [ i ] = context;
			context.imageSmoothingEnabled = false;
		}

		canvas.width  = resX;
		canvas.height = resY;

	}

	// autopan function

	function autoPan ( a20, a21 ) {

		var x = a20 * kScale,
			y = a21 * kScale, 
			rx = rScale * resX / 2,
			ry = rScale * resY / 2;

		if ( x > maxX ) maxX = x; else if ( x < minX ) minX = x;
		if ( y > maxY ) maxY = y; else if ( y < minY ) minY = y;

		if ( maxX >   rx - offsetX && minX > -rx - offsetX && offsetX >  1 - rx * 0.5 ) offsetX -= 0.1;
		if ( minX < - rx + offsetX && maxX <  rx - offsetX && offsetX < -1 + rx * 0.5 ) offsetX += 0.1;
		if ( maxY >   ry - offsetY && minY > -ry - offsetY && offsetY >  1 - ry * 0.5 ) offsetY -= 0.1;
		if ( minY < - ry + offsetY && maxY <  ry - offsetY && offsetY < -1 + ry * 0.5 ) offsetY += 0.1;

	}

	// execute function values

	function getValue ( value ) {

		if ( !value ) return 0;
		if ( typeof value === "function" ) return value ( );
		else return value;

	}

	// select a random rule

	function selectRandomRule ( rules ) {

		var weight = 0, rule, rnd = random ( ) * rules.totalWeight;
		for( var i = 0; i < rules.length; i++ ) {
			rule = rules[ i ];
			weight += ( rule.weight || 1.0 );
			if ( rnd <= weight ) return rule;
		}

	}

	// execute grammar step

	function step ( s ) {

		var value,
			shape  = compiledCode [ s[ 0 ] ],	
			r00, 
			r01, 
			r02,
			a00    = s[ 1 ], 
			a01    = s[ 2 ], 
			a10    = s[ 3 ], 
			a11    = s[ 4 ], 
			a20    = s[ 5 ], 
			a21    = s[ 6 ], 
			sh     = s[ 7 ], 
			ss     = s[ 8 ], 
			sl     = s[ 9 ], 
			sa     = s[ 10 ],
			th     = s[ 11 ], 
			ts     = s[ 12 ], 
			tl     = s[ 13 ], 
			ta     = s[ 14 ],
			zIndex = s[ 15 ],
			level  = s[ 16 ];

		var iter = shape.iter ? shape.iter : 1;

		for ( var i = 0; i < iter; i++ ) {

			// this is a loop

			if ( shape.loop ) {

				stack.push ( [ 
					shape.loop.id, 
					a00, 
					a01, 
					a10, 
					a11, 
					a20, 
					a21, 
					sh, 
					ss, 
					sl, 
					sa, 
					th, 
					ts, 
					tl, 
					ta, 
					zIndex,
					level
				] );

			}

			if ( shape.shapes ) {

				// shapes in loop

				for ( var j = 0; j < shape.shapes.length; j++ ) {

					stack.push ( [ 
						shape.shapes[ j ].id, 
						a00, 
						a01, 
						a10, 
						a11, 
						a20, 
						a21, 
						sh, 
						ss, 
						sl, 
						sa, 
						th, 
						ts, 
						tl, 
						ta, 
						zIndex,
						level
					] );

				}

			}
		
			// Transformation : in TRSSF order ( translate-rotate-scale-skew-flip )

			if ( shape.x ) {
				var x = getValue( shape.x );
				a20 += x * a00;
				a21 += x * a01;
			}

			if ( shape.y ) {
				var y = getValue( shape.y );
				a20 += y * a10;
				a21 += y * a11;
			}


			if ( shape.translate ) {
				var x = getValue( shape.translate[ 0 ] );
				var y = getValue( shape.translate[ 1 ] );
				a20 += x * a00 + y * a10;
				a21 += x * a01 + y * a11;
			}

			if ( shape.rotate ) {
				var x = getValue( shape.rotate );
				var cos = Math.cos( -2 * Math.PI * x / 360 );
				var sin = Math.sin( -2 * Math.PI * x / 360 );
				r00 = cos * a00 + sin * a10;
				r01 = cos * a01 + sin * a11;
				a10 = cos * a10 - sin * a00;
				a11 = cos * a11 - sin * a01;
				a00 = r00;
				a01 = r01;
			}

			if ( shape.scale ) {
				if ( Array.isArray( shape.scale ) ) {
					var x = getValue( shape.scale[ 0 ] );
					var y = getValue( shape.scale[ 1 ] );
				} else {
					var x = getValue( shape.scale );
					var y = x;
				}
				a00 *= x;
				a01 *= x;
				a10 *= y;
				a11 *= y;
			}

			if ( shape.skew ) {
				var x = Math.tan ( getValue( shape.skew[ 0 ] ) );
				var y = Math.tan ( getValue( shape.skew[ 1 ] ) );
				r00 = a00 + y * a10;
				r01 = a01 + y * a11;
				a10 = x * a00 + a10;
				a11 = x * a01 + a11;
				a00 = r00;
				a01 = r01;
			}

			if ( shape.flip !== undefined ) {
				var v = getValue( shape.flip );
				var x = Math.cos( -2 * Math.PI * v / 360 );
				var y = Math.sin( -2 * Math.PI * v / 360 );
				var n = 1 / ( x*x+y*y );
				var b00 = ( x*x-y*y )/n;
				var b01 = 2*x*y/n;
				var b10 = 2*x*y/n;
				var b11 = ( y*y-x*x )/n;
				r00 = b00 * a00 + b01 * a10;
				r01 = b00 * a01 + b01 * a11;
				a10 = b10 * a00 + b11 * a10;
				a11 = b10 * a01 + b11 * a11;
				a00 = r00;
				a01 = r01;
			}

			// stop if too small
			if ( 
				!shape.drawCall && 
				Math.abs( a01 ) * kScale < minSize && 
				Math.abs( a11 ) * kScale < minSize 
			) return level;

			// transform colors

			if ( shape.hsla ) {

				sh = getValue( shape.hsla[ 0 ] );
				ss = getValue( shape.hsla[ 1 ] );
				sl = getValue( shape.hsla[ 2 ] );
				sa = getValue( shape.hsla[ 3 ] );

			} else {

				if ( shape.setHue         !== undefined ) sh = getValue( shape.setHue );
				if ( shape.setSaturation  !== undefined ) ss = getValue( shape.setSaturation );
				if ( shape.setLight       !== undefined ) sl = getValue( shape.setLight );
				if ( shape.setAlpha       !== undefined ) sa = getValue( shape.setAlpha );

			}

			if ( shape.setHueTarget        !== undefined ) th = getValue( shape.setHueTarget );
			if ( shape.setSaturationTarget !== undefined ) ts = getValue( shape.setSaturationTarget );
			if ( shape.setLightTarget      !== undefined ) tl = getValue( shape.setLightTarget );
			if ( shape.setAlphaTarget      !== undefined ) ta = getValue( shape.setAlphaTarget );

			if ( shape.hue ) {
				value = getValue( shape.hue );
				sh += value;
				if ( th ) {
					if ( value > 0 && sh > th ) sh = th;
					if ( value < 0 && sh < th ) sh = th;
				}
				sh %= 360;
			}

			if ( shape.saturation ) {
				value = getValue( shape.saturation );
				ss += ( value > 0 ) ? value * ( ts - ss ) : value * ss;
			}

			if ( shape.light ) {
				value = getValue( shape.light );
				sl += ( value > 0 ) ? value * ( tl - sl ) : value * sl;
			}

			if ( shape.alpha ) {
				value = getValue( shape.alpha );
				sa += ( value > 0 ) ? value * ( ta - sa ) : value * sa;
			}

			if ( shape.zIndex ) {
				zIndex = shape.zIndex;
			}


			// this is an elemental shape

			if ( shape.shape ) {

				if ( shape.drawCall ) {

					// this is a draw call

					draw ( 
						shape.drawCall, 
						shape.composite, 
						a00, 
						a01, 
						a10, 
						a11, 
						a20, 
						a21, 
						sh, 
						ss, 
						sl, 
						sa, 
						zIndex 
					);

				} else {

					// shape call - push recustive call into stack

					var rule = code [ shape.shape ];
					if ( !rule ) return;

					var bloc = rule.totalWeight > 0 ? selectRandomRule ( rule ) : rule;

					//	this is a bloc loop

					if ( bloc.loop ) {

						stack.push ( [ 
							bloc.loop.id, 
							a00, 
							a01, 
							a10, 
							a11, 
							a20, 
							a21, 
							sh, 
							ss, 
							sl, 
							sa, 
							th, 
							ts, 
							tl, 
							ta, 
							zIndex,
							level
						] );

					}

					if ( bloc.loop && !bloc.shapes && !bloc.shape ) return;

					var shapes = bloc.shapes || [ bloc ];

					// push block of shapes in stack

					for ( var j = 0; j < shapes.length; j++ ) {

						stack.push ( [ 
							shapes [ j ].id, 
							a00, 
							a01, 
							a10, 
							a11, 
							a20, 
							a21, 
							sh, 
							ss, 
							sl, 
							sa, 
							th, 
							ts, 
							tl, 
							ta, 
							zIndex,
							level + 1
						] );

					}

				}
			}
		}

		return level;

	}

	// compositing all z-index layers

	function paint ( ) {

		ftx.fillStyle = background;
		ftx.fillRect( 0, 0, resX, resY );

		for ( var i = 0; i < numLayers; i++ ) {
			ftx.drawImage( layers[ i ], 0, 0 );
		}

	}

	// main animation loop

	function run ( ) {

		do {
			var s = stack.shift( );
			var l = step ( s );
			if ( !immediateMode && l !== gLevel && renderingIter++ > speed ) {
				gLevel = l;
				renderingIter = 0;
				if ( stack.length ) requestID = requestAnimationFrame( run );
				paint ( );
				return;
			}
		} while ( stack.length );

		paint ( );

	}

	// compile functions

	function compile ( c ) {

		for ( var k in c ) {

			if ( k === "shape" ) {
				c.drawCall = primitives [ c [ k ] ] ? primitives [ c [ k ] ] : null;
				if ( !c.composite ) c.composite = globalCompositeOperation;
			}
			if ( typeof c [ k ] === "object" ) {
				c [ k ] = compile ( c [ k ] );
			} else {
				if ( typeof c [ k ] === "string" && c [ k ].charAt( 0 ) === "=" ) {
					var fn = c [ k ].substring( 1 );
					fn = fn.replace("width", canvas.offsetWidth);
					fn = fn.replace("height", canvas.offsetHeight);
					fn = fn.replace("rnd", "CFAjs.random");
					c [ k ] = new Function ( "return " + fn );
				}
			}
			if ( c.setup && k !== "setup" && k !== "startShape" ) {
				if ( !Array.isArray( c[ k ] ) ) c[ k ].totalWeight = -1;
				else {
					var weight = 0;
					for ( var i = 0; i < c[ k ].length; i++ ) {
						if ( !c[ k ][ i ].weight ) c[ k ][ i ].weight = 1;
						weight += c[ k ][ i ].weight;
					}
					c[ k ].totalWeight = weight;
				}
			}
		}

		c.id = compiledCode.length;
		compiledCode.push( c );

		return c;

	}

	// init stack

	function init () {

		//stack.length = 0;
		stack.reset();
		var rule = code [ code.startShape ];
		var bloc = rule.totalWeight > 0 ? selectRandomRule ( rule ) : rule;
		stack.push ( [ bloc.id, 1,0,0,1,0,0,0,0,0,1,0,1,1,1,0,0 ] );

	}

	// everything starts here

	function start ( code ) {

		setup = code.setup || { };
		minX = 100000, minY = 100000, maxX = -100000, maxY = -100000, offsetX = 0, offsetY = 0;
		globalCompositeOperation = setup.globalCompositeOperation ? setup.globalCompositeOperation : 'destination-over';
		if ( !code.compiled ) code = compile ( code );
		code.compiled = true;
		background = setup.background || '#fff';
		minSize = Math.max( 0.25, setup.minimumSize || 0.5 );
		kScale  = setup.globalScale ? getValue ( setup.globalScale ) : 300;
		rScale = 1;
		numLayers = setup.layers ? setup.layers * 1 : 1;
		canvasResize( );
		gLevel = -1;
		speed = setup.speed || 0;
		renderingIter = 0;
		immediateMode = setup.immediateMode || false;
		var inputseed = document.getElementById("seed") || false;
		if ( setup.seed ) {
			seed = setup.seed;
			if ( inputseed ) inputseed.value = seed;
			setup.seed = 0;
		} else {
			if ( inputseed) {
				if ( inputseed.value != generatedSeed ) seed = inputseed.value;
				else inputseed.value = seed;
			}
		}
		if ( !seed ) {
			seed = Math.round( Math.random( ) * 100000 );
			if ( inputseed ) inputseed.value = seed;
		}
		generatedSeed = seed;
		console.log ( 'seed: ' + seed );
		if ( document.getElementById("seed") ) document.getElementById("seed").innerHTML = seed;
		var pan = setup.pan !== undefined ? setup.pan : true;
		if ( !immediateMode && pan ) {
			init();
			var savedseed = seed;
			rendering = false;
			do { step ( stack.shift( ) ); } while ( stack.length );
			seed = savedseed;
			rendering = true;
		}
		if ( immediateMode ) {
			init();
			do { step ( stack.shift( ) ); } while ( stack.length );
			paint ( ) ;
		} else {
			init();
			run( );
		}
	}

	// public render function

	this.random = random;

	this.render = function ( ) {

		if ( requestID ) cancelAnimationFrame( requestID );
		requestAnimationFrame( function ( ) {
			requestID = null;
			start ( code );
		} );

	}

} ).apply( CFAjs );