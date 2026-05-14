import { test } from 'node:test';
import assert from 'node:assert';
import { apiResponse } from '../lib/apiResponse.js';

test('apiResponse formats data correctly with default values', () => {
  const result = apiResponse();
  assert.deepStrictEqual(result, { data: null, error: null, message: '' });
});

test('apiResponse formats data correctly with provided values', () => {
  const result = apiResponse({ user: 1 }, 'Not Found', 'Error occurred');
  assert.deepStrictEqual(result, { data: { user: 1 }, error: 'Not Found', message: 'Error occurred' });
});
