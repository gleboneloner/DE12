const canvas = document.getElementById("canvas");
const gl = canvas.getContext( "webgl2", { alpha: false, antialias: false } );
const globals = { width: 1200, height: 800, amount: 1000000, stopped: false, frameCount: 0 };

var EN1 = new GUIEncoder( document.getElementById("encoder-so"), 0, 30, 6 );
var EN2 = new GUIEncoder( document.getElementById("encoder-sa"), 0, 2, 0.8 );
var EN3 = new GUIEncoder( document.getElementById("encoder-ra"), 0, 1, 0.5 );
var EN4 = new GUIEncoder( document.getElementById("encoder-df"), 0.8, 1, 0.9 );
var EN5 = new GUIEncoder( document.getElementById("encoder-ms"), 0, 2, 1 );

var stats = new FPSMeter();

////////////////////////

function loadFile ( filePath ) {

    let xhr = new XMLHttpRequest();
    xhr.open( "GET", filePath, false );
    xhr.send(); return xhr.response;

}

////////////////////////

function loadShader ( vertexShaderPath, fragmentShaderPath, varyings ) {

    var vertexShaderSource = loadFile( vertexShaderPath );

    var vertexShader = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vertexShader, vertexShaderSource );
    gl.compileShader( vertexShader );

    ////////////////////////

    var fragmentShaderSource = loadFile( fragmentShaderPath );

    var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fragmentShader, fragmentShaderSource );
    gl.compileShader( fragmentShader );

    ////////////////////////

    var program = gl.createProgram();
    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );

    if ( varyings != null ) gl.transformFeedbackVaryings( program, varyings, gl.INTERLEAVED_ATTRIBS );

    gl.linkProgram( program );

    ////////////////////////

    return program;

}

////////////////////////

var SP1 = loadShader( "shaders/vertex1.c", "shaders/fragment1.c", [ "result" ] );
var U1x1 = gl.getUniformLocation( SP1, "resolution" );
var U1x2 = gl.getUniformLocation( SP1, "seed" );

var SP2 = loadShader( "shaders/vertex2.c", "shaders/fragment1.c", [ "result" ] );
var U2x1 = gl.getUniformLocation( SP2, "resolution" );
var U2x2 = gl.getUniformLocation( SP2, "SO" );
var U2x3 = gl.getUniformLocation( SP2, "SA" );
var U2x4 = gl.getUniformLocation( SP2, "RA" );
var U2x5 = gl.getUniformLocation( SP2, "MS" );

var SP3 = loadShader( "shaders/vertex3.c", "shaders/fragment2.c", null );
var U3x1 = gl.getUniformLocation( SP3, "resolution" );
var U3x2 = gl.getUniformLocation( SP3, "DF" );

var SP4 = loadShader( "shaders/vertex3.c", "shaders/fragment3.c", null );
var U4x1 = gl.getUniformLocation( SP4, "resolution" );

////////////////////////

var VBO1 = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, VBO1 );
gl.bufferData( gl.ARRAY_BUFFER, globals.amount*12, gl.DYNAMIC_DRAW );
gl.bindBuffer( gl.ARRAY_BUFFER, null );

var VBO2 = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, VBO2 );
gl.bufferData( gl.ARRAY_BUFFER, globals.amount*12, gl.DYNAMIC_DRAW );
gl.bindBuffer( gl.ARRAY_BUFFER, null );

////////////////////////

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

////////////////////////

var vertices = new Float32Array( [ -1, -1, -1, +1, +1, -1, +1, +1 ] );

var VBO3 = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, VBO3 );
gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );
gl.bindBuffer( gl.ARRAY_BUFFER, null );

var VAO3 = gl.createVertexArray();
gl.bindVertexArray( VAO3 );
gl.enableVertexAttribArray( 0 );
gl.bindBuffer( gl.ARRAY_BUFFER, VBO3 );
gl.vertexAttribPointer( 0, 2, gl.FLOAT, false, 0, 0 );
gl.bindBuffer( gl.ARRAY_BUFFER, null );
gl.bindVertexArray( null );

////////////////////////

var TEX1 = gl.createTexture();
gl.bindTexture( gl.TEXTURE_2D, TEX1 );
gl.texImage2D( gl.TEXTURE_2D, 0, gl.R8, globals.width, globals.height, 0, gl.RED, gl.UNSIGNED_BYTE, null );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
gl.bindTexture( gl.TEXTURE_2D, null );

var TEX2 = gl.createTexture();
gl.bindTexture( gl.TEXTURE_2D, TEX2 );
gl.texImage2D( gl.TEXTURE_2D, 0, gl.R8, globals.width, globals.height, 0, gl.RED, gl.UNSIGNED_BYTE, null );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
gl.bindTexture( gl.TEXTURE_2D, null );

////////////////////////

var FBO1 = gl.createFramebuffer();
gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );
gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, TEX1, 0 );
gl.bindFramebuffer( gl.FRAMEBUFFER, null );

var FBO2 = gl.createFramebuffer();
gl.bindFramebuffer( gl.FRAMEBUFFER, FBO2 );
gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, TEX2, 0 );
gl.bindFramebuffer( gl.FRAMEBUFFER, null );

