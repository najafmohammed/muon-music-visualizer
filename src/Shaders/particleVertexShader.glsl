uniform float time;
uniform bool isPlaying;
uniform float beatScaler;
uniform float radiusMultiplier;
uniform float spacing;
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
    float nextWave = time * 0.1 + beatScaler * 0.05 + distanceFromOrigin * 0.7;
    float waveAngle = (sign == 0.0 ? sin(prevWave) : cos(prevWave));
    float waveRadius = (sign == 0.0 ? cos(nextWave) : sin(nextWave));

    return waveAngle * (radii * waveRadius + u_freqData * 0.01) * spacing;
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
    float spiral = (index * radiusMultiplier + radii) * .005;

    float circleOffset = (beatScaler * 1.5 * (distanceFromOrigin * .1)) + 2.0 * sin(beatScaler);

    if(!isPlaying) {
        circleOffset = (beatScaler * 1.5 * distanceFromOrigin * .1) + 3.14 * sin(time);
    }
    float cirleRadius = radii * (-.4) - circleOffset * .5 * sin(circleOffset * .5);
    float cricleAngle = index * radiusMultiplier - ripple;

    x = sin(cricleAngle) * cirleRadius;
    y = cos(cricleAngle) * cirleRadius;
    float distortion = -sin(y * .3) * cos(x * .3);
    if(isPlaying) {

        float freqAmp = u_freqData * .007;
        z = 3.14 * cos(-spiral) * 1.0;

        z += freqAmp;
        z -= 2.5;

        gl_PointSize = z * distanceFromOrigin;

    } else {
        z = 2.3 * sin(spiral + distanceFromOrigin - time - distortion);
        gl_PointSize = z * distanceFromOrigin * .08;

    }
    if(gl_PointSize > 4.0) {
        gl_PointSize = 4.0;
    }
    vz = z;
    vx = x;
    vy = y;

    vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}