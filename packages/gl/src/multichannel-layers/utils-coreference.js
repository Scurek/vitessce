import { MAX_CHANNELS } from '@hms-dbmi/viv';
import { MAX_COLOCATION_CHANNELS } from '../constants.js';
import { padWithDefault } from './utils.js';

/**
 * @param { Array<Array<number>> } [coreferenceArray]
 * @param { Array<Array<[min: number, max: number]>> } [contrastLimits]
 */
export function buildCoreferenceMatrix(
  coreferenceArray = [],
  contrastLimits = [],
) {
  const coreferenceMatrix = [];
  const contrastLimitsMatrix = [];
  for (let i = 0; i < coreferenceArray.length; i += 1) {
    const row = new Array(MAX_CHANNELS).fill(0);
    const limitsRow = new Array(MAX_CHANNELS * 2).fill(0);
    for (let j = 0; j < coreferenceArray[i].length; j += 1) {
      row[coreferenceArray[i][j]] = 1;
      const [min, max] = contrastLimits[i][j];
      limitsRow[coreferenceArray[i][j] * 2] = min;
      limitsRow[coreferenceArray[i][j] * 2 + 1] = max;
    }
    coreferenceMatrix.push(...row);
    contrastLimitsMatrix.push(...limitsRow);
  }

  const padSize = MAX_COLOCATION_CHANNELS - coreferenceArray.length;
  if (padSize < 0) {
    throw Error(
      `${coreferenceArray.length} colocations passed in, but only ${MAX_COLOCATION_CHANNELS} are allowed.`,
    );
  }

  coreferenceMatrix.push(...Array(padSize * MAX_CHANNELS).fill(0));
  contrastLimitsMatrix.push(...Array(padSize * MAX_CHANNELS * 2).fill(0));

  return { coreferenceMatrix, contrastLimitsMatrix };
}

/**
 * @param {Array<Array<[min: number, max: number]>>} [normalizers]
 */
export function padNormalizers(
  normalizers = [],
) {
  const newCoreferenceArray = normalizers.reduce((acc, val) => acc.concat(val), []);

  const padSize = MAX_COLOCATION_CHANNELS - normalizers.length;
  if (padSize < 0) {
    throw Error(
      `${normalizers.length} normalizers passed in, but only ${MAX_COLOCATION_CHANNELS} are allowed.`,
    );
  }

  newCoreferenceArray.push(...Array(padSize * 2).fill(0));

  return newCoreferenceArray;
}


/**
 * @param { Array<Array<[min: number, max: number]>> } [contrastLimits]
 */
export function padCoreferenceContrastLimits(
  contrastLimits = [],
) {
  const newContrastLimits = [];
  for (let i = 0; i < contrastLimits.length; i += 1) {
    const padSize = MAX_CHANNELS - contrastLimits[i].length;
    if (padSize < 0) {
      throw Error(
        `${contrastLimits[i].length} sliders passed in coreference ${i}, but only ${MAX_CHANNELS} are allowed.`,
      );
    }
    const paddedContrastLimits = padWithDefault(
      [...contrastLimits[i]],
      [0, 0],
      padSize,
    ).reduce((acc, val) => acc.concat(val), []);
    newContrastLimits.push(...paddedContrastLimits);
  }

  const padSize = MAX_COLOCATION_CHANNELS - contrastLimits.length;
  if (padSize < 0) {
    throw Error(
      `${contrastLimits.length} colocations passed in, but only ${MAX_COLOCATION_CHANNELS} are allowed.`,
    );
  }

  newContrastLimits.push(...Array(padSize * MAX_CHANNELS * 2).fill(0));

  return newContrastLimits;
}

/**
 * @param {Array<Array<number>>} [colors]
 */
export function padCoreferenceColors(
  colors = [],
) {
  const newCoreferenceArray = colors.reduce((acc, val) => acc.concat(val), []);

  const padSize = MAX_COLOCATION_CHANNELS - colors.length;
  if (padSize < 0) {
    throw Error(
      `${colors.length} color groups passed in, but only ${MAX_COLOCATION_CHANNELS} are allowed.`,
    );
  }

  newCoreferenceArray.push(...Array(padSize * 3).fill(0));

  return newCoreferenceArray;
}
