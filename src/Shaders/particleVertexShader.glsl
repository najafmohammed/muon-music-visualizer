uniform float time;
uniform bool isPlaying;
uniform float dStrength;
uniform float beatScaler;
uniform float radiusMultiplier;
uniform float spacing;
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
varying float vz;
varying float vx;
varying float vy;
varying float v_distanceFromOrigin;
varying float _time;

float additiveWaveComponent(float sign) {
    float prevWave = index * radiusMultiplier;
    float nextWave = time * 0.1 + beatScaler * 0.01 + distanceFromOrigin * 0.7;
    float waveAngle = (sign == 0.0 ? sin(prevWave) : cos(prevWave));
    float waveRadius = (sign == 0.0 ? cos(nextWave) : sin(nextWave));

    return waveAngle * (radii + fieldDistortion * waveRadius + u_freqData * 0.01) * spacing;
}
// float modulus(float a, float b) {
//     return a - b * floor(a / b);
// }
void main() {

    _time = time;
    if(isPlaying)
        _time += (delta * 5.0);
    v_distanceFromOrigin = distanceFromOrigin;
    vScale = scale;
    vColor = customColor;
    x = position.x;
    y = position.y;
    float sineWaveConstant = beatScaler * 3.14 * (distanceFromOrigin * .1);
    float ripleAngle = distanceFromOrigin * .3 + (_time) * .2;
    float ripple = cos(ripleAngle) * sin(ripleAngle) * (1.0 + delta * 5.0);

    if(x == 0.0) {
        gl_PointSize = 0.0;
    }
    float cricleAngle = index * radiusMultiplier - ripple;
    float circleOffset = (beatScaler * 2.0 * (distanceFromOrigin * .1)) - 0.12;
    float cirleRadius = (radii + (ripple)) * spacing - (circleOffset * 1.25);

    // Ring config
    // float cirleRadius = 1.0;

    x = sin(cricleAngle) * cirleRadius;
    y = cos(cricleAngle) * cirleRadius;

    float distortion = -sin(y * dStrength) * cos(x * dStrength);
    if(isPlaying) {
        z = 10.0 * sin(distanceFromOrigin * .2 - (time * 1.0 + beatScaler) + (sineWaveConstant + delta * 10.0) - beatScaler - distortion) - distanceFromOrigin * .17;
        z = z - 5.5 + u_freqData * .05;
        gl_PointSize = scale * z * 0.5;

        if(fieldDistortion != 1.0) {
            x = additiveWaveComponent(0.0);
            y = additiveWaveComponent(1.0);
        }

    } else {
        z = 3.5796 * sin(distanceFromOrigin - time - distortion);
        gl_PointSize = scale * 9.0 * z + abs(angle);

    }
    if(gl_PointSize > 3.5) {
        gl_PointSize = 3.5;
    }
    vz = z;
    vx = x;
    vy = y;
    vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}