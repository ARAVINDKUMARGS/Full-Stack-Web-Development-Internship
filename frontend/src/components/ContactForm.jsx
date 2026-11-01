import { useState } from 'react';
import Modal from './Modal.jsx';
import { createContact, updateContact } from '../api/contacts.js';
import { validateContact } from '../utils/validation.js';
import { useToast } from '../context/ToastContext.jsx';

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', required: true, maxLength: 80 },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true, maxLength: 120 },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', maxLength: 20 },
  { name: 'company', label: 'Company', type: 'text', autoComplete: 'organization', maxLength: 100 },
];

export default function ContactForm({ contact, onClose, onSaved }) {
  const editing = Boolean(contact);
  const toast = useToast();
  const [values, setValues] = useState({
    name: contact?.name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    company: contact?.company ?? '',
    notes: contact?.notes ?? '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function submit(e) {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setSaving(true);
    const body = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
    try {
      const saved = editing ? await updateContact(contact._id, body) : await createContact(body);
      toast.success(editing ? `Saved changes to ${saved.name}` : `Added ${saved.name}`);
      onSaved(saved);
    } catch (err) {
      if (err?.errors && Object.keys(err.errors).length) setErrors(err.errors);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={editing ? 'Edit contact' : 'Add contact'} onClose={onClose}>
      <form onSubmit={submit} noValidate className="form">
        <div className="form-grid">
          {FIELDS.map((f) => (
            <label key={f.name} className="field">
              <span>{f.label}{f.required && <em> *</em>}</span>
              <input
                name={f.name} type={f.type} value={values[f.name]} autoComplete={f.autoComplete}
                maxLength={f.maxLength} autoFocus={f.name === 'name'} aria-invalid={Boolean(errors[f.name])}
                onChange={(e) => set(f.name, e.target.value)}
              />
              {errors[f.name] && <small className="field-error">{errors[f.name]}</small>}
            </label>
          ))}
        </div>
        <label className="field">
          <span>Notes <small>{values.notes.length}/500</small></span>
          <textarea name="notes" rows="3" maxLength={500} value={values.notes} aria-invalid={Boolean(errors.notes)}
            onChange={(e) => set('notes', e.target.value)} />
          {errors.notes && <small className="field-error">{errors.notes}</small>}
        </label>
        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add contact'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
