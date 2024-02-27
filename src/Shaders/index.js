export const ParticleScaleVertexshader = `
attribute float scale;
varying float vScale;
attribute vec3 customColor;
varying vec3 vColor;
varying float x;
varying float y;
varying float z;
varying vec3 Vposition;
uniform float u_time;
void main() {
  vScale = scale;
  Vposition = position;
  vColor = customColor;
  x = position.x;
  y = position.y;
  z = position.z;
  vec4 mvPosition = modelViewMatrix * vec4(x,y,z, 1.0 ); 
  gl_PointSize = scale * ( 300.0 / - mvPosition.z ); 
  gl_Position = projectionMatrix * mvPosition ;  
}
`;
export const ParticleScaleFragmentshader = `
uniform vec3 color;
uniform sampler2D pointTexture;
varying float vScale;
varying vec3 vColor;
uniform float u_time;
varying float x;
void main() {
  if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
  gl_FragColor = vec4( color * vColor  , 1.0 );
  gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
  if(vScale<.1) discard;
}`;
