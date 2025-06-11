varying vec2 vUv;
varying vec3 vPos;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uRipple;

float wave(vec2 p) {
  return sin(p.x * 0.2 + uTime * 1.5) * 0.1 + sin(p.y * 0.15 + uTime) * 0.1;
}

float rippleEffect(vec2 uv, vec2 rippleCenter, float rippleStartTime) {
  float dist = distance(uv, rippleCenter);
  float rippleTime = uTime - rippleStartTime;
  float ripple = sin(30.0 * dist - rippleTime * 4.0);
  ripple *= smoothstep(0.5, 0.0, dist);
  ripple *= smoothstep(1.5, 0.5, rippleTime);
  return ripple * 0.03;
}

void main() {
  vec2 uv = vUv * 10.0;
  float height = wave(uv);

  float ripple = rippleEffect(vUv, uRipple.xy, uRipple.z);
  height += ripple;

  vec3 color = vec3(0.1, 0.6, 0.7);
  color += height * 1.5;

  gl_FragColor = vec4(color, 1.0);
}
