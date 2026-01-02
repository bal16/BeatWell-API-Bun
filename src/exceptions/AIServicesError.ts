export class AIServicesError extends Error {
  status: number;
  code: string;

  constructor(message: string = 'AI Services currently down') {
    super(message);
    this.name = 'AI_SERVICES_ERROR';
    this.status = 500;
    this.code = 'AI_SERVICES_ERROR';
  }
}
