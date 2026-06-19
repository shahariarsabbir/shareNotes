import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ notes: 0, likes: 0, views: 0, downloads: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const { data } = await userService.getUserNotes(user._id, { limit: 50 });
        setNotes(data.notes);

        const totals = data.notes.reduce(
          (acc, n) => ({
            notes: acc.notes + 1,
            likes: acc.likes + (n.likesCount || 0),
            views: acc.views + (n.views || 0),
            downloads: acc.downloads + (n.downloads || 0),
          }),
          { notes: 0, likes: 0, views: 0, downloads: 0 }
        );
        setStats(totals);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDelete = (id) => setNotes((prev) => prev.filter((n) => n._id !== id));

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <div className="welcome-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1>Welcome, {user.name.split(' ')[0]}!</h1>
            <p>{user.university || 'NoteShare Student'} {user.department ? `· ${user.department}` : ''}</p>
          </div>
        </div>
        <Link to="/upload" className="btn-primary">📤 Upload New Note</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📄</span>
          <span className="stat-value">{stats.notes}</span>
          <span className="stat-label">Notes Uploaded</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">❤️</span>
          <span className="stat-value">{stats.likes}</span>
          <span className="stat-label">Total Likes</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👁</span>
          <span className="stat-value">{stats.views}</span>
          <span className="stat-label">Total Views</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⬇</span>
          <span className="stat-value">{stats.downloads}</span>
          <span className="stat-label">Downloads</span>
        </div>
      </div>

      {/* My Notes */}
      <div className="dashboard-section">
        <h2>My Notes</h2>
        {loading ? (
          <div className="notes-grid">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map((note) => <NoteCard key={note._id} note={note} onDelete={handleDelete} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No notes yet</h3>
            <p>Upload your first note and start helping others!</p>
            <Link to="/upload" className="btn-primary">Upload Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
