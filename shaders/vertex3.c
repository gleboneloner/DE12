#version 300 es

precision highp float;

layout ( location = 0 ) in vec2 vertex;

void main () {

    gl_Position = vec4( vertex, 0, 1 );

}
