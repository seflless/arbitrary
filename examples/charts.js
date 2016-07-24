function h4(title) {
    var h = document.createElement('h4');
    h.innerHTML = title;
    document.body.appendChild(h);
    return h;
}

function p(content) {
    var p = document.createElement('p');
    p.innerHTML = content;
    document.body.appendChild(p);
    return p;
}

function canvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}

function generateStrip(title, generator, samples, range, pixelSize) {
    h4(title);

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

function generateLoop(title, generator, samples, range, pixelSize) {
    h4(title);

    var vals = [];
    for( var y = 0; y < samples; y++ ) {
        vals.push(generator());
    }
    p(vals.join(','));
}

function generate1D(title, generator, samples, range, pixelSize) {
    h4(title);

    var cvs = canvas(samples * pixelSize, range * pixelSize);

    clear(cvs);

    for( var i = 0; i < samples; i++ ) {
        var val = Math.floor( generator() / Math.pow(2,32) * range );
        var height = val * pixelSize;

        rect(cvs, 'white', i * pixelSize, cvs.height - height - 1, pixelSize, height);
    }
}

function generate2D(title, generator, samples, range, pixelSize) {
    h4(title);

    var cvs = canvas(range * pixelSize, range * pixelSize);

    clear(cvs);

    for( var i = 0; i < samples; i++ ) {
        var x = Math.floor( generator() / Math.pow(2,32) * range );
        var y = Math.floor( generator() / Math.pow(2,32) * range );
        rect(cvs, 'white', x * pixelSize, y * pixelSize, pixelSize, pixelSize);
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
