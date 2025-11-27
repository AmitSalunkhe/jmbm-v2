import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Home from './pages/Home';
import Bhajans from './pages/Bhajans';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Sant from './pages/Sant';
import BhajanTypes from './pages/BhajanTypes';
import BhajanDetail from './pages/BhajanDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

import { useAppSettings } from './hooks/useAppSettings';

function App() {
  useAppSettings(); // Apply app settings (title, favicon)

  const [showSplash, setShowSplash] = React.useState(() => {
    // Check if splash has already been shown in this session
    return !sessionStorage.getItem('splashShown');
  });

  React.useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
          </Route>

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/bhajans" element={<Bhajans />} />
            <Route path="/bhajan/:id" element={<BhajanDetail />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<About />} />
            <Route path="/saints" element={<Sant />} />
            <Route path="bhajan-types" element={<BhajanTypes />} />
            <Route path="bhajan-types" element={<BhajanTypes />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />

            {/* Admin Route - Requires admin role */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
          </Route>

          {/* Catch all - redirect to splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider >
  );
}

export default App;
