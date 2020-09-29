//helpers
function lerp(t, a, b) {
    return a + t * (b - a);
}

function norm(t, a, b) {
    return (t - a) / (b - a);
}

function map(t, a0, b0, a1, b1) {
    return lerp(norm(t, a0, b0), a1, b1);
}
//simplex noise
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */
var simplex =function(a){function b(a,b,c){this.x=a,this.y=b,this.z=c}b.prototype.dot2=function(a,b){return this.x*a+this.y*b},b.prototype.dot3=function(a,b,c){return this.x*a+this.y*b+this.z*c};var c=[new b(1,1,0),new b(-1,1,0),new b(1,-1,0),new b(-1,-1,0),new b(1,0,1),new b(-1,0,1),new b(1,0,-1),new b(-1,0,-1),new b(0,1,1),new b(0,-1,1),new b(0,1,-1),new b(0,-1,-1)],d=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],e=new Array(512),f=new Array(512);a.seed=function(a){a>0&&a<1&&(a*=65536),a=Math.floor(a),a<256&&(a|=a<<8);for(var b=0;b<256;b++){var g;g=1&b?d[b]^255&a:d[b]^a>>8&255,e[b]=e[b+256]=g,f[b]=f[b+256]=c[g%12]}},a.seed(0);var g=.5*(Math.sqrt(3)-1),h=(3-Math.sqrt(3))/6;return a.simplex2=function(a,b){var c,d,i,p,q,j=(a+b)*g,k=Math.floor(a+j),l=Math.floor(b+j),m=(k+l)*h,n=a-k+m,o=b-l+m;n>o?(p=1,q=0):(p=0,q=1);var r=n-p+h,s=o-q+h,t=n-1+2*h,u=o-1+2*h;k&=255,l&=255;var v=f[k+e[l]],w=f[k+p+e[l+q]],x=f[k+1+e[l+1]],y=.5-n*n-o*o;y<0?c=0:(y*=y,c=y*y*v.dot2(n,o));var z=.5-r*r-s*s;z<0?d=0:(z*=z,d=z*z*w.dot2(r,s));var A=.5-t*t-u*u;return A<0?i=0:(A*=A,i=A*A*x.dot2(t,u)),70*(c+d+i)},a}({});


//code
var can = document.createElement("canvas");
document.body.appendChild( can );
var ctx = can.getContext('2d');

var RAD = Math.PI / 180, w, h;
var offset = 0;
var makeSpiral = function( revolutions, radiusIn, radiusOut) {

    var turns = (2 * Math.PI * revolutions);
    var step = RAD;
    var precision = 4;
    var angle, radius, x, y, nx, ny;

    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#fff"
    ctx.fillRect(0,0,w,h);
    ctx.restore();
    ctx.save();
    ctx.translate(w/2,h/2);
    ctx.scale( 2,2 );
    ctx.beginPath();
    for (angle = 0; angle < turns + step; angle += step) {

        //compute the spiral position
        radius = map(angle, 0, turns, radiusIn, radiusOut);
        nx = Math.cos(angle) * radius;
        ny = Math.sin(angle) * radius;

        //compute the noise
        var f0 = 0.02;
        var a0 = 1;
        var n0 = simplex.simplex2(nx * f0, ny * f0) * a0;
        var f1 = 0.007;
        var a1 = 2.5;
        var n1 = simplex.simplex2(nx * f1, offset + ny * f1) * a1;

        //adds the noise to the radius
        radius *= 1 + Math.abs(n0 + n1) * 0.05;

        //recomputes the position on the spiral
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;

        ctx.lineTo(x.toPrecision(precision), y.toPrecision(precision));

    }
    ctx.stroke();

};

function update() {

    requestAnimationFrame(update);

    w = can.width = window.innerWidth;
    h = can.height = window.innerHeight;
    var rin = 0;
    var rout = window.innerHeight / 7;
    var turns = 30;
    makeSpiral( turns, rin, rout);

    //move the noise origin on Y
    offset += .01;
}
update()