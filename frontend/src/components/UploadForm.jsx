import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { formatFileSize } from '../utils/formatDate';
import toast from 'react-hot-toast';

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const UploadForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', subject: '', semester: '', tags: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (f) => {
    if (f && f.size > 20 * 1024 * 1024) {
      toast.error('File too large. Max size is 20MB.');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    if (!form.title || !form.description || !form.subject) {
      return toast.error('Title, description and subject are required');
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    try {
      const { data } = await noteService.uploadNote(formData);
      toast.success('Note uploaded successfully!');
      navigate(`/notes/${data.note._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      {/* File drop zone */}
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        {file ? (
          <div className="file-selected">
            <span className="file-icon-lg">📄</span>
            <div>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatFileSize(file.size)}</p>
            </div>
            <button type="button" className="remove-file" onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
          </div>
        ) : (
          <div className="drop-zone-hint">
            <span className="upload-icon">☁️</span>
            <p>Drag & drop your file here, or <strong>click to browse</strong></p>
            <small>PDF, DOC, DOCX, PPT, PPTX, TXT, PNG, JPG — max 20MB</small>
          </div>
        )}
        <input
          id="file-input"
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Data Structures – Linked Lists Complete Notes" required />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's covered in these notes?" rows={3} required />
        </div>

        <div className="form-group">
          <label>Subject *</label>
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Data Structures" required />
        </div>

        <div className="form-group">
          <label>Semester</label>
          <select name="semester" value={form.semester} onChange={handleChange}>
            <option value="">Select semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>{s} Semester</option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label>Tags <span className="optional">(comma-separated)</span></label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. algorithms, sorting, binary-tree" />
        </div>
      </div>

      <button type="submit" className="btn-upload" disabled={uploading}>
        {uploading ? (
          <><span className="spinner" /> Uploading...</>
        ) : (
          '📤 Upload Note'
        )}
      </button>
    </form>
  );
};

export default UploadForm;
