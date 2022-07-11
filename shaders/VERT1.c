#version 300 es

precision highp float;

uniform vec2 resolution;
uniform uint seed;

out vec3 agent;
out float domain;

uint hash ( uint a, uint b ) {

    uint x = 0U;

    x += a;
    x += ( x << 0xAU );
    x ^= ( x >> 0x6U );

    x += b;
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

	return uintBitsToFloat( 0x3F800000U | ( x >> 9 ) ) - 1.0;

}

void main () {

    uint n = hash( seed, uint( gl_VertexID ) );

    agent = vec3( random(n), random(n), random(n) );

    gl_Position = vec4( (agent.xy-0.5)/0.5, 0, 1 );

    agent *= vec3( resolution, 6.283185 );

    domain = float( gl_VertexID & 1 );

    gl_PointSize = 1.0;

}
