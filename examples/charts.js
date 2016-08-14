
var container = document.getElementById('container');
function h4(title) {
    var h = document.createElement('h4');
    h.innerHTML = title;
    container.appendChild(h);
    return h;
}
function h3(title) {
    var h = document.createElement('h3');
    h.innerHTML = title;
    container.appendChild(h);
    return h;
}

function p(content) {
    var p = document.createElement('p');
    p.innerHTML = content;
    container.appendChild(p);
    return p;
}

function canvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);
    return canvas;
}

function generateStrip( generator, samples, range, pixelSize) {
    var cvs = canvas(range * pixelSize, samples * pixelSize);

    clear(cvs);

    for( var y = 0; y < samples; y++ ) {
        var val = Math.floor( generator() / Math.pow(2,32) * range );
        var color = 'white';
          // Draw underline
          rect(cvs, 'grey', 0, y * pixelSize, cvs.width, 1);

          // Draw number position
          rect(cvs, color, val * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}

function generateLoop( generator, samples, range, pixelSize) {

    var vals = [];
    for( var y = 0; y < samples; y++ ) {
        vals.push(generator());
    }
    p(vals.join(','));
}

function generate1D( generator, samples, range, pixelSize) {

    var cvs = canvas(samples * pixelSize, range * pixelSize);

    clear(cvs);

    for( var i = 0; i < samples; i++ ) {
        var val = Math.floor( generator() / Math.pow(2,32) * range );
        var height = val * pixelSize;

        rect(cvs, 'white', i * pixelSize, cvs.height - height - 1, pixelSize, height);
    }
}

function generate2D( generator, samples, range, pixelSize) {
    var cvs = canvas(range * pixelSize, range * pixelSize);

    clear(cvs);

    for( var i = 0; i < samples; i++ ) {
        var x = Math.floor( generator() / Math.pow(2,32) * range );
        var y = Math.floor( generator() / Math.pow(2,32) * range );
        rect(cvs, 'white', x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}

function randomWalk( generator, samples, range, pixelSize) {
    var cvs = canvas(range * pixelSize, range * pixelSize);

    clear(cvs);

    var x = Math.floor(range/2);
    var y = Math.floor(range/2);
    for( var i = 0; i < samples; i++ ) {
        x+= generator() / Math.pow(2,32) * pixelSize - pixelSize/2;
        y+= generator() / Math.pow(2,32) * pixelSize - pixelSize/2;

        rect(cvs, 'rgb('+i+','+i+','+i+')', Math.floor(x) * pixelSize, Math.floor(y) * pixelSize, pixelSize, pixelSize);
    }
}

function clear(cvs) {
    var ctx = cvs.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
}

function rect(cvs, color, x, y, w, h) {
    var ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
