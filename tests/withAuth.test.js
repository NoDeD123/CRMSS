import { test } from 'node:test';
import assert from 'node:assert';
import { withAuth } from '../lib/withAuth.js';
import * as auth from '../lib/auth.js';

test('withAuth middleware - missing token', async () => {
  const req = { cookies: {} };
  const res = {
    status: (code) => {
      assert.strictEqual(code, 401);
      return { json: (data) => assert.strictEqual(data.error, 'Authentication token missing') };
    }
  };

  const handler = async (req, res) => {};
  const protectedHandler = withAuth(handler);
  await protectedHandler(req, res);
});
