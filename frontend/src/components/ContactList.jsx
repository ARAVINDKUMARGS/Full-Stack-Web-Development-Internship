import Avatar from './Avatar.jsx';
import { Icon } from './Icons.jsx';
import { formatDate } from '../utils/format.js';

function Actions({ c, onEdit, onDelete }) {
  return (
    <div className="actions" onClick={(e) => e.stopPropagation()}>
      <button className="icon-btn" onClick={() => onEdit(c)} aria-label={`Edit ${c.name}`}><Icon name="edit" size={17} /></button>
      <button className="icon-btn danger" onClick={() => onDelete(c)} aria-label={`Delete ${c.name}`}><Icon name="trash" size={17} /></button>
    </div>
  );
}

export function ContactGrid({ contacts, onOpen, onEdit, onDelete }) {
  return (
    <div className="grid">
      {contacts.map((c) => (
        <article key={c._id} className="card clickable" tabIndex={0}
          onClick={() => onOpen(c)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen(c);
            }
          }}>
          <div className="card-top">
            <Avatar name={c.name} size={46} />
            <div className="card-id"><h3>{c.name}</h3><p className="muted">{c.company || 'No company'}</p></div>
            <Actions c={c} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <p className="meta"><Icon name="mail" size={15} /> <span>{c.email}</span></p>
          <p className="meta"><Icon name="phone" size={15} /> <span>{c.phone || 'No phone'}</span></p>
        </article>
      ))}
    </div>
  );
}

export function ContactTable({ contacts, onOpen, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Added</th><th><span className="sr">Actions</span></th></tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id} tabIndex={0} onClick={() => onOpen(c)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpen(c);
                }
              }}>
              <td><span className="cell-name"><Avatar name={c.name} size={32} />{c.name}</span></td>
              <td>{c.email}</td>
              <td>{c.phone || <span className="muted">—</span>}</td>
              <td>{c.company || <span className="muted">—</span>}</td>
              <td className="muted">{formatDate(c.createdAt)}</td>
              <td><Actions c={c} onEdit={onEdit} onDelete={onDelete} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
