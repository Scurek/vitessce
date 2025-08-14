export default `\
#define SHADER_NAME xr-layer-fragment-shader
#define MAX_COLOCATIONS 6
#define COLOCATION_ARRAY_SIZE 36

precision highp float;
precision highp int;
precision highp SAMPLER_TYPE;

// our texture
uniform SAMPLER_TYPE channel0;
uniform SAMPLER_TYPE channel1;
uniform SAMPLER_TYPE channel2;
uniform SAMPLER_TYPE channel3;
uniform SAMPLER_TYPE channel4;
uniform SAMPLER_TYPE channel5;

in vec2 vTexCoord;

// range
uniform vec2 contrastLimits[6];
uniform float opacities[6];

// colocations (MedVis challenge)
uniform bool colocations[COLOCATION_ARRAY_SIZE];
uniform float colocationOpacities[MAX_COLOCATIONS];
uniform vec2 coreferenceNormalizers[MAX_COLOCATIONS];
uniform vec3 colocationColors[MAX_COLOCATIONS];

float combine_intensity(inout int activeChannels, float intensities[6], int channel) {
  float combined = 1.0;
  for (int i = 0; i < 6; i++) {
    int colocationIndex = channel * 6 + i;
    if (colocations[colocationIndex]) {
      activeChannels++;
      combined *= intensities[i];
    }
  }
  return combined;
}

float normalizeWithLimits(float value, vec2 limits) {
  return max(0., (value - limits[0]) / max(0.0005, (limits[1] - limits[0])));
}

void compute_colocations(inout vec4 fragcolor, float intensities[6]) {
  for (int i = 0; i < MAX_COLOCATIONS; i++) {
    int activeChannels = 0;
    float combined = combine_intensity(activeChannels, intensities, i) * colocationOpacities[i];
    if (activeChannels > 0) {
      vec3 color = normalizeWithLimits(combined, coreferenceNormalizers[i]) * colocationColors[i];
      fragcolor.rgb += color;
    }
  }
}

float intensities[6];

void main() {
  intensities[0] = float(texture(channel0, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensities[0], contrastLimits[0], 0);
  intensities[1] = float(texture(channel1, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensities[1], contrastLimits[1], 1);
  intensities[2] = float(texture(channel2, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensities[2], contrastLimits[2], 2);
  intensities[3] = float(texture(channel3, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensities[3], contrastLimits[3], 3);
  intensities[4] = float(texture(channel4, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensities[4], contrastLimits[4], 4);
  intensities[5] = float(texture(channel5, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensities[5], contrastLimits[5], 5);

  DECKGL_MUTATE_COLOR(gl_FragColor, intensities[0] * opacities[0], intensities[1] * opacities[1], intensities[2] * opacities[2], intensities[3] * opacities[3], intensities[4] * opacities[4], intensities[5] * opacities[5], vTexCoord);

  compute_colocations(gl_FragColor, intensities);

  geometry.uv = vTexCoord;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);

  //gl_FragColor = vec4(1., 1., 0., 1.);
}
`;
