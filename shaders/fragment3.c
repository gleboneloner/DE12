#version 300 es

precision highp float;

uniform vec2 resolution;
uniform sampler2D map;

out vec4 color;

void main () {

    float IX = gl_FragCoord.x;
    float IY = gl_FragCoord.y;

    float E1 = texture( map, vec2( IX - 0.5, IY - 0.5 ) / resolution ).x;
    float E2 = texture( map, vec2( IX - 0.5, IY + 0.5 ) / resolution ).x;
    float E3 = texture( map, vec2( IX + 0.5, IY - 0.5 ) / resolution ).x;
    float E4 = texture( map, vec2( IX + 0.5, IY + 0.5 ) / resolution ).x;

    float value = (E1+E2+E3+E4)/4.0;

    //////////////////////////////////////////

    float H1 = clamp( (value-0.25)/fwidth(value-0.25)+0.5, 0.0, 1.0 );
    float H2 = clamp( (value-0.75)/fwidth(value-0.75)+0.5, 0.0, 1.0 );

    color = (1.0-H1)*vec4(0.647,0.219,0.325,1) + H2*vec4(0.388,0.600,0.796,1);

}









//