////////////////////////

function randomizeStage () {

    if ( globals.frameCount % 2 == 0 ) {
        gl.bindVertexArray( VAO1 );
        gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, VBO2 );
    } else {
        gl.bindVertexArray( VAO2 );
        gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, VBO1 );
    }

    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );

    gl.useProgram( SP1 );
    gl.uniform2f( U1x1, globals.width, globals.height );
    gl.uniform1f( U1x2, Math.random() );

    gl.beginTransformFeedback( gl.POINTS );
    gl.drawArrays( gl.POINTS, 0, globals.amount );
    gl.endTransformFeedback();

    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, null );
    gl.bindVertexArray( null );

    globals.frameCount += 1;

}

////////////////////////

function clearFrameBuffers () {

    gl.clearColor( 0.5, 0, 0, 0 );
    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO2 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

}

////////////////////////

function changeMapSise () {

    globals.width = parseInt( document.getElementById("map-width").value );
    globals.height = parseInt( document.getElementById("map-height").value );

    canvas.width = globals.width;
    canvas.height = globals.height;

    gl.bindTexture( gl.TEXTURE_2D, TEX1 );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.R8, globals.width, globals.height, 0, gl.RED, gl.UNSIGNED_BYTE, null );
    gl.bindTexture( gl.TEXTURE_2D, TEX2 );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.R8, globals.width, globals.height, 0, gl.RED, gl.UNSIGNED_BYTE, null );
    gl.bindTexture( gl.TEXTURE_2D, null );

    gl.viewport( 0, 0, globals.width, globals.height );

    clearFrameBuffers();
    randomizeStage();
    diffuseStage();
    postprocessStage();
    copyingStage();

}

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

function respawn () {

    clearFrameBuffers();
    randomizeStage();
    diffuseStage();
    postprocessStage();
    copyingStage();

}

function changePopulationSize () {

    globals.amount = parseInt( document.getElementById("amount").value );

    gl.bindBuffer( gl.ARRAY_BUFFER, VBO1 );
    gl.bufferData( gl.ARRAY_BUFFER, globals.amount*12, gl.DYNAMIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, VBO2 );
    gl.bufferData( gl.ARRAY_BUFFER, globals.amount*12, gl.DYNAMIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    clearFrameBuffers();
    randomizeStage();
    diffuseStage();
    postprocessStage();
    copyingStage();

}

function toggleFullscreen () {
    if ( document.fullscreenElement == null ) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

////////////////////////

gl.viewport( 0, 0, globals.width, globals.height );

clearFrameBuffers();
randomizeStage();
diffuseStage();
postprocessStage();
copyingStage();

////////////////////////

setTimeout( function () {
    document.getElementById("cover").style.opacity = 0;
    requestAnimationFrame(update);
}, 200 );

////////////////////////

function moveStage () {

    if ( globals.frameCount % 2 == 0 ) {
        gl.bindVertexArray( VAO1 );
        gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, VBO2 );
    } else {
        gl.bindVertexArray( VAO2 );
        gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, VBO1 );
    }

    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO1 );

    gl.useProgram( SP2 );
    gl.uniform2f( U2x1, globals.width, globals.height );
    gl.uniform1f( U2x2, EN1.getValue() );
    gl.uniform1f( U2x3, EN2.getValue() );
    gl.uniform1f( U2x4, EN3.getValue() );
    gl.uniform1f( U2x5, EN5.getValue() );

    gl.bindTexture( gl.TEXTURE_2D, TEX2 );

    gl.beginTransformFeedback( gl.POINTS );
    gl.drawArrays( gl.POINTS, 0, globals.amount );
    gl.endTransformFeedback();

    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, null );
    gl.bindVertexArray( null );

}

////////////////////////

function diffuseStage () {

    gl.bindFramebuffer( gl.FRAMEBUFFER, FBO2 );

    gl.useProgram( SP3 );
    gl.uniform2f( U3x1, globals.width, globals.height );
    gl.uniform1f( U3x2, EN4.getValue() );

    gl.bindTexture( gl.TEXTURE_2D, TEX1 );

    gl.bindVertexArray( VAO3 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    gl.bindVertexArray( null );

}

////////////////////////

function postprocessStage () {

    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

    gl.useProgram( SP4 );
    gl.uniform2f( U4x1, globals.width, globals.height );

    gl.bindTexture( gl.TEXTURE_2D, TEX2 );

    gl.bindVertexArray( VAO3 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    gl.bindVertexArray( null );

}

////////////////////////

function copyingStage () {

    gl.bindFramebuffer( gl.READ_FRAMEBUFFER, FBO2 );
    gl.bindFramebuffer( gl.DRAW_FRAMEBUFFER, FBO1 );
    gl.blitFramebuffer(	0, 0, globals.width, globals.height, 0, 0, globals.width, globals.height, gl.COLOR_BUFFER_BIT, gl.NEAREST );

}

////////////////////////

function update () {

    stats.update();

    if ( globals.stopped == false ) {

        moveStage();
        diffuseStage();
        postprocessStage();
        copyingStage();

        globals.frameCount += 1;

    }

    requestAnimationFrame( update );

}








//
