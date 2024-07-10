uniform vec3 color;
uniform sampler2D pointTexture;
varying float vScale;
varying vec3 vColor;
varying float vz;
varying float vy;
varying float vx;

void main() {

    if(length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475)
        discard;

    if(vScale < .5)
        discard;

    if(vz < -1.0)
        discard;

    gl_FragColor = vec4((color * vColor), 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
}