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

// colocations (MedVis challenge)
uniform bool colocations[COLOCATION_ARRAY_SIZE];
uniform vec2 coreferenceNormalizers[MAX_COLOCATIONS];
uniform vec2 colocationContrastLimits[COLOCATION_ARRAY_SIZE];
uniform vec3 colocationColors[MAX_COLOCATIONS];

float combine_intensity(inout int activeChannels, float intensities[6], int channel) {
  float combined = 1.0;
  for (int i = 0; i < 6; i++) {
    int colocationIndex = channel * 6 + i;
    if (colocations[colocationIndex]) {
      activeChannels++;
      float intensity = intensities[i];
      DECKGL_PROCESS_INTENSITY(intensity, colocationContrastLimits[colocationIndex], i);
      combined *= intensity;
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
    float combined = combine_intensity(activeChannels, intensities, i);
    if (activeChannels > 0) {
      // vec3 color = (combined / float(activeChannels)) * colocationColors[i];
      vec3 color = normalizeWithLimits(combined, coreferenceNormalizers[i]) * colocationColors[i];
      fragcolor.rgb += color;
    }
  }
}

float unprocessedIntensities[6];

void main() {
  float intensity0 = float(texture(channel0, vTexCoord).r);
  unprocessedIntensities[0] = intensity0;
  DECKGL_PROCESS_INTENSITY(intensity0, contrastLimits[0], 0);
  float intensity1 = float(texture(channel1, vTexCoord).r);
  unprocessedIntensities[1] = intensity1;
  DECKGL_PROCESS_INTENSITY(intensity1, contrastLimits[1], 1);
  float intensity2 = float(texture(channel2, vTexCoord).r);
  unprocessedIntensities[2] = intensity2;
  DECKGL_PROCESS_INTENSITY(intensity2, contrastLimits[2], 2);
  float intensity3 = float(texture(channel3, vTexCoord).r);
  unprocessedIntensities[3] = intensity3;
  DECKGL_PROCESS_INTENSITY(intensity3, contrastLimits[3], 3);
  float intensity4 = float(texture(channel4, vTexCoord).r);
  unprocessedIntensities[4] = intensity4;
  DECKGL_PROCESS_INTENSITY(intensity4, contrastLimits[4], 4);
  float intensity5 = float(texture(channel5, vTexCoord).r);
  unprocessedIntensities[5] = intensity5;
  DECKGL_PROCESS_INTENSITY(intensity5, contrastLimits[5], 5);

  DECKGL_MUTATE_COLOR(gl_FragColor, intensity0, intensity1, intensity2, intensity3, intensity4, intensity5, vTexCoord);

  compute_colocations(gl_FragColor, unprocessedIntensities);

  geometry.uv = vTexCoord;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);

  //gl_FragColor = vec4(1., 1., 0., 1.);
}
`;
