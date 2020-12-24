var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight;


var y = [],
    colWidth = 1,
    maxDev = 150, // max height of a column
    colDist = 5, // maximum difference in distance a point can be from its neighbor
    horDist = 5, // max range between the next set of points...
    cycle = 0,
    colors = {
        r: 0,
        g: 170,
        b: 20
    };

function initCols() {
    for (var i = 0; i < width / colWidth; i++) {
        if (i === 0) {
            y[i] = Math.floor((Math.random() * maxDev) - maxDev/2);
        } else {
            y[i] = y[i - 1] + Math.floor((Math.random() * colDist) - colDist / 2);
            if (y[i] > maxDev) {
                y[i] = maxDev;
            } else if (y[i] < 0) {
                y[i] = 0;
            }
        }
    }
    render();
}

function genCols() {
    for (var i = 1; i < width / colWidth; i++) {
        var prevCol = y[y.length];
        if (i > 0) {
            prevCol = y[i - 1];
        }
        var rowOffset = y[i] + ((Math.random() * horDist) - horDist / 2),
            colOffset = prevCol + ((Math.random() * colDist) - colDist / 2),
            offset = (rowOffset + colOffset) / 2;

        if (offset > maxDev) {
            offset = maxDev;
        } else if (y[i] < 0) {
            offset = 0;
        }

        y[i] = offset;

    }
}

function render() {
    ctx.drawImage(canvas, 0, 0, width, height, 0, -1, width, height);  
 
    for (var i = 0; i < y.length; i++) {
        var color = ~~(y[i]*4);
        ctx.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
        ctx.fillRect(i*colWidth, height,colWidth, -y[i]);
    }
    genCols();

    requestAnimationFrame(render);
}

setTimeout(function () {
    width = canvas.width = document.body.offsetWidth;
    height = canvas.height = document.body.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    initCols();
}, 0);