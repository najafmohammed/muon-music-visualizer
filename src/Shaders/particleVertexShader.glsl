uniform float time;
uniform bool isPlaying;
uniform float dStrength;
uniform float beatScaler;
uniform float radiusMultiplier;
uniform float spacing;
uniform bool redrawGeom;
uniform float fieldDistortion;
uniform float delta;

attribute float scale;
attribute vec3 customColor;
attribute float distanceFromOrigin;
attribute float index;
attribute float angle;
attribute float u_freqData;
attribute float radii;

varying float vScale;
varying vec3 vColor;
varying float x;
varying float y;
varying float z;
varying float v_distanceFromOrigin;

void main() {
    v_distanceFromOrigin = distanceFromOrigin;
    vScale = scale;
    vColor = customColor;
    x = position.x;
    y = position.y;
    float sineWaveConstant = beatScaler * 4.14 * distanceFromOrigin * .1 - time;
    float ripleAngle = distanceFromOrigin * .3 - time * .3 + delta;
    float ripple = cos(ripleAngle) * sin(ripleAngle) * abs(1.0 + delta);

    if(x == 0.0) {
        gl_PointSize = 0.0;
    }
    float amplitude = 0.05;
    float frequency = 4.0;
    float circleAngle = index * radiusMultiplier - ripple;
    float cirleRadius = (radii + (ripple * distanceFromOrigin * .3)) * spacing;

    float wave = amplitude * sin(time + circleAngle * frequency);
    x = (sin(circleAngle)) * cirleRadius;
    y = (cos(circleAngle)) * cirleRadius;

    if(isPlaying) {
        x = (sin(circleAngle) + wave) * cirleRadius;
        y = (cos(circleAngle) + wave) * cirleRadius;
        z = 7.0 * cos(distanceFromOrigin * 0.5 + sineWaveConstant - sin(y * dStrength) * cos(x * dStrength));
        z = z + u_freqData * .043;
        gl_PointSize = scale * z * 0.52;

    } else {
        z = 3.5796 * sin(distanceFromOrigin - time);
        gl_PointSize = scale * 10.0 * z + abs(angle);

    }
    if(gl_PointSize > 7.0) {
        gl_PointSize = 7.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}