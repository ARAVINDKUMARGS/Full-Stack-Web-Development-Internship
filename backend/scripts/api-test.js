#!/usr/bin/env node
// Cross-platform end-to-end API test against a running server with a real database.
// Usage: node scripts/api-test.js
// Or:    BASE_URL=http://localhost:5000/api node scripts/api-test.js

const BASE = (process.env.BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const EMAIL = `e2e.${Date.now()}.${Math.random().toString(36).slice(2, 7)}@example.com`;
const UPPER_EMAIL = EMAIL.toUpperCase();

let pass = 0;
let fail = 0;

function check(title, condition, details = '') {
  if (condition) {
    console.log(`\x1b[32mPASS\x1b[0m  ${title}`);
    pass++;
  } else {
    console.error(`\x1b[31mFAIL\x1b[0m  ${title} ${details ? `(${details})` : ''}`);
    fail++;
  }
}

async function run() {
  console.log(`\nStarting End-to-End API Tests against: ${BASE}\n`);

  // 1. Health check
  try {
    const res = await fetch(`${BASE}/health`);
    const data = await res.json();
    check('Health endpoint returns 200 and ok', res.status === 200 && data.status === 'ok', `status: ${res.status}`);
  } catch (err) {
    check('Health endpoint reachable', false, err.message);
    console.error('Cannot reach backend server. Make sure it is running on ' + BASE);
    process.exit(1);
  }

  // 2. Create contact
  let createdId = null;
  try {
    const res = await fetch(`${BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invexom Tester',
        email: EMAIL,
        phone: '+91 98765 43210',
        company: 'Invexom Global',
        notes: 'Integration test automated record',
      }),
    });
    const body = await res.json();
    createdId = body.data?._id;
    check('Create contact returns 201 with created object', res.status === 201 && Boolean(createdId), `status: ${res.status}`);
  } catch (err) {
    check('Create contact', false, err.message);
  }

  // 3. Duplicate email (case-insensitive check)
  try {
    const res = await fetch(`${BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another User',
        email: UPPER_EMAIL,
      }),
    });
    const body = await res.json();
    check('Duplicate email returns 409 Conflict', res.status === 409 && body.errors?.email, `status: ${res.status}`);
  } catch (err) {
    check('Duplicate email check', false, err.message);
  }

  // 4. Invalid creation payload
  try {
    const res = await fetch(`${BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'invalid-email' }),
    });
    const body = await res.json();
    check('Invalid payload returns 400 Bad Request with field errors', res.status === 400 && body.errors?.name && body.errors?.email, `status: ${res.status}`);
  } catch (err) {
    check('Invalid payload test', false, err.message);
  }

  // 5. List contacts
  try {
    const res = await fetch(`${BASE}/contacts`);
    const body = await res.json();
    check('List contacts returns 200 with pagination', res.status === 200 && Array.isArray(body.data) && Boolean(body.pagination), `status: ${res.status}`);
  } catch (err) {
    check('List contacts', false, err.message);
  }

  // 6. Search by email
  try {
    const res = await fetch(`${BASE}/contacts?search=${encodeURIComponent(EMAIL)}`);
    const body = await res.json();
    const found = body.data?.some((c) => c.email.toLowerCase() === EMAIL.toLowerCase());
    check('Search by email finds created contact', res.status === 200 && found, `status: ${res.status}`);
  } catch (err) {
    check('Search by email', false, err.message);
  }

  // 7. Search by name
  try {
    const res = await fetch(`${BASE}/contacts?search=Invexom+Tester`);
    const body = await res.json();
    const found = body.data?.some((c) => c._id === createdId);
    check('Search by name finds created contact', res.status === 200 && found, `status: ${res.status}`);
  } catch (err) {
    check('Search by name', false, err.message);
  }

  // 8. Search by phone
  try {
    const res = await fetch(`${BASE}/contacts?search=98765`);
    const body = await res.json();
    const found = body.data?.some((c) => c._id === createdId);
    check('Search by phone finds created contact', res.status === 200 && found, `status: ${res.status}`);
  } catch (err) {
    check('Search by phone', false, err.message);
  }

  // 9. Search by company
  try {
    const res = await fetch(`${BASE}/contacts?search=Invexom+Global`);
    const body = await res.json();
    const found = body.data?.some((c) => c._id === createdId);
    check('Search by company finds created contact', res.status === 200 && found, `status: ${res.status}`);
  } catch (err) {
    check('Search by company', false, err.message);
  }

  // 10. Get contact by ID
  if (createdId) {
    try {
      const res = await fetch(`${BASE}/contacts/${createdId}`);
      const body = await res.json();
      check('Get contact by ID returns 200 with details', res.status === 200 && body.data?._id === createdId, `status: ${res.status}`);
    } catch (err) {
      check('Get contact by ID', false, err.message);
    }
  }

  // 11. Update contact
  if (createdId) {
    try {
      const res = await fetch(`${BASE}/contacts/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: 'Invexom Technologies Inc' }),
      });
      const body = await res.json();
      check('Update contact returns 200 with updated field', res.status === 200 && body.data?.company === 'Invexom Technologies Inc', `status: ${res.status}`);
    } catch (err) {
      check('Update contact', false, err.message);
    }
  }

  // 12. Update with invalid email
  if (createdId) {
    try {
      const res = await fetch(`${BASE}/contacts/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad-email-format' }),
      });
      check('Update with invalid email returns 400', res.status === 400, `status: ${res.status}`);
    } catch (err) {
      check('Update invalid email', false, err.message);
    }
  }

  // 13. Invalid ObjectId format
  try {
    const res = await fetch(`${BASE}/contacts/invalid-id-12345`);
    const body = await res.json();
    check('Invalid ObjectId returns 400', res.status === 400 && body.message === 'Invalid contact id', `status: ${res.status}`);
  } catch (err) {
    check('Invalid ObjectId', false, err.message);
  }

  // 14. Nonexistent ObjectId
  try {
    const res = await fetch(`${BASE}/contacts/507f1f77bcf86cd799439011`);
    check('Nonexistent ObjectId returns 404', res.status === 404, `status: ${res.status}`);
  } catch (err) {
    check('Nonexistent ObjectId', false, err.message);
  }

  // 15. Delete contact
  if (createdId) {
    try {
      const res = await fetch(`${BASE}/contacts/${createdId}`, { method: 'DELETE' });
      const body = await res.json();
      check('Delete contact returns 200', res.status === 200 && body.success === true, `status: ${res.status}`);
    } catch (err) {
      check('Delete contact', false, err.message);
    }
  }

  // 16. Verify deleted contact returns 404
  if (createdId) {
    try {
      const res = await fetch(`${BASE}/contacts/${createdId}`);
      check('Get deleted contact returns 404', res.status === 404, `status: ${res.status}`);
    } catch (err) {
      check('Get deleted contact', false, err.message);
    }
  }

  // 17. Disallowed CORS origin returns 403
  try {
    const res = await fetch(`${BASE}/health`, {
      headers: { Origin: 'https://disallowed-origin.example.com' },
    });
    check('Disallowed CORS origin returns 403', res.status === 403, `status: ${res.status}`);
  } catch (err) {
    check('CORS rejection', false, err.message);
  }

  // 18. Malformed JSON returns 400
  try {
    const res = await fetch(`${BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"unclosed_json: true',
    });
    check('Malformed JSON body returns 400', res.status === 400, `status: ${res.status}`);
  } catch (err) {
    check('Malformed JSON', false, err.message);
  }

  console.log(`\n========================================`);
  console.log(`End-to-End Test Summary:`);
  console.log(`Passed: \x1b[32m${pass}\x1b[0m | Failed: \x1b[${fail ? '31' : '32'}m${fail}\x1b[0m`);
  console.log(`========================================\n`);

  process.exitCode = fail === 0 ? 0 : 1;
}

run();
