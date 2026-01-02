import * as tfCore from '@tensorflow/tfjs-core';
import * as tfLayers from '@tensorflow/tfjs-layers';

// Compose tf at import time (lightweight)
const tf = {
  ...tfCore,
  ...tfLayers,
};

export type { LayersModel } from '@tensorflow/tfjs-layers';
export type { Tensor } from '@tensorflow/tfjs-core';

export default tf;
