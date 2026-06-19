import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="brand-icon">📚</span>
        <span className="brand-text">NoteShare</span>
        <p className="footer-tagline">Share knowledge, ace your exams.</p>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/notes">Browse Notes</Link>
          <Link to="/register">Join Now</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Log In</Link>
          <Link to="/upload">Upload Note</Link>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} NoteShare. Built for students, by students.</p>
    </div>
  </footer>
);

export default Footer;
