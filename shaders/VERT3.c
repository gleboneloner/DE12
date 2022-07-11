#version 300 es

precision highp float;

const mat4x2 quad = mat4x2( -1, -1, -1, +1, +1, -1, +1, +1 );

void main () {

    gl_Position = vec4( quad[ gl_VertexID ], 0, 1 );

}
