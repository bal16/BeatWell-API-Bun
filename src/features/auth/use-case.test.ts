import { describe, it, expect, mock, beforeEach } from 'bun:test';

// 1. Mock dependencies
const mockSignIn = mock();
const mockSignUp = mock();
const mockSignOut = mock();

mock.module('@/services/auth.service', () => ({
  authService: {
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: mockSignOut,
  },
}));

const mockLogger = {
  debug: mock(),
};

mock.module('@/plugins/logger', () => ({
  logger: mockLogger,
}));

// 2. Import features dynamically to ensure mocks are applied
const { signIn } = await import('./sign-in');
const { signOut } = await import('./sign-out');
const { signUp } = await import('./sign-up');

describe('Auth Features', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignUp.mockReset();
    mockSignOut.mockReset();
    mockLogger.debug.mockClear();
  });

  describe('signIn', () => {
    it('should delegate to authService.signIn', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = {
        redirect: false,
        token: 'adjbaskd',
        user: {
          id: '1',
          email: dto.email,
          name: 'Test User',
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: false,
        },
      };

      mockSignIn.mockResolvedValue(expectedResult);

      const result = await signIn(dto);

      expect(mockSignIn).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toBe(expectedResult);
    });

    it('should propagate errors', async () => {
      const dto = { email: 'test@example.com', password: 'wrong' };
      mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

      await expect(signIn(dto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('should log debug and delegate to authService.signUp', async () => {
      const dto = { name: 'John', email: 'john@example.com', password: 'pass' };
      const expectedResult = {
        token: null,
        user: {
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          email: dto.email,
          emailVerified: false,
          name: dto.name,
        },
      };

      mockSignUp.mockResolvedValue(expectedResult);

      const result = await signUp(dto);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        `Signing up user with email: ${dto.email}`,
      );
      expect(mockSignUp).toHaveBeenCalledWith(
        dto.name,
        dto.email,
        dto.password,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('signOut', () => {
    it('should delegate to authService.signOut', async () => {
      const token = 'valid-token-string';
      const expectedResult = { success: true };

      mockSignOut.mockResolvedValue(expectedResult);

      const result = await signOut(token);

      expect(mockSignOut).toHaveBeenCalledWith(token);
      expect(result).toBe(expectedResult);
    });
  });
});
