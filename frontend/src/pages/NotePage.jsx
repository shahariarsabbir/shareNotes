import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { formatDate, formatFileSize } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const StarPicker = ({ value, onChange }) => (
  <div className="star-picker">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        className={`star-pick ${s <= value ? 'active' : ''}`}
        onClick={() => onChange(s)}
      >★</button>
    ))}
  </div>
);

const NoteDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await noteService.getNoteById(id);
        setNote(data.note);
        setLiked(data.note.likes?.includes(user?._id));
        setLikesCount(data.note.likesCount || 0);
      } catch {
        toast.error('Note not found');
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) return toast.error('Log in to like notes');
    const { data } = await noteService.toggleLike(id);
    setLiked(data.liked);
    setLikesCount(data.likesCount);
  };

  const handleDownload = async () => {
    await noteService.incrementDownload(id);
    window.open(note.fileUrl, '_blank');
    setNote((prev) => ({ ...prev, downloads: prev.downloads + 1 }));
  };

  const handleRate = async () => {
    if (!user) return toast.error('Log in to rate notes');
    if (!rating) return toast.error('Select a rating');
    setSubmittingRating(true);
    try {
      const { data } = await noteService.rateNote(id, rating);
      setNote((prev) => ({ ...prev, rating: data.rating }));
      toast.success('Rating submitted!');
    } catch {
      toast.error('Could not submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner large" /></div>;
  if (!note) return null;

  return (
    <div className="note-detail-page">
      <div className="note-detail-main">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/notes">Notes</Link>
          <span>›</span>
          <span>{note.subject}</span>
        </div>

        {/* Title section */}
        <div className="note-detail-header">
          <div>
            <span className="detail-subject">{note.subject}</span>
            {note.semester && <span className="detail-semester">{note.semester} Semester</span>}
            <h1>{note.title}</h1>
            <p className="note-detail-desc">{note.description}</p>
          </div>
        </div>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="note-tags">
            {note.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
          </div>
        )}

        {/* File preview card */}
        <div className="file-card">
          <div className="file-info">
            <span className="file-icon-xl">📄</span>
            <div>
              <p className="file-name">{note.fileName || 'Uploaded File'}</p>
              <p className="file-meta">{note.fileType?.split('/')[1]?.toUpperCase()} · {formatFileSize(note.fileSize)}</p>
            </div>
          </div>
          <button className="btn-download" onClick={handleDownload}>
            ⬇ Download
          </button>
        </div>

        {/* Rating */}
        <div className="rating-section">
          <h3>Rate this note</h3>
          {note.rating?.count > 0 && (
            <p className="current-rating">
              Average: <strong>{note.rating.average.toFixed(1)} / 5</strong> from {note.rating.count} rating{note.rating.count !== 1 ? 's' : ''}
            </p>
          )}
          {user && (
            <div className="rate-form">
              <StarPicker value={rating} onChange={setRating} />
              <button className="btn-rate" onClick={handleRate} disabled={submittingRating || !rating}>
                Submit Rating
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="note-detail-sidebar">
        {/* Actions */}
        <div className="sidebar-card">
          <div className="action-buttons">
            <button className={`action-btn like ${liked ? 'liked' : ''}`} onClick={handleLike}>
              {liked ? '❤️' : '🤍'} {likesCount} Like{likesCount !== 1 ? 's' : ''}
            </button>
            <button className="action-btn download" onClick={handleDownload}>
              ⬇ Download
            </button>
          </div>
          <div className="note-meta-stats">
            <span>👁 {note.views} views</span>
            <span>⬇ {note.downloads} downloads</span>
            <span>📅 {formatDate(note.createdAt)}</span>
          </div>
        </div>

        {/* Author */}
        <div className="sidebar-card author-card">
          <h3>Uploaded by</h3>
          <Link to={`/profile/${note.uploadedBy?._id}`} className="author-profile-link">
            <div className="author-avatar-md">
              {note.uploadedBy?.avatar ? (
                <img src={note.uploadedBy.avatar} alt={note.uploadedBy.name} />
              ) : (
                <span>{note.uploadedBy?.name?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="author-name-lg">{note.uploadedBy?.name}</p>
              {note.uploadedBy?.university && (
                <p className="author-uni">{note.uploadedBy.university}</p>
              )}
              {note.uploadedBy?.department && (
                <p className="author-dept">{note.uploadedBy.department}</p>
              )}
            </div>
          </Link>
          {note.uploadedBy?.bio && <p className="author-bio">{note.uploadedBy.bio}</p>}
          <Link to={`/profile/${note.uploadedBy?._id}`} className="btn-ghost-sm">View Profile →</Link>
        </div>
      </aside>
    </div>
  );
};

export default NoteDetailPage;
