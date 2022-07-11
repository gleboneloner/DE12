#version 300 es

precision highp float;

layout ( location = 0 ) in vec3 data;

uniform sampler2D map;
uniform vec2 resolution;
uniform float SO, SA, RA, MS;

out float domain;
out vec3 agent;

void main () {

    float R1 = data.z;

    float N1 = float( gl_VertexID & 1 );
    float N2 = float( gl_VertexID & 0xFF ) / 510.0 + 0.75;

    vec2 H1 = data.xy + vec2(cos(R1-SA),sin(R1-SA)) * SO;
    vec2 H2 = data.xy + vec2(cos(R1+SA),sin(R1+SA)) * SO;

    float E1 = texture( map, H1/resolution ).x;
    float E2 = texture( map, H2/resolution ).x;

    R1 += sign(N1-0.5)*sign(E2-E1)*SA*RA;

    agent = vec3( data.xy + vec2(cos(R1),sin(R1))*N2*MS, R1 );

    agent.xy = mod( agent.xy, resolution );

    gl_Position = vec4( (agent.xy/(resolution/2.0))-1.0, 0, 1 );

    gl_PointSize = 1.0;

    domain = N1;

}
