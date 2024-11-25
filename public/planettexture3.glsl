/*

uniform vec2 resolution;
uniform vec2 mouse_position;
uniform float time;


void main() {
    vec2 st = gl_FragCoord.xy/ resolution.xy;

    st *= 50.0; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords

    // Assign a random value based on the integer coord
    vec3 color = vec3(random( ipos ));

    // Uncomment to see the subdivided grid
    // color = vec3(fpos,0.0);

    gl_FragColor = vec4(color,1.0);
}
*/
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
                 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/ resolution.xy;
    st *= 50.0; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords
    vec3 color2 = vec3(random( ipos ) ) ;
    vec4 color = texture2D(u_texture, vUv);
    gl_FragColor = mix(color, vec4(color2, 0.2), -0.5);
}
