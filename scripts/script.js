const canvas = document.getElementById( "canvas" );
const gl = canvas.getContext( "webgl2", { alpha: true, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false, depth: false, stencil: false } );
const globals = { width: 1200, height: 800, amount: 1E6, stopped: false };

var EN1 = new GUIEncoder( "encoder-so", 0, 30, 5 );
var EN2 = new GUIEncoder( "encoder-sa", 0, 1.5, 1.0 );
var EN3 = new GUIEncoder( "encoder-ra", 0, 1, 0.8 );
var EN4 = new GUIEncoder( "encoder-ms", 0, 2, 1 );
var EN5 = new GUIEncoder( "encoder-df", 0.8, 1, 0.9 );
var EN6 = new GUIEncoder( "encoder-th", 0.1, 0.3, 0.2 );

var stats = new FPSMeter();

////////////////////////

function loadShader ( VSHpath, FSHpath, varyings ) {

    let VSHxhr = new XMLHttpRequest();
    VSHxhr.open( "GET", VSHpath, false );

    let FSHxhr = new XMLHttpRequest();
    FSHxhr.open( "GET", FSHpath, false );

    VSHxhr.send(); FSHxhr.send();

    ////////////////////////

    var VSH = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( VSH, VSHxhr.response );
    gl.compileShader( VSH );

    if ( gl.getShaderParameter( VSH, gl.COMPILE_STATUS ) == false ) console.log( gl.getShaderInfoLog( VSH ) );

    ////////////////////////

    var FSH = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( FSH, FSHxhr.response );
    gl.compileShader( FSH );

    if ( gl.getShaderParameter( FSH, gl.COMPILE_STATUS ) == false ) console.log( gl.getShaderInfoLog( FSH ) );

    ////////////////////////

    var SHP = gl.createProgram();
    gl.attachShader( SHP, VSH );
    gl.attachShader( SHP, FSH );

    if ( varyings ) gl.transformFeedbackVaryings( SHP, varyings, gl.INTERLEAVED_ATTRIBS );

    gl.linkProgram( SHP );

    if ( gl.getProgramParameter( SHP, gl.LINK_STATUS ) == false ) console.log( gl.getProgramInfoLog( SHP ) );

    ////////////////////////

    return SHP;

}

////////////////////////

var SHP1 = loadShader( "shaders/VERT1.c", "shaders/FRAG1.c", [ "agent" ] );
var U1x1 = gl.getUniformLocation( SHP1, "resolution" );
var U1x2 = gl.getUniformLocation( SHP1, "seed" );

var SHP2 = loadShader( "shaders/VERT2.c", "shaders/FRAG1.c", [ "agent" ] );
var U2x1 = gl.getUniformLocation( SHP2, "resolution" );
var U2x2 = gl.getUniformLocation( SHP2, "SO" );
var U2x3 = gl.getUniformLocation( SHP2, "SA" );
var U2x4 = gl.getUniformLocation( SHP2, "RA" );
var U2x5 = gl.getUniformLocation( SHP2, "MS" );

var SHP3 = loadShader( "shaders/VERT3.c", "shaders/FRAG2.c" );
var U3x1 = gl.getUniformLocation( SHP3, "resolution" );
var U3x2 = gl.getUniformLocation( SHP3, "DF" );

var SHP4 = loadShader( "shaders/VERT3.c", "shaders/FRAG3.c" );
var U4x1 = gl.getUniformLocation( SHP4, "resolution" );
var U4x2 = gl.getUniformLocation( SHP4, "TH" );

////////////////////////

var VBO1 = gl.createBuffer();
var VBO2 = gl.createBuffer();

var VAO1 = gl.createVertexArray();
gl.bindVertexArray( VAO1 );
gl.enableVertexAttribArray( 0 );
gl.bindBuffer( gl.ARRAY_BUFFER, VBO1 );
gl.vertexAttribPointer( 0, 3, gl.FLOAT, false, 0, 0 );
gl.bindBuffer( gl.ARRAY_BUFFER, null );
gl.bindVertexArray( null );

var VAO2 = gl.createVertexArray();
gl.bindVertexArray( VAO2 );
gl.enableVertexAttribArray( 0 );
gl.bindBuffer( gl.ARRAY_BUFFER, VBO2 );
gl.vertexAttribPointer( 0, 3, gl.FLOAT, false, 0, 0 );
gl.bindBuffer( gl.ARRAY_BUFFER, null );
gl.bindVertexArray( null );

var RS1 = [
    { vao: VAO1, vbo: VBO2 },
    { vao: VAO2, vbo: VBO1 },
];

////////////////////////

var TEX1 = gl.createTexture();
var TEX2 = gl.createTexture();

gl.bindTexture( gl.TEXTURE_2D, TEX1 );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
gl.bindTexture( gl.TEXTURE_2D, TEX2 );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
gl.bindTexture( gl.TEXTURE_2D, null );

