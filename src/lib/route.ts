// import { InvalidCredentialsError } from '@/exceptions/InvalidCredentialsError';
import { APIError } from 'better-auth/api';
import Elysia from 'elysia';

export const createRoute = (prefix: string) =>
  new Elysia({ prefix })
    .error({
      // InvalidCredentialsError,
      APIError,
    })
    .onError(({ code, error: Error, set }) => {
      switch (code) {
        // case 'InvalidCredentialsError':
        //   set.status = Error.status;
        //   return { message: Error.message, error: true };
        case 'APIError':
          set.status = Error.statusCode;
          return { message: Error.message, error: true };
        case 'NOT_FOUND':
          set.status = Error.status;
          return { message: 'Unknown Page', error: true };
        default:
          set.status = 500;
          return {
            message: 'Internal Server Error',
            error: true,
          };
      }
    });
