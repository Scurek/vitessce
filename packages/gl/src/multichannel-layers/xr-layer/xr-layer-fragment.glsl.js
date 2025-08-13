export default `\
#define SHADER_NAME xr-layer-fragment-shader
#define CHANNEL(n) channel##n

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
uniform bool colocations[36];

float combine_intensity(float intensities[6], int channel) {
  float combined = 0.0;
  for (int i = 0; i < 6; i++) {
    if (colocations[channel * 6 + i]) {
      combined += intensities[i];
    }
  }
  return combined;
}

void compute_colocations(inout vec4 fragcolor, float intensities[6]) {
  for (int i = 0; i < 6; i++) {
    float combined = combine_intensity(intensities, i);
    vec3 color = combined * vec3(1., 1., 0.);
    fragcolor.rgb += color;
  }
}

void main() {
  float intensity0 = float(texture(channel0, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensity0, contrastLimits[0], 0);
  float intensity1 = float(texture(channel1, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensity1, contrastLimits[1], 1);
  float intensity2 = float(texture(channel2, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensity2, contrastLimits[2], 2);
  float intensity3 = float(texture(channel3, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensity3, contrastLimits[3], 3);
  float intensity4 = float(texture(channel4, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensity4, contrastLimits[4], 4);
  float intensity5 = float(texture(channel5, vTexCoord).r);
  DECKGL_PROCESS_INTENSITY(intensity5, contrastLimits[5], 5);

  float intensities[6] = float[6](intensity0, intensity1, intensity2, intensity3, intensity4, intensity5);

  DECKGL_MUTATE_COLOR(gl_FragColor, intensity0, intensity1, intensity2, intensity3, intensity4, intensity5, vTexCoord);

  compute_colocations(gl_FragColor, intensities);

  geometry.uv = vTexCoord;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);

  //gl_FragColor = vec4(1., 1., 0., 1.);
}
`;
