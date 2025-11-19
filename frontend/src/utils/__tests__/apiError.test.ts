import { normalizeApiError, getErrorMessage, NormalizedApiError } from '../apiError';

describe('apiError utilities', () => {
  it('normalizes string errors', () => {
    const error = normalizeApiError('Something went wrong');
    expect(error).toBeInstanceOf(NormalizedApiError);
    expect(error.message).toBe('Something went wrong');
  });

  it('normalizes generic objects', () => {
    const error = normalizeApiError({ message: 'Invalid request', status: 400 });
    expect(error.message).toBe('Invalid request');
    expect(error.status).toBe(400);
  });

  it('extracts message from Axios-like error', () => {
    const error = normalizeApiError({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          message: 'Validation failed',
          errors: {
            email: ['Email already exists']
          }
        }
      }
    });

    expect(error.message).toBe('Validation failed');
    expect(error.status).toBe(422);
    expect(error.details?.email).toEqual(['Email already exists']);
  });

  it('falls back when message missing', () => {
    const error = normalizeApiError({ code: 'UNKNOWN' });
    expect(error.message).toBe('An unexpected error occurred');
    expect(error.code).toBe('UNKNOWN');
  });

  it('getErrorMessage returns fallback when needed', () => {
    expect(getErrorMessage(null, 'Fallback')).toBe('Fallback');
    expect(getErrorMessage(new Error('Boom'), 'Fallback')).toBe('Boom');
  });
});

