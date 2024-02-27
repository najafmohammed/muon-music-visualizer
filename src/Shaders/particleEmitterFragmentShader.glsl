uniform vec3 color;
varying vec3 vColor;

uniform sampler2D pointTexture;

void main() {

    gl_FragColor = vec4(color * vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
}