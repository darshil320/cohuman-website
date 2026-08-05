/**
 * Shaders for the PROS viewer stage.
 *
 * Colour handling: both shaders write sRGB-encoded values straight to the
 * framebuffer. Three only appends its output-colour-space conversion to built-in
 * materials, not to a raw `ShaderMaterial`, so textures are uploaded with
 * `NoColorSpace` and the constants below are literal sRGB — the two agree and the
 * render matches the source PNGs.
 */

export const STAGE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Studio sweep behind the product: the design's
 * `radial-gradient(125% 100% at 50% -6%, #FFFFFF, #F8F6F1 46%, #E7E3D9)` plus the
 * hairline horizon at 71% down the stage.
 */
export const BACKDROP_FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;

  // The centre stays essentially white because that is what the product renders sit on
  // — the closer these agree, the less the plate reads as a pasted-on panel.
  const vec3 NEAR = vec3(1.0, 1.0, 1.0);
  const vec3 MID = vec3(0.992, 0.988, 0.980);
  const vec3 FAR = vec3(0.906, 0.890, 0.851);
  const vec3 HORIZON = vec3(0.878, 0.882, 0.886);

  void main() {
    // Gradient origin sits just above the top edge, matching "at 50% -6%".
    vec2 p = vec2((vUv.x - 0.5) / 0.625, (vUv.y - 1.06));
    float d = clamp(length(p), 0.0, 1.0);

    vec3 col = mix(NEAR, MID, smoothstep(0.0, 0.46, d));
    col = mix(col, FAR, smoothstep(0.46, 1.0, d));

    float line = 1.0 - smoothstep(0.0, 0.003, abs(vUv.y - 0.29));
    float taper = smoothstep(0.0, 0.18, vUv.x) * smoothstep(0.0, 0.18, 1.0 - vUv.x);
    col = mix(col, HORIZON, line * taper * 0.55);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Width of the plate's feathered border, as a fraction of the plate. */
const PLATE_FEATHER = "0.075";

/**
 * Product plate.
 *
 * The source renders are opaque product shots on a near-white sweep, so the plate's own
 * background has to disappear into the backdrop. Two approaches were tried and dropped:
 * luminance keying ate the Signal White frame legs (they sit within a few percent of the
 * background), and multiply blending did not composite reliably across renderers — the
 * plate came out opaque white.
 *
 * What remains is plain alpha blending with a feathered border: the outer 7.5% of the
 * plate fades out, and since the render keeps its product well inside its own margins,
 * only background pixels are touched. `uOpacity` then crossfades whole configurations.
 */
export const PLATE_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 texel = texture2D(uMap, vUv);
    vec2 rise = smoothstep(vec2(0.0), vec2(${PLATE_FEATHER}), vUv);
    vec2 fall = smoothstep(vec2(0.0), vec2(${PLATE_FEATHER}), vec2(1.0) - vUv);
    float feather = rise.x * rise.y * fall.x * fall.y;
    gl_FragColor = vec4(texel.rgb, texel.a * feather * uOpacity);
  }
`;

/** Soft contact shadow ellipse on the floor line. */
export const SHADOW_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;

  const vec3 SHADE = vec3(0.122, 0.137, 0.157);

  void main() {
    float d = length((vUv - 0.5) * 2.0);
    float mask = 1.0 - smoothstep(0.0, 1.0, d);
    gl_FragColor = vec4(SHADE, mask * mask * 0.16 * uOpacity);
  }
`;
