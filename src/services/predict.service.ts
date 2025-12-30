import { env } from '@/env';
import tf, { type LayersModel, type Tensor } from '@/lib/tensorflow';

// Contoh nilai Mean & StdDev dari Training Data (GANTI INI DENGAN DATA ASLIMU)
// TODO: Dapatkan nilai mean & std dari proses training Python-mu
// const TRAINING_MEAN = tf.tensor([
//   /* ... array mean dari training ... */
// ]);
// const TRAINING_STD = tf.tensor([
//   /* ... array std dari training ... */
// ]);

export class PredictionService {
  private model: LayersModel | null = null;
  private readonly modelUrl = env.PREDICTION_MODEL_URL; //'file://path/to/model.json'; // Atau URL remote
  // private readonly modelUrl =
  //   'https://raw.githubusercontent.com/alif40550/BeatWell-API/refs/heads/master/model/prediction/model.json'; //'file://path/to/model.json'; // Atau URL remote

  // Lazy Load
  private async ensureLoaded() {
    if (this.model) return;

    // Set backend WASM (hanya sekali)
    if (tf.getBackend() !== 'wasm') {
      await tf.setBackend('wasm');
      await tf.ready();
    }

    this.model = await tf.loadLayersModel(this.modelUrl);
  }

  // Helper: Format Input
  private formatInput(inputs: any): number[] {
    //TODO: Ganti any dengan tipe data input yang benar
    return [
      inputs.sex,
      inputs.age,
      Number(inputs.cigsPerday > 0),
      inputs.cigsPerday,
      Number(inputs.BPMeds),
      Number(inputs.prevalentStroke),
      Number(inputs.prevalentHyp),
      Number(inputs.diabetes),
      inputs.totChol,
      inputs.sysBP,
      inputs.diaBP,
      inputs.BMI,
      inputs.heartRate,
      inputs.glucose,
    ];
  }

  // Scaler yang BENAR (menggunakan statistik Training Data)
  private standardScaler(userData: number[]) {
    return tf.tidy(() => {
      const inputTensor = tf.tensor2d([userData], [1, 14]); // Shape [1, 14]
      // Rumus: (X - Mean_Training) / Std_Training
      // !!: Pastikan shape tensor mean/std sesuai dengan input (14 kolom)
      // Jika kamu belum punya data ini, kamu harus cari dari proses training Python-mu.
      // ?? Untuk sementara kode ini saya komen, tapi logic aslimu pasti error kalau input cuma 1 baris.

      // const normalized = inputTensor.sub(TRAINING_MEAN).div(TRAINING_STD);
      // return normalized;

      return inputTensor; // Return raw dulu kalau belum ada data mean/std
    });
  }

  public async makePrediction(rawData: number[]) {
    await this.ensureLoaded();

    const formattedData = this.formatInput(rawData);

    const predictionValue = tf.tidy(() => {
      const inputTensor = this.standardScaler(formattedData);

      const outputTensor = this.model!.predict(inputTensor) as Tensor;
      return outputTensor.dataSync()[0];
    });

    return Math.round(predictionValue * 100);
  }
}
