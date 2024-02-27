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

float additiveWaveComponent(float sign) {
    float prevWave = index * radiusMultiplier;
    float nextWave = time * 0.1 + beatScaler * 0.01 + distanceFromOrigin * 0.7;
    float waveAngle = (sign == 0.0 ? sin(prevWave) : cos(prevWave));
    float waveRadius = (sign == 0.0 ? cos(nextWave) : sin(nextWave));

    return waveAngle * (radii + fieldDistortion * waveRadius + u_freqData * 0.01) * spacing;
}

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
    if(redrawGeom) {
        float cricleAngle = index * radiusMultiplier - ripple;
        float cirleRadius = (radii + (ripple * distanceFromOrigin * .3)) * spacing;
        x = sin(cricleAngle) * cirleRadius;
        y = cos(cricleAngle) * cirleRadius;
    }

    if(isPlaying) {

        z = 7.0 * cos(distanceFromOrigin * 0.5 + sineWaveConstant - sin(y * dStrength) * cos(x * dStrength));
        z = z + u_freqData * .043;
        gl_PointSize = scale * z * 0.52;

        if(fieldDistortion != 1.0) {
            x = additiveWaveComponent(0.0);
            y = additiveWaveComponent(1.0);
        }

    } else {
        z = 3.5796 * sin(distanceFromOrigin - time - sin(y * dStrength) * cos(x * dStrength));
        gl_PointSize = scale * 10.0 * z + abs(angle);

    }
    if(gl_PointSize > 7.0) {
        gl_PointSize = 7.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}