import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', university: '', department: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to NoteShare 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-header">
          <h1>Create your account</h1>
          <p>Join NoteShare and start sharing knowledge</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Rahim Uddin" required />
            </div>
            <div className="form-group">
              <label>Email address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@university.edu" required autoComplete="email" />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label>University <span className="optional">(optional)</span></label>
              <input name="university" value={form.university} onChange={handleChange} placeholder="e.g. RUET, BUET, DU" />
            </div>
            <div className="form-group full-width">
              <label>Department <span className="optional">(optional)</span></label>
              <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science & Engineering" />
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
