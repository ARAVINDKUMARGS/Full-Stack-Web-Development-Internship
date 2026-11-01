import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import Avatar from './Avatar.jsx';
import { Icon } from './Icons.jsx';
import { getContact } from '../api/contacts.js';
import { formatDateTime } from '../utils/format.js';

function Row({ icon, label, children }) {
  return (
    <div className="detail-row">
      <Icon name={icon} size={18} />
      <div><small>{label}</small><p>{children || <span className="muted">Not provided</span>}</p></div>
    </div>
  );
}

export default function ContactDetails({ id, initial, onClose, onEdit, onDelete }) {
  const [contact, setContact] = useState(initial);
  const [error, setError] = useState('');

  // Fetch the latest copy via GET /api/contacts/:id
  useEffect(() => {
    let live = true;
    getContact(id).then((c) => live && setContact(c)).catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [id]);

  return (
    <Modal title="Contact details" onClose={onClose} variant="drawer">
      {error && <p className="banner banner-error">{error}</p>}
      {!contact && !error && (
        <div className="details" aria-busy="true" aria-label="Loading contact details">
          <div className="details-hero">
            <span className="sk sk-circle" style={{ width: 64, height: 64 }} />
            <span className="sk sk-line w40" style={{ height: 20, marginTop: 12 }} />
            <span className="sk sk-line w30" style={{ height: 14, marginTop: 6 }} />
          </div>
          <span className="sk sk-line w80" style={{ height: 18, marginTop: 12 }} />
          <span className="sk sk-line w60" style={{ height: 18, marginTop: 12 }} />
          <span className="sk sk-line w50" style={{ height: 18, marginTop: 12 }} />
        </div>
      )}
      {contact && (
        <div className="details">
          <div className="details-hero">
            <Avatar name={contact.name} size={64} />
            <h3>{contact.name}</h3>
            {contact.company && <p className="muted">{contact.company}</p>}
          </div>
          <Row icon="mail" label="Email"><a href={`mailto:${contact.email}`}>{contact.email}</a></Row>
          <Row icon="phone" label="Phone">
            {contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
          </Row>
          <Row icon="building" label="Company">{contact.company}</Row>
          <Row icon="note" label="Notes">{contact.notes}</Row>
          <p className="stamp">Added {formatDateTime(contact.createdAt)} · Updated {formatDateTime(contact.updatedAt)}</p>
          <footer className="modal-foot">
            <button className="btn btn-danger-ghost" onClick={() => onDelete(contact)}>
              <Icon name="trash" size={16} /> Delete
            </button>
            <button className="btn btn-primary" onClick={() => onEdit(contact)}>
              <Icon name="edit" size={16} /> Edit
            </button>
          </footer>
        </div>
      )}
    </Modal>
  );
}
