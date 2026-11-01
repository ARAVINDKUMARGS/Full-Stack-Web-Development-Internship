const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

// Mirrors the server-side Mongoose rules
export function validateContact(v) {
  const e = {};
  const name = v.name.trim();
  if (!name) e.name = 'Name is required';
  else if (name.length < 2) e.name = 'Name must be at least 2 characters';
  else if (name.length > 80) e.name = 'Name must be 80 characters or fewer';

  const email = v.email.trim();
  if (!email) e.email = 'Email is required';
  else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';
  else if (email.length > 120) e.email = 'Email must be 120 characters or fewer';

  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim()))
    e.phone = 'Enter a valid phone number (7-20 digits; + ( ) - allowed)';
  if (v.company.trim().length > 100) e.company = 'Company must be 100 characters or fewer';
  if (v.notes.trim().length > 500) e.notes = 'Notes must be 500 characters or fewer';
  return e;
}
