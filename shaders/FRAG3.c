#version 300 es

precision highp float;

uniform vec2 resolution;
uniform sampler2D map;

uniform float TH;

const vec3 S1 = vec3( 0.647, 0.219, 0.325 );
const vec3 S2 = vec3( 0.388, 0.615, 0.796 );

out vec4 color;

void main () {

    float IX = gl_FragCoord.x;
    float IY = gl_FragCoord.y;

    float E1 = texture( map, vec2( IX - 0.5, IY - 0.5 ) / resolution ).x;
    float E2 = texture( map, vec2( IX - 0.5, IY + 0.5 ) / resolution ).x;
    float E3 = texture( map, vec2( IX + 0.5, IY - 0.5 ) / resolution ).x;
    float E4 = texture( map, vec2( IX + 0.5, IY + 0.5 ) / resolution ).x;

    float H1 = (E1+E2+E3+E4)/4.0;

    color.rgb = mix( S1, S2, step( 0.5, H1 ) );

    color.a = (abs(H1-0.5)-TH)/fwidth(H1)+0.5;

}
