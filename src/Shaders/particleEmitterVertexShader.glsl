attribute float scale;
attribute float distanceFromOrigin;

varying float x;
varying float y;
varying float z;

uniform float lifespan;
attribute float alpha;
attribute float size;

attribute vec3 colors;
varying vec3 vColor;
varying float vAlpha;
void main() {
    x = position.x;
    y = position.y;
    z = position.z;
    vColor = colors;
    vAlpha = alpha;
    gl_PointSize = size;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}