import { Icon } from './Icons.jsx';

export default function EmptyState({ searching, query, onAdd, onClear }) {
  return (
    <div className="empty">
      <span className="empty-icon"><Icon name={searching ? 'search' : 'users'} size={28} /></span>
      <h3>{searching ? `No contacts match “${query}”` : 'No contacts yet'}</h3>
      <p>
        {searching
          ? 'Check the spelling, or search by name, email, phone or company.'
          : 'Add your first contact to start building your address book.'}
      </p>
      {searching
        ? <button className="btn btn-ghost" onClick={onClear}>Clear search</button>
        : <button className="btn btn-primary" onClick={onAdd}><Icon name="plus" size={18} /> Add contact</button>}
    </div>
  );
}
