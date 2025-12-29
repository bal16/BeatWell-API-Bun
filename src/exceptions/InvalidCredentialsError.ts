export class InvalidCredentialsError extends Error {
  status: number;
  code: string;

  constructor(message: string = 'Invalid credentials provided.') {
    super(message);
    this.name = 'INVALID_CREDENTIALS';
    this.status = 400;
    this.code = 'INVALID_CREDENTIALS';
  }
}
