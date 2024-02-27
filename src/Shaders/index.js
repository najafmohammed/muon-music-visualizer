export const ParticleScaleVertexshader = `
uniform float time;
uniform bool isPlaying;
uniform float dStrength;
uniform float beatScaler;
uniform float radiusMultiplier;
uniform float spacing;
uniform bool redrawGeom;

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
varying vec2 vUv;
varying float v_distanceFromOrigin;


void main() {
  vUv = uv;
  v_distanceFromOrigin = distanceFromOrigin;
  vScale = scale;
  vColor = customColor;
  x = position.x;
  y = position.y;
  float sineWaveConstant = beatScaler * 4.14 - time;
  
  if(x == 0.0) {
  gl_PointSize = 0.0;
  }
  if ( redrawGeom) {
    x = sin(index * radiusMultiplier) * radii * spacing;
    y = cos(index * radiusMultiplier) * radii * spacing;
  }

  if(isPlaying) {
  
  z = 7.0 * cos(distanceFromOrigin * 0.7 + sineWaveConstant - sin(y * dStrength) * cos(x * dStrength)) - distanceFromOrigin * 0.1;
  z = z + u_freqData * .043;
  gl_PointSize = scale * z * 0.6;
  
  } else {
  z = 3.5796 * sin(distanceFromOrigin - time - sin(y * dStrength) * cos(x * dStrength));
  
  gl_PointSize = scale * 10.0 * z + abs(angle);
  
  if(gl_PointSize > 5.0) {
  gl_PointSize = 5.0;
  }
  }
  
  if(gl_PointSize < 1.0) {
  gl_PointSize = 1.282;
  }
  
  vec4 mvPosition = modelViewMatrix *
    vec4(x, y, z, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const ParticleScaleFragmentshader = `
uniform vec3 color;
uniform sampler2D pointTexture;
varying float vScale;
varying vec3 vColor;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying float v_distanceFromOrigin;

void main() {
  vec2 coord = vUv * resolution / resolution.y;
  vec2 mouse = vec2(0.0,0.0);
  float distance = length(coord - mouse);
  
  float ripple = abs(sin(v_distanceFromOrigin*.2  - time ) * 0.1);
  
  if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
  if(vScale<.1) discard;
  gl_FragColor =  vec4( color * vColor*ripple*10.0  , 1.0-ripple );
  gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
  
}`;

// uniform float time;
// uniform vec2 resolution;
// vec2 position = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
// float dist = length(position);
// float strength = 0.5;
// position *= 1.0 + (sin(time) * strength * (1.0 - dist));
// vec2 pixelCoord = ((position / 2.0) + 0.5) * resolution.xy;
// gl_FragColor = vec4(pixelCoord , 0.0, 1.0);
