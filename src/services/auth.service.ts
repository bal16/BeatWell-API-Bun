// import { InvalidCredentialsError } from '../exceptions/InvalidCredentialsError';
import { auth } from '../lib/auth';
import { logger } from '../plugins/logger';

export class AuthService {
  private authApi = auth.api;
  private logger = logger;
  constructor() {}

  async signIn(email: string, password: string) {
    try {
      this.logger.debug(`AuthService: Signing in user with email: ${email}`);
      return await this.authApi.signInEmail({
        body: { email, password },
      });
    } catch (error) {
      this.logger.error(
        `AuthService: Error signing in user with email: ${email}`,
      );
      throw error;
    }
  }

  async signUp(name: string, email: string, password: string) {
    try {
      this.logger.debug(`AuthService: Signing up user with email: ${email}`);
      return await this.authApi.signUpEmail({
        body: { name, email, password },
      });
    } catch (error) {
      this.logger.error(
        `AuthService: Error signing up user with email: ${email}`,
      );
      throw error;
    }
  }

  async signOut(token: string) {
    try {
      this.logger.debug('AuthService: Signing out user with token.');
      return await this.authApi.signOut({
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      this.logger.error('AuthService: Error signing out user with token');
      throw error;
    }
  }
}

export const authService = new AuthService();