////////////////////////

var FBO1 = gl.createFramebuffer();
var FBO2 = gl.createFramebuffer();

gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );
gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, TEX1, 0 );
gl.bindFramebuffer( gl.FRAMEBUFFER, FBO2 );
gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, TEX2, 0 );
gl.bindFramebuffer( gl.FRAMEBUFFER, null );

gl.clearColor( 0.5, 0, 0, 0 );

////////////////////////

function resizeBuffers () {

    gl.bindBuffer( gl.ARRAY_BUFFER, VBO1 );
    gl.bufferData( gl.ARRAY_BUFFER, globals.amount * 12, gl.DYNAMIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, VBO2 );
    gl.bufferData( gl.ARRAY_BUFFER, globals.amount * 12, gl.DYNAMIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

}

function resizeTextures () {

    canvas.width = globals.width; canvas.height = globals.height;

    gl.bindTexture( gl.TEXTURE_2D, TEX1 );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.R8, globals.width, globals.height, 0, gl.RED, gl.UNSIGNED_BYTE, null );
    gl.bindTexture( gl.TEXTURE_2D, TEX2 );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.R8, globals.width, globals.height, 0, gl.RED, gl.UNSIGNED_BYTE, null );
    gl.bindTexture( gl.TEXTURE_2D, null );

    gl.viewport( 0, 0, globals.width, globals.height );

}

////////////////////////

function changeMapSise () {

    globals.width = parseInt( document.getElementById("map-width").value );
    globals.height = parseInt( document.getElementById("map-height").value );

    resizeTextures(); respawn();

}

function changePopulationSize () {

    globals.amount = parseInt( document.getElementById("amount").value );

    resizeBuffers(); respawn();

}

////////////////////////

function pause () {
    globals.stopped = true;
}

function resume () {
    globals.stopped = false;
}

function stretch () {

    document.getElementById("map-width").value = window.innerWidth;
    document.getElementById("map-height").value = window.innerHeight;

    changeMapSise();

}

////////////////////////

function respawn () {

    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO2 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

    ////////////////////////

    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );

    gl.useProgram( SHP1 );
    gl.uniform2f( U1x1, globals.width, globals.height );
    gl.uniform1ui( U1x2, Math.random() * 4294967295 );

    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, RS1[1].vbo );

    gl.beginTransformFeedback( gl.POINTS );
    gl.drawArrays( gl.POINTS, 0, globals.amount );
    gl.endTransformFeedback();

    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, null );

    ////////////////////////

    diffuse(); copy(); display();

}

////////////////////////

function diffuse () {

    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO2 );

    gl.useProgram( SHP3 );
    gl.uniform2f( U3x1, globals.width, globals.height );
    gl.uniform1f( U3x2, EN5.getValue() );

    gl.bindTexture( gl.TEXTURE_2D, TEX1 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

}

function copy () {

    gl.bindFramebuffer( gl.READ_FRAMEBUFFER, FBO2 );
    gl.bindFramebuffer( gl.DRAW_FRAMEBUFFER, FBO1 );

    gl.blitFramebuffer(	0, 0, globals.width, globals.height, 0, 0, globals.width, globals.height, gl.COLOR_BUFFER_BIT, gl.NEAREST );

    gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null );
    gl.bindFramebuffer( gl.DRAW_FRAMEBUFFER, null );

}

function move () {

    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );

    gl.useProgram( SHP2 );
    gl.uniform2f( U2x1, globals.width, globals.height );
    gl.uniform1f( U2x2, EN1.getValue() );
    gl.uniform1f( U2x3, EN2.getValue() );
    gl.uniform1f( U2x4, EN3.getValue() );
    gl.uniform1f( U2x5, EN4.getValue() );

    gl.bindTexture( gl.TEXTURE_2D, TEX2 );

    gl.bindVertexArray( RS1[0].vao );
    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, RS1[0].vbo );

    gl.beginTransformFeedback( gl.POINTS );
    gl.drawArrays( gl.POINTS, 0, globals.amount );
    gl.endTransformFeedback();

    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, null );
    gl.bindVertexArray( null );

}

////////////////////////

function display () {

    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

    gl.useProgram( SHP4 );
    gl.uniform2f( U4x1, globals.width, globals.height );
    gl.uniform1f( U4x2, EN6.getValue() );

    gl.bindTexture( gl.TEXTURE_2D, TEX2 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

}

////////////////////////

function update () {

    stats.update();

    if ( globals.stopped == false ) {

        move(); diffuse(); copy();

        display(); RS1.reverse();

    }

    requestAnimationFrame( update );

}

////////////////////////

resizeBuffers();
resizeTextures();
respawn();

document.getElementById("cover").style.opacity = 0;

requestAnimationFrame( update );
