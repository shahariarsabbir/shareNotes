import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { noteService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: '-likesCount', label: 'Most Liked' },
  { value: '-downloads', label: 'Most Downloaded' },
  { value: '-views', label: 'Most Viewed' },
];

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const subject = searchParams.get('subject') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page') || 1);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await noteService.getNotes({ search, subject, sort, page, limit: 12 });
      setNotes(data.notes);
      setPagination(data.pagination);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [search, subject, sort, page]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const setParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value;
    else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  const handleDelete = (id) => setNotes((prev) => prev.filter((n) => n._id !== id));

  return (
    <div className="notes-page">
      <div className="notes-page-header">
        <h1>Browse Notes</h1>
        <p>Find study materials shared by students like you</p>
      </div>

      <div className="notes-controls">
        <SearchBar onSearch={(q) => setParam('search', q)} />

        <div className="filter-row">
          <input
            className="filter-input"
            placeholder="Filter by subject..."
            value={subject}
            onChange={(e) => setParam('subject', e.target.value)}
          />
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {(search || subject) && (
          <div className="active-filters">
            {search && <span className="filter-tag">Search: "{search}" <button onClick={() => setParam('search', '')}>✕</button></span>}
            {subject && <span className="filter-tag">Subject: {subject} <button onClick={() => setParam('subject', '')}>✕</button></span>}
          </div>
        )}
      </div>

      {loading ? (
        <div className="notes-grid">
          {[...Array(12)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : notes.length > 0 ? (
        <>
          <p className="results-count">{pagination.total} notes found</p>
          <div className="notes-grid">
            {notes.map((note) => <NoteCard key={note._id} note={note} onDelete={handleDelete} />)}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setParam('page', String(page - 1))}
              >← Prev</button>
              <span className="page-info">Page {page} of {pagination.pages}</span>
              <button
                className="page-btn"
                disabled={page >= pagination.pages}
                onClick={() => setParam('page', String(page + 1))}
              >Next →</button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state large">
          <span className="empty-icon">📭</span>
          <h3>No notes found</h3>
          <p>Try a different search term or filter</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
