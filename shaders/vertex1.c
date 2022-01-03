#version 300 es

precision highp float;

layout ( location = 0 ) in vec3 particle;

uniform vec2 resolution;
uniform float seed;

flat out vec3 result;
flat out float segment;

uint hash ( uint x ) {

    x += ( x << 0xAU );
    x ^= ( x >> 0x6U );
    x += ( x << 0x3U );
    x ^= ( x >> 0xBU );
    x += ( x << 0xFU );

    return x;

}

float random ( inout uint x ) {

	x ^= ( x << 0x0DU );
	x ^= ( x >> 0x11U );
	x ^= ( x << 0x05U );

	return uintBitsToFloat( 0x3f800000U | ( x >> 9 ) ) - 1.0;

}

void main () {

    uint n = hash( floatBitsToUint( seed ) ^ hash( uint( gl_VertexID ) ) );

    /////////////////////////

    result.x = random(n)*resolution.x;
    result.y = random(n)*resolution.y;
    result.z = random(n)*6.2831853;

    /////////////////////////

    segment = float( gl_VertexID % 2 ); gl_PointSize = 1.0;
    gl_Position = vec4( 2.0*(result.xy/resolution)-1.0, 0, 1 );

}









//
