#version 300 es

precision highp float;

uniform sampler2D map;
uniform vec2 resolution;
uniform float DF;

out vec4 color;

void main () {

    float IX = gl_FragCoord.x;
    float IY = gl_FragCoord.y;

    float E1 = texture( map, vec2( IX - 0.5, IY - 0.5 ) / resolution ).x;
    float E2 = texture( map, vec2( IX - 0.5, IY + 0.5 ) / resolution ).x;
    float E3 = texture( map, vec2( IX + 0.5, IY - 0.5 ) / resolution ).x;
    float E4 = texture( map, vec2( IX + 0.5, IY + 0.5 ) / resolution ).x;

    float H1 = (E1+E2+E3+E4)/4.0;

    color.x = (H1-0.5)*DF+0.5;

}
