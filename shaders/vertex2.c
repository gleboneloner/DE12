#version 300 es

precision highp float;

layout ( location = 0 ) in vec3 particle;

uniform sampler2D map;
uniform vec2 resolution;
uniform float SO, SA, RA, MS;

flat out vec3 result;
flat out float segment;

float sence ( float R1 ) {
    vec2 H1 = particle.xy + vec2(cos(R1),sin(R1)) * SO;
    return texture( map, H1/resolution ).x;
}

void main () {

    float ND1 = float( gl_VertexID % 2 );
    float ND2 = 0.8 + 0.4 * float( gl_VertexID & 0xFF )/255.0;

    //////////////////////

    float R1 = particle.z;

    float E1 = sence( R1 - SA );
    float E2 = sence( R1 + SA );

    R1 += sign(ND1-0.5)*sign(E2-E1)*SA*RA;

    //////////////////////

    result.x = mod( particle.x + cos(R1) * ND2 * MS, resolution.x );
    result.y = mod( particle.y + sin(R1) * ND2 * MS, resolution.y );
    result.z = R1;

    //////////////////////

    segment = ND1; gl_PointSize = 1.0;
    gl_Position = vec4( 2.0*(result.xy/resolution)-1.0, 0, 1 );

}









//
