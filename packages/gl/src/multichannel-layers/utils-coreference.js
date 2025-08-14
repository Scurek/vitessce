import { MAX_CHANNELS } from '@hms-dbmi/viv';
import { MAX_COLOCATION_CHANNELS } from '../constants.js';

/**
 * @param { Array<Array<number>> } [coreferenceArray]
 */
export function buildCoreferenceMatrix(
  coreferenceArray = [],
) {
  const coreferenceMatrix = [];
  for (let i = 0; i < coreferenceArray.length; i += 1) {
    const row = new Array(MAX_CHANNELS).fill(0);
    for (let j = 0; j < coreferenceArray[i].length; j += 1) {
      row[coreferenceArray[i][j]] = 1;
    }
    coreferenceMatrix.push(...row);
  }

  const padSize = MAX_COLOCATION_CHANNELS - coreferenceArray.length;
  if (padSize < 0) {
    throw Error(
      `${coreferenceArray.length} colocations passed in, but only ${MAX_COLOCATION_CHANNELS} are allowed.`,
    );
  }

  coreferenceMatrix.push(...Array(padSize * MAX_CHANNELS).fill(0));

  return coreferenceMatrix;
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
