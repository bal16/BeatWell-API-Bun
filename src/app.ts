import { Elysia } from 'elysia';

export const createApp = () => {
  return (
    new Elysia()
      // .decorate('ai',)

      .onError(({ code, error }) => {
        return { status: 'error', code, message: error };
      })
      .get('/', () => ({ status: 'ok', backend: 'tensorflow-wasm' }))
  );
};
