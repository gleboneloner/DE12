#version 300 es

precision highp float;

in float domain;

out vec4 color;

void main () {

    color.x = domain;

}
