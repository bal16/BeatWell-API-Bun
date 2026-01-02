import { env } from '../env';
import tf, { type LayersModel, type Tensor } from '../lib/tensorflow';
import { logger } from '../plugins/logger';

export class PredictionService {
  private model: LayersModel | null = null;
  private readonly modelUrl = env.PREDICTION_MODEL_URL;
  private trainingMean: Tensor | null = null;
  private trainingStd: Tensor | null = null;

  private readonly trainingMeanValues = [
    0.381192421345385, 51.22979315139927, 0.45715278984877455,
    9.508527313545642, 0.04399110235597926, 0.0038240917782026767,
    0.33078393881453155, 0.02902833304362941, 239.94101542928044,
    136.50776972786105, 84.62183880739985, 26.06826981038074, 76.1527961326235,
    83.95559865051148,
  ];

  private readonly trainingStdValues = [
    0.48567968791604565, 8.183900258471727, 0.49816073368166686,
    11.916458034152472, 0.18405919709446378, 0.06172088868668824,
    0.4704954034173722, 0.16788594022233533, 44.91651448259721,
    23.449529551614948, 12.370881356316398, 3.964476014167865,
    11.566225865315907, 30.495184502275865,
  ];

  // Lazy Load
  private async ensureLoaded() {
    if (this.model) return;

    // Lazily register WASM backend, then switch
    if (tf.getBackend() !== 'wasm') {
      await import('@tensorflow/tfjs-backend-wasm');
      await tf.setBackend('wasm');
      await tf.ready();
    }

    // Initialize tensors if not already done
    if (!this.trainingMean) {
      this.trainingMean = tf.tensor(this.trainingMeanValues);
    }
    if (!this.trainingStd) {
      this.trainingStd = tf.tensor(this.trainingStdValues);
    }

    // Validate env at use-time (clear error instead of failing module import)
    if (!this.modelUrl || this.modelUrl.length === 0) {
      throw new Error('PREDICTION_MODEL_URL is required');
    }

    this.model = await tf.loadLayersModel(this.modelUrl);
    logger.info('⏳ Booting up AI Service...');
  }

  private standardScaler(userData: number[]) {
    // Normalize using training mean and std
    return tf.tidy(() => {
      const inputTensor = tf.tensor2d([userData], [1, 14]); // Shape [1, 14]
      const mean2D = tf.reshape(this.trainingMean!, [1, 14]);
      const std2D = tf.reshape(this.trainingStd!, [1, 14]);

      return tf.div(tf.sub(inputTensor, mean2D), std2D);
    });
  }

  public async makePrediction(inputData: number[]) {
    await this.ensureLoaded();

    const predictionValue = tf.tidy(() => {
      const inputTensor = this.standardScaler(inputData);

      const outputTensor = this.model!.predict(inputTensor) as Tensor;
      return outputTensor.dataSync()[0];
    });

    return predictionValue;
  }
}

export const predictionService = new PredictionService();
