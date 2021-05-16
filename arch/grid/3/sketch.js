let sketch = function(p) {
    let xdim = 125;
    let ydim = 80;
    let size = 40 ;
    let grid;
    let colors;

    p.setup = function() {
        p.createCanvas(innerWidth, innerHeight);
        p.noLoop();
        p.noFill();
        colors = [p.color(231, 231, 231), p.color(190, 190, 190), p.color(89, 89, 89), p.color(255, 255, 255)];
    };

    p.draw = function() {
        // p.clear();
        // p.translate(10, 200);
        generate_grid(xdim, ydim);
        p.strokeWeight(2);
        p.stroke(180, 180, 180);
        display(9, 9, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(0, 360);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.strokeWeight(2);
        p.stroke(249, 249, 249);
        display(0, 0, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(0, 360);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(360, 0);
        p.scale(1, 1);
        display(0, 0, 9, 9);
        p.translate(10, 10);
        p.scale(1, 1);
    };

    function generate_grid(xd, yd) {
        grid = new Array(yd + 1);
        for (var i = 0; i < grid.length; i++) {
            grid[i] = new Array(xd + 1);
            for (var j = 0; j < grid[i].length; j++) {
                if (i == 0 || j == 0) grid[i][j] = { h: true, v: true };
                else if (i == 1 && j == 1) grid[i][j] = { h: true, v: true };
                else grid[i][j] = generate_cell(grid[i][j - 1].h, grid[i - 1][j].v);
            }
        }
    }

    function generate_cell(west, north) {
        if (!west && !north) return { h: false, v: false };
        if (!west) return { h: flip_coin(), v: true };
        if (!north) return { h: true, v: flip_coin() };
        let h = flip_coin();
        let v = h ? flip_coin() : true;
        return { h: h, v: v };
    }

    function display(x1, y1, sx, sy) {
        // p.rect(size,size, (sx-1) * size, (sy-1) * size);
        for (var i = 1; i < sy; i++) {
            for (var j = 1; j < sx; j++) {
                if (grid[y1 + i][x1 + j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
                if (grid[y1 + i][x1 + j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
            }
        }
    }

    function flip_coin() {
        return p.random() < 0.5 ? false : true;
    }

    function dist(n, m) {
        return p.max(n - m, m - n);
    }
};

new p5(sketch);