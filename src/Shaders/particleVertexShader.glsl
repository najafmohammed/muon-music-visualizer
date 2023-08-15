uniform float time;
uniform bool isPlaying;
uniform float dStrength;
uniform float beatScaler;
uniform float radiusMultiplier;
uniform float spacing;
uniform float fieldDistortion;
uniform float delta;
uniform float spiralMultiplier;

attribute float scale;
attribute vec3 customColor;
attribute float distanceFromOrigin;
attribute float index;
attribute float indexMod;
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
varying float _scaleAccumulator;

float additiveWaveComponent(float sign) {
    float prevWave = index * radiusMultiplier;
    float nextWave = time * 0.1 + beatScaler * 0.05 + distanceFromOrigin * 0.7;
    float waveAngle = (sign == 0.0 ? sin(prevWave) : cos(prevWave));
    float waveRadius = (sign == 0.0 ? cos(nextWave) : sin(nextWave));

    return waveAngle * (radii + fieldDistortion * waveRadius + u_freqData * 0.01) * spacing;
}
// float modulus(float a, float b) {
//     return a - b * floor(a / b);
// }

void main() {

    _time = time;
    if(isPlaying) {
        _time += delta * 5.0;
    }

    v_distanceFromOrigin = distanceFromOrigin;
    vScale = scale;
    vColor = customColor;
    x = position.x;
    y = position.y;
    float ripleAngle = distanceFromOrigin * .3 + (_time) * .2;
    float ripple = cos(ripleAngle) * sin(ripleAngle) * (1.0 + delta * 10.0);
    float spiral = (index * radiusMultiplier + radii) * spiralMultiplier;

    float circleOffset = (beatScaler * 1.5 * (distanceFromOrigin * .1)) + 5.0 * sin(beatScaler * delta);

    if(!isPlaying) {
        circleOffset = (beatScaler * 1.5 * distanceFromOrigin * .1) + 3.14 * sin(time);
    }
    float cirleRadius = radii * (spacing - .2) - .4 - circleOffset * .4 * sin(circleOffset);
    float cricleAngle = index * radiusMultiplier - ripple;

    x = sin(cricleAngle) * cirleRadius;
    y = cos(cricleAngle) * cirleRadius;
    float distortion = -sin(y * dStrength) * cos(x * dStrength);
    if(isPlaying) {

        float zTheta = sin(distanceFromOrigin * .1 - beatScaler * 2.0 - distortion);
        float freqAmp = u_freqData * .04;
        z = 10.0 * cos(-spiral) * zTheta;

        z += freqAmp;
        z -= 3.5;

        gl_PointSize = scale * z * 0.45;

        if(fieldDistortion != 1.0) {
            x = additiveWaveComponent(0.0);
            y = additiveWaveComponent(1.0);
        }

    } else {
        z = 3.5796 * sin(spiral + distanceFromOrigin - time - distortion);

        gl_PointSize = scale * z + abs(angle);

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