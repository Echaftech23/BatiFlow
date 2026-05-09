import * as Crypto from 'expo-crypto';

const CHARSET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';

export async function randomNonce(length = 32): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(length);
  let result = '';
  bytes.forEach((b) => {
    result += CHARSET[b % CHARSET.length];
  });
  return result;
}
