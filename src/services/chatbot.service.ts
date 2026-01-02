import tf, { type LayersModel, type Tensor } from '../lib/tensorflow';
import natural from 'natural';
import { env } from '../env';
import { logger } from '../plugins/logger';

// Type Definitions
type TIntents = { tag: string; responses: string[] };
type TIntentFile = { intents: TIntents[] };

export class ChatbotService {
  private model: LayersModel | null = null;
  private tokenizer = new natural.WordTokenizer();

  private intents: { tag: string; responses: string[] }[] = [];
  private words: string[] = [];
  private classes: string[] = [];

  private async ensureLoaded() {
    if (this.model) return;

    // Lazily register WASM backend, then switch
    if (tf.getBackend() !== 'wasm') {
      await import('@tensorflow/tfjs-backend-wasm');
      await tf.setBackend('wasm');
      await tf.ready();
    }

    logger.info('⏳ Loading Chatbot Assets...');

    // Validate env at use-time
    if (
      !env.CHATBOT_MODEL_URL ||
      !env.CHATBOT_INTENTS_URL ||
      !env.CHATBOT_WORDS_URL ||
      !env.CHATBOT_CLASSES_URL
    ) {
      throw new Error('CHATBOT_* env variables are required');
    }

    // Load Model
    this.model = await tf.loadLayersModel(env.CHATBOT_MODEL_URL);

    // Load JSON Data via fetch (serverless-friendly)
    try {
      const rawIntents = (await fetch(env.CHATBOT_INTENTS_URL).then((res) =>
        res.json(),
      )) as { intents: { tag: string; responses: string[] }[] };
      this.intents = rawIntents.intents;
      this.words = await fetch(env.CHATBOT_WORDS_URL).then((res) => res.json());
      this.classes = await fetch(env.CHATBOT_CLASSES_URL).then((res) =>
        res.json(),
      );
    } catch (error) {
      logger.error(`❌ Gagal load assets chatbot:${error}`);
      throw new Error('Gagal load assets chatbot');
    }
    logger.info('✅ Chatbot Ready');
  }

  private cleanUpSentence(sentence: string): string[] {
    const tokens = this.tokenizer.tokenize(sentence.toLowerCase());
    return tokens.map((token) => natural.StemmerId.stem(token));
  }

  private bagOfWords(sentence: string) {
    const sentenceWords = this.cleanUpSentence(sentence);
    const bag = Array(this.words.length).fill(0);

    sentenceWords.forEach((word) => {
      const index = this.words.indexOf(word);
      if (index > -1) {
        bag[index] = 1;
      }
    });

    return tf.tensor2d([bag]);
  }

  public async reply(message: string): Promise<string> {
    await this.ensureLoaded();

    // 1. Prediksi Class/Tag
    const tag = tf.tidy(() => {
      const inputTensor = this.bagOfWords(message);
      const predictions = this.model!.predict(inputTensor) as Tensor;
      const data = predictions.dataSync(); // Ambil array probabilitas
      const maxIndex = data.indexOf(Math.max(...data));
      return this.classes[maxIndex];
    });

    // 2. Ambil Response Acak berdasarkan Tag
    const intent = this.intents.find((i) => i.tag === tag);
    if (intent && intent.responses.length > 0) {
      return intent.responses[
        Math.floor(Math.random() * intent.responses.length)
      ];
    }

    return 'Maaf, saya tidak mengerti maksud Anda.';
  }
}

export const chatbotService = new ChatbotService();
