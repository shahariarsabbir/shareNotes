import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './routes';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import NotePage from './pages/NotePage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Upload from './pages/Upload';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:id" element={<NotePage />} />
            <Route path="/profile/:id" element={<Profile />} />

            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />

            <Route path="*" element={
              <div className="not-found-page">
                <h1>404</h1>
                <p>Page not found</p>
                <a href="/">← Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
