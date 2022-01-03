#version 300 es

precision highp float;

flat in float segment;

out vec4 color;

void main () {

    color = vec4( segment, 0, 0, 1 );

}
