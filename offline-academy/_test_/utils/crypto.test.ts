import { encrypt, decrypt, generateMasterKey } from '@/utils/crypto';

describe('crypto utilities', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.MASTER_KEY = generateMasterKey();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('encrypts and decrypts text correctly', () => {
    const text = 'super-secret-value';

    const encrypted = encrypt(text);
    expect(encrypted).toContain(':');

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  test('throws error when MASTER_KEY is missing', () => {
    delete process.env.MASTER_KEY;

    expect(() => encrypt('data')).toThrow('Encryption failed');
  });
});
