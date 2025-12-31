import { describe, it, expect, mock, beforeEach } from 'bun:test';

// 1. Mock dependencies
const mockSignInEmail = mock();
const mockSignUpEmail = mock();
const mockSignOut = mock();

mock.module('@/lib/auth', () => ({
  auth: {
    api: {
      signInEmail: mockSignInEmail,
      signUpEmail: mockSignUpEmail,
      signOut: mockSignOut,
    },
  },
}));

const mockLogger = {
  debug: mock(),
  error: mock(),
};

mock.module('@/plugins/logger', () => ({
  logger: mockLogger,
}));

// 2. Import Service dynamically to ensure mocks are applied
const { AuthService } = await import('./auth.service');

describe('AuthService', () => {
  let service: InstanceType<typeof AuthService>;

  beforeEach(() => {
    // Reset mocks
    mockSignInEmail.mockReset();
    mockSignUpEmail.mockReset();
    mockSignOut.mockReset();
    mockLogger.debug.mockClear();
    mockLogger.error.mockClear();

    service = new AuthService();
  });

  describe('signIn', () => {
    it('should call signInEmail with correct parameters', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const mockResponse = {
        redirect: false,
        token: 'abc123',
        user: {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          email,
          emailVerified: true,
          name: 'Test User',
        },
      };

      mockSignInEmail.mockResolvedValue(mockResponse);

      const result = await service.signIn(email, password);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        `AuthService: Signing in user with email: ${email}`,
      );
      expect(mockSignInEmail).toHaveBeenCalledWith({
        body: { email, password },
      });
      expect(result).toBe(mockResponse);
    });

    it('should log error and throw when signInEmail fails', async () => {
      const email = 'test@example.com';

      mockSignInEmail.mockRejectedValue(Error('Auth failed'));

      await expect(service.signIn(email, 'pass')).rejects.toThrow(
        'Auth failed',
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `AuthService: Error signing in user with email: ${email}`,
      );
    });
  });

  describe('signUp', () => {
    it('should call signUpEmail with correct parameters', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';

      const mockResponse = {
        user: {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          email,
          emailVerified: false,
          name,
        },
        token: null,
      };

      mockSignUpEmail.mockResolvedValue(mockResponse);

      const result = await service.signUp(name, email, password);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        `AuthService: Signing up user with email: ${email}`,
      );
      expect(mockSignUpEmail).toHaveBeenCalledWith({
        body: { name, email, password },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should log error and throw when signUpEmail fails', async () => {
      const email = 'john@example.com';
      const error = new Error('Signup failed');

      mockSignUpEmail.mockRejectedValue(error);

      await expect(service.signUp('John', email, 'pass')).rejects.toThrow(
        'Signup failed',
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `AuthService: Error signing up user with email: ${email}`,
      );
    });
  });

  describe('signOut', () => {
    it('should call signOut with correct headers', async () => {
      const token = 'valid-token';
      const mockResponse = { success: true };

      mockSignOut.mockResolvedValue(mockResponse);

      const result = await service.signOut(token);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'AuthService: Signing out user with token.',
      );
      expect(mockSignOut).toHaveBeenCalledWith({
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(result).toBe(mockResponse);
    });

    it('should log error and throw when signOut fails', async () => {
      const error = new Error('Signout failed');

      mockSignOut.mockRejectedValue(error);

      await expect(service.signOut('token')).rejects.toThrow('Signout failed');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'AuthService: Error signing out user with token',
      );
    });
  });
});
