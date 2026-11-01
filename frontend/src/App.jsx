import { useCallback, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import { Icon } from './components/Icons.jsx';
import { ContactGrid, ContactTable } from './components/ContactList.jsx';
import ContactForm from './components/ContactForm.jsx';
import ContactDetails from './components/ContactDetails.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import EmptyState from './components/EmptyState.jsx';
import { CardSkeletons, TableSkeletons } from './components/Skeletons.jsx';
import { listContacts, deleteContact } from './api/contacts.js';
import useDebounce from './hooks/useDebounce.js';
import { useToast } from './context/ToastContext.jsx';

const PAGE_SIZE = 12;

export default function App() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');
  const [reloadKey, setReloadKey] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  // modal state: { type: 'form' | 'details' | 'delete', contact? }
  const [modal, setModal] = useState(null);

  const query = useDebounce(search.trim());
  useEffect(() => setPage(1), [query]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError('');
    listContacts({ search: query || undefined, page, limit: PAGE_SIZE }, ctrl.signal)
      .then((res) => {
        setContacts(res.data);
        setPagination(res.pagination);
        // If the last item on a page was deleted, step back one page
        if (res.data.length === 0 && page > 1) setPage(page - 1);
      })
      .catch((err) => {
        if (!ctrl.signal.aborted) setError(err.message);
      })
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, [query, page, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  const close = useCallback(() => setModal(null), []);

  async function confirmDelete() {
    const c = modal.contact;
    try {
      await deleteContact(c._id);
      toast.success(`Deleted ${c.name}`);
      close();
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const List = view === 'grid' ? ContactGrid : ContactTable;
  const total = pagination?.total;
  const searching = Boolean(query);

  return (
    <div className="shell">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} onAdd={() => setModal({ type: 'form' })}
        total={searching ? undefined : total} />

      <main className="main" id="contacts">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setNavOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <div className="title">
            <h1>Contacts</h1>
            <p className="muted">
              {total == null ? ' ' : searching
                ? `${total} result${total === 1 ? '' : 's'} for “${query}”`
                : `${total} contact${total === 1 ? '' : 's'} in your address book`}
            </p>
          </div>
          <button className="btn btn-primary desktop-only" onClick={() => setModal({ type: 'form' })}>
            <Icon name="plus" size={18} /> Add contact
          </button>
        </header>

        <div className="toolbar">
          <label className="search">
            <Icon name="search" size={18} />
            <input type="search" placeholder="Search by name, email, phone or company"
              value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search contacts" />
          </label>
          <div className="segmented" role="group" aria-label="Layout">
            <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="Card view" aria-pressed={view === 'grid'}><Icon name="grid" size={18} /></button>
            <button className={view === 'table' ? 'on' : ''} onClick={() => setView('table')} aria-label="Table view" aria-pressed={view === 'table'}><Icon name="list" size={18} /></button>
          </div>
        </div>

        {error ? (
          <div className="empty">
            <span className="empty-icon danger"><Icon name="alert" size={28} /></span>
            <h3>Couldn’t load contacts</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={reload}>Try again</button>
          </div>
        ) : loading && contacts.length === 0 ? (
          view === 'grid' ? <CardSkeletons /> : <TableSkeletons />
        ) : contacts.length === 0 ? (
          <EmptyState searching={searching} query={query} onAdd={() => setModal({ type: 'form' })} onClear={() => setSearch('')} />
        ) : (
          <div className={loading ? 'refreshing' : ''}>
            <List
              contacts={contacts}
              onOpen={(c) => setModal({ type: 'details', contact: c })}
              onEdit={(c) => setModal({ type: 'form', contact: c })}
              onDelete={(c) => setModal({ type: 'delete', contact: c })}
            />
            {pagination && pagination.pages > 1 && (
              <nav className="pager" aria-label="Pagination">
                <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <Icon name="left" size={16} /> Previous
                </button>
                <span className="muted">Page {pagination.page} of {pagination.pages}</span>
                <button className="btn btn-ghost" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>
                  Next <Icon name="right" size={16} />
                </button>
              </nav>
            )}
          </div>
        )}
      </main>

      <button className="fab" onClick={() => setModal({ type: 'form' })} aria-label="Add contact"><Icon name="plus" size={24} /></button>

      {modal?.type === 'form' && (
        <ContactForm contact={modal.contact} onClose={close} onSaved={() => { close(); reload(); }} />
      )}
      {modal?.type === 'details' && (
        <ContactDetails id={modal.contact._id} initial={modal.contact} onClose={close}
          onEdit={(c) => setModal({ type: 'form', contact: c })}
          onDelete={(c) => setModal({ type: 'delete', contact: c })} />
      )}
      {modal?.type === 'delete' && (
        <ConfirmDialog contact={modal.contact} onCancel={close} onConfirm={confirmDelete} />
      )}
    </div>
  );
}
