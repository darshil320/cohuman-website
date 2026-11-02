/**
 * Shaders for the series viewer stage.
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
 * The canvas behind the product, as literal sRGB: `--color-co-bg` (#FBF8EE). The stage is
 * flat — Signal has no gradients — so the backdrop is one colour, and that is what lets
 * the plate below multiply against it exactly.
 */
const CANVAS = "vec3(0.984314, 0.972549, 0.933333)";

export const BACKDROP_FRAGMENT_SHADER = /* glsl */ `
  void main() {
    gl_FragColor = vec4(${CANVAS}, 1.0);
  }
`;

/** Width of the plate's feathered border, as a fraction of the plate. */
const PLATE_FEATHER = "0.075";

/**
 * Product plate.
 *
 * The source renders are opaque product shots on white, and the page canvas is ivory, so
 * the white has to become the canvas without touching the product. Luminance keying was
 * tried and dropped — it ate the Signal White frame legs, which sit within a few percent
 * of the background — and hardware multiply blending did not composite reliably across
 * renderers.
 *
 * Because the backdrop is a single flat colour, multiply needs no blend mode at all: the
 * shader writes `texel × canvas` and alpha-blends that over the backdrop. White texels
 * come out as exactly the canvas, dark ones keep their value — the same result as the
 * poster's CSS `mix-blend-multiply`, so the canvas and its poster cannot disagree. The
 * outer 7.5% of the plate still feathers out, and `uOpacity` crossfades configurations.
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
    gl_FragColor = vec4(texel.rgb * ${CANVAS}, texel.a * feather * uOpacity);
  }
`;

/** Soft contact shadow ellipse on the floor line. */
export const SHADOW_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;

  // Brand ink, #231F20.
  const vec3 SHADE = vec3(0.137255, 0.121569, 0.125490);

  void main() {
    float d = length((vUv - 0.5) * 2.0);
    float mask = 1.0 - smoothstep(0.0, 1.0, d);
    gl_FragColor = vec4(SHADE, mask * mask * 0.16 * uOpacity);
  }
`;
