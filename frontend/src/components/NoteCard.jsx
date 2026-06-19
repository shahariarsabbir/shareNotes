import { useState } from 'react';
import { Link } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { timeAgo, formatFileSize } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const FILE_ICONS = {
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-powerpoint': '📊',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
  'text/plain': '📃',
  default: '📁',
};

const getFileIcon = (type) => FILE_ICONS[type] || FILE_ICONS.default;

const StarRating = ({ value }) => (
  <span className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(value) ? 'star filled' : 'star'}>★</span>
    ))}
  </span>
);

const NoteCard = ({ note, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(note.likes?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(note.likesCount || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Log in to like notes');
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await noteService.toggleLike(note._id);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch {
      toast.error('Could not update like');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm('Delete this note permanently?')) return;
    try {
      await noteService.deleteNote(note._id);
      toast.success('Note deleted');
      onDelete?.(note._id);
    } catch {
      toast.error('Could not delete note');
    }
  };

  const isOwner = user && note.uploadedBy?._id === user._id;

  return (
    <Link to={`/notes/${note._id}`} className="note-card">
      <div className="note-card-header">
        <span className="file-icon">{getFileIcon(note.fileType)}</span>
        <div className="note-meta-top">
          <span className="note-subject">{note.subject}</span>
          {note.semester && <span className="note-semester">{note.semester}</span>}
        </div>
        {isOwner && (
          <button className="delete-btn" onClick={handleDelete} title="Delete note">🗑</button>
        )}
      </div>

      <h3 className="note-title">{note.title}</h3>
      <p className="note-description">{note.description}</p>

      {note.tags?.length > 0 && (
        <div className="note-tags">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="note-card-footer">
        <div className="note-author">
          <div className="author-avatar-sm">
            {note.uploadedBy?.avatar ? (
              <img src={note.uploadedBy.avatar} alt="" />
            ) : (
              <span>{note.uploadedBy?.name?.charAt(0)?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <span className="author-name">{note.uploadedBy?.name}</span>
            <span className="note-time">{timeAgo(note.createdAt)}</span>
          </div>
        </div>

        <div className="note-stats">
          {note.rating?.count > 0 && (
            <span className="stat">
              <StarRating value={note.rating.average} />
              <small>({note.rating.count})</small>
            </span>
          )}
          <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            {liked ? '❤️' : '🤍'} {likesCount}
          </button>
          <span className="stat">👁 {note.views || 0}</span>
          <span className="stat">⬇ {note.downloads || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
