export class DatabaseError extends Error {
  status: number;
  code: string;

  constructor(message: string = 'Database error occurred') {
    super(message);
    this.name = 'DATABASE_ERROR';
    this.status = 500;
    this.code = 'DATABASE_ERROR';
  }
}
