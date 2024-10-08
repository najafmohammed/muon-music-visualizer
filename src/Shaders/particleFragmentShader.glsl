uniform vec3 color;
uniform sampler2D pointTexture;
varying float vScale;
varying vec3 vColor;

void main() {

    if(length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475)
        discard;
    if(vScale < .1)
        discard;
    gl_FragColor = vec4(color * vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
}