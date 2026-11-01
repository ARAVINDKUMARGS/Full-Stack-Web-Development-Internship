import { useState } from 'react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({ contact, onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal title="Delete contact" onClose={onCancel}>
      <div className="form">
        <p>
          Delete <strong>{contact.name}</strong>? This permanently removes the contact and can’t be undone.
        </p>
        <footer className="modal-foot">
          <button className="btn btn-ghost" onClick={onCancel}>Keep contact</button>
          <button className="btn btn-danger" disabled={busy}
            onClick={async () => { setBusy(true); await onConfirm(); setBusy(false); }}>
            {busy ? 'Deleting…' : 'Delete contact'}
          </button>
        </footer>
      </div>
    </Modal>
  );
}
