import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwn = currentUser?._id === id;

  useEffect(() => {
    const fetch = async () => {
      try {
        const [profileRes, notesRes] = await Promise.all([
          userService.getUserById(id),
          userService.getUserNotes(id),
        ]);
        setProfile(profileRes.data.user);
        setNotes(notesRes.data.notes);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="loading-page"><div className="spinner large" /></div>;
  if (!profile) return <div className="not-found">User not found.</div>;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-lg">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} />
          ) : (
            <span>{profile.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          {profile.university && <p className="profile-uni">🏫 {profile.university}</p>}
          {profile.department && <p className="profile-dept">📚 {profile.department}</p>}
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <p className="profile-joined">Joined {formatDate(profile.createdAt)}</p>
        </div>
        <div className="profile-stats">
          <div className="pstat">
            <span className="pstat-val">{profile.totalNotes || 0}</span>
            <span className="pstat-lbl">Notes</span>
          </div>
          <div className="pstat">
            <span className="pstat-val">{profile.totalLikesReceived || 0}</span>
            <span className="pstat-lbl">Likes</span>
          </div>
        </div>
        {isOwn && (
          <Link to="/dashboard" className="btn-ghost-sm">Edit Profile</Link>
        )}
      </div>

      {/* Notes */}
      <div className="section">
        <h2>{isOwn ? 'My Notes' : `${profile.name.split(' ')[0]}'s Notes`}</h2>
        {notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map((note) => <NoteCard key={note._id} note={note} />)}
          </div>
        ) : (
          <div className="empty-state">
            <p>No notes uploaded yet.</p>
            {isOwn && <Link to="/upload" className="btn-primary">Upload your first note</Link>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
