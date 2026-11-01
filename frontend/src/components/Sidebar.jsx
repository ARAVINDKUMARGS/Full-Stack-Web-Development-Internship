import { Icon } from './Icons.jsx';

export default function Sidebar({ open, onClose, onAdd, total }) {
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><Icon name="users" size={20} /></span>
          <div className="brand-text">
            <strong>Contact Manager</strong>
            <small>Invexom workspace</small>
          </div>
          <button className="icon-btn mobile-close-btn" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={18} />
          </button>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => { onClose(); onAdd(); }}>
          <Icon name="plus" size={18} /> Add contact
        </button>
        <nav aria-label="Main">
          <a className="nav-item active" href="#contacts" aria-current="page">
            <Icon name="users" size={18} /> All contacts
            {total != null && <span className="pill">{total}</span>}
          </a>
        </nav>
        <p className="sidebar-foot">Contacts sync live with your MongoDB Atlas database.</p>
      </aside>
    </>
  );
}
