import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noteService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const [recentNotes, setRecentNotes] = useState([]);
  const [popularNotes, setPopularNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const [recent, popular] = await Promise.all([
          noteService.getNotes({ sort: '-createdAt', limit: 6 }),
          noteService.getNotes({ sort: '-likesCount', limit: 3 }),
        ]);
        setRecentNotes(recent.data.notes);
        setPopularNotes(popular.data.notes);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleSearch = (q) => {
    window.location.href = `/notes?search=${encodeURIComponent(q)}`;
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎓 Free for students</div>
          <h1 className="hero-title">
            Share Notes,<br />
            <span className="hero-accent">Ace Together</span>
          </h1>
          <p className="hero-subtitle">
            Upload your lecture notes, find what others have shared, and build a smarter study community.
          </p>
          <SearchBar onSearch={handleSearch} />
          <div className="hero-cta">
            {user ? (
              <Link to="/upload" className="btn-hero-primary">📤 Upload a Note</Link>
            ) : (
              <>
                <Link to="/register" className="btn-hero-primary">Get Started Free</Link>
                <Link to="/notes" className="btn-hero-ghost">Browse Notes</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="note-stack">
            <div className="note-preview n1">📄 Data Structures Notes</div>
            <div className="note-preview n2">📊 Calculus Cheat Sheet</div>
            <div className="note-preview n3">📝 Physics Lab Report</div>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="stats-banner">
        <div className="stat-item"><span className="stat-num">500+</span><span className="stat-label">Notes Shared</span></div>
        <div className="stat-item"><span className="stat-num">200+</span><span className="stat-label">Students</span></div>
        <div className="stat-item"><span className="stat-num">50+</span><span className="stat-label">Subjects</span></div>
        <div className="stat-item"><span className="stat-num">Free</span><span className="stat-label">Always</span></div>
      </section>

      {/* Recent Notes */}
      <section className="section">
        <div className="section-header">
          <h2>Recently Uploaded</h2>
          <Link to="/notes" className="see-all">View all →</Link>
        </div>
        {loading ? (
          <div className="notes-grid skeleton-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : recentNotes.length > 0 ? (
          <div className="notes-grid">
            {recentNotes.map((note) => <NoteCard key={note._id} note={note} />)}
          </div>
        ) : (
          <div className="empty-state">
            <p>No notes yet. Be the first to upload!</p>
            <Link to="/upload" className="btn-primary">Upload Now</Link>
          </div>
        )}
      </section>

      {/* Popular Notes */}
      {popularNotes.length > 0 && (
        <section className="section popular-section">
          <div className="section-header">
            <h2>🔥 Most Liked</h2>
            <Link to="/notes?sort=-likesCount" className="see-all">See more →</Link>
          </div>
          <div className="notes-grid notes-grid-3">
            {popularNotes.map((note) => <NoteCard key={note._id} note={note} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <h2>Start sharing today</h2>
          <p>Join hundreds of students already sharing their best notes.</p>
          <Link to="/register" className="btn-hero-primary">Create Free Account</Link>
        </section>
      )}
    </div>
  );
};

export default Home;
