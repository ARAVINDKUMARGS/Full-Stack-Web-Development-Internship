// Offline tests: routing, id validation, error handling, CORS and schema validation.
// They need no database. Full CRUD is covered by scripts/api-test.js against a live DB.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { Contact } from '../src/models/Contact.js';

process.env.NODE_ENV = 'test';
let server, base;

test.before(() => {
  server = createApp(['http://localhost:5173']).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

test('GET / returns API welcome and health link', async () => {
  const res = await fetch(`${base}/`, { headers: { Accept: 'application/json' } });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.health, '/api/health');
});

test('GET /health and /api/health both return 200', async () => {
  const r1 = await fetch(`${base}/health`);
  assert.equal(r1.status, 200);
  const j1 = await r1.json();
  assert.equal(j1.status, 'ok');

  const r2 = await fetch(`${base}/api/health`);
  assert.equal(r2.status, 200);
  const j2 = await r2.json();
  assert.equal(j2.status, 'ok');
});

test('unknown route returns 404 JSON', async () => {
  const res = await fetch(`${base}/api/nope`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).success, false);
});

test('invalid ObjectId returns 400 on every :id route', async () => {
  for (const method of ['GET', 'PUT', 'DELETE']) {
    const res = await fetch(`${base}/api/contacts/not-an-id`, { method });
    assert.equal(res.status, 400, method);
    const json = await res.json();
    assert.equal(json.message, 'Invalid contact id');
  }
});

test('malformed JSON returns 400', async () => {
  const res = await fetch(`${base}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{bad json',
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.message, 'Request body is not valid JSON');
});

test('payload exceeding 10kb returns 413', async () => {
  const res = await fetch(`${base}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Asha', email: 'asha@example.com', notes: 'x'.repeat(15000) }),
  });
  assert.equal(res.status, 413);
  const json = await res.json();
  assert.equal(json.message, 'Request body is too large');
});

test('disallowed CORS origin is rejected with 403', async () => {
  const res = await fetch(`${base}/api/health`, { headers: { Origin: 'https://evil.example' } });
  assert.equal(res.status, 403);
});

test('whitelisted CORS origin is accepted with headers', async () => {
  const res = await fetch(`${base}/api/health`, { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});

test('wildcard CORS server accepts any origin', async () => {
  const wildcardServer = createApp(['*']).listen(0);
  const wildcardBase = `http://127.0.0.1:${wildcardServer.address().port}`;
  try {
    const res = await fetch(`${wildcardBase}/api/health`, { headers: { Origin: 'https://any-domain.com' } });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('access-control-allow-origin'), 'https://any-domain.com');
  } finally {
    wildcardServer.close();
  }
});

test('schema rejects bad input and normalises valid input', () => {
  const err = new Contact({ name: 'A', email: 'nope', phone: 'abc' }).validateSync();
  assert.ok(err.errors.name && err.errors.email && err.errors.phone);

  const ok = new Contact({ name: ' Asha Rao ', email: ' ASHA@Example.COM ', phone: '+91 98765 43210' });
  assert.equal(ok.validateSync(), undefined);
  assert.equal(ok.email, 'asha@example.com');
  assert.equal(ok.name, 'Asha Rao');
  assert.equal(ok.phone, '+91 98765 43210');
});

test('schema rejects oversized fields', () => {
  const errName = new Contact({ name: 'N'.repeat(81), email: 'valid@example.com' }).validateSync();
  assert.ok(errName.errors.name);

  const errEmail = new Contact({ name: 'Valid Name', email: 'a'.repeat(110) + '@example.com' }).validateSync();
  assert.ok(errEmail.errors.email);

  const errCompany = new Contact({ name: 'Valid Name', email: 'valid@example.com', company: 'C'.repeat(101) }).validateSync();
  assert.ok(errCompany.errors.company);

  const errNotes = new Contact({ name: 'Valid Name', email: 'valid@example.com', notes: 'X'.repeat(501) }).validateSync();
  assert.ok(errNotes.errors.notes);
});
