import * as tfCore from '@tensorflow/tfjs-core';
import * as tfLayers from '@tensorflow/tfjs-layers';
import '@tensorflow/tfjs-backend-wasm';

// Gabungkan Core dan Layers ke satu objek 'tf' biar mirip import default
const tf = {
  ...tfCore,
  ...tfLayers,
};

export type { LayersModel } from '@tensorflow/tfjs-layers';
export type { Tensor } from '@tensorflow/tfjs-core';

export default tf;

//Cannot find namespace 'tf'.ts(2503)
// ⚠ Error (TS2503)  |  |  |

// Cannot find namespace tf .
