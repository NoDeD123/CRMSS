import { test } from 'node:test';
import assert from 'node:assert';
import { signToken, verifyToken } from '../lib/auth.js';

test('auth - token generation and verification works', () => {
  const payload = { userId: 123, role: 'USER' };
  const token = signToken(payload);

  assert.ok(typeof token === 'string', 'Token should be a string');

  const decoded = verifyToken(token);
  assert.strictEqual(decoded.userId, 123);
  assert.strictEqual(decoded.role, 'USER');
});

test('auth - verifyToken returns null for invalid token', () => {
  const decoded = verifyToken('invalid-token-string');
  assert.strictEqual(decoded, null);
});
