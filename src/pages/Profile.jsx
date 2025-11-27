import React from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!auth.app) {
        alert("Firebase Auth not configured. Check console.");
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 border-b-2 border-[var(--color-gold-accent)] pb-2">
        <User className="text-[var(--color-maroon-main)]" size={28} />
        <h2 className="text-2xl font-bold text-[var(--color-maroon-main)]">प्रोफाइल</h2>
      </div>

      {user ? (
        <div className="space-y-6">
          {/* ID Card Style Profile */}
          <div className="bg-[var(--color-paper-card)] p-6 rounded-lg shadow-md border-2 border-[var(--color-border-sepia)] relative overflow-hidden flex items-center space-x-6">
            <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-maroon-main)]"></div>

            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-4 border-[var(--color-paper-base)] shadow-sm" />
            ) : (
              <div className="w-20 h-20 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center text-[var(--color-maroon-main)] font-bold text-3xl border-2 border-[var(--color-border-sepia)]">
                {user.displayName ? user.displayName[0] : 'U'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-[var(--color-ink-primary)]">{user.displayName}</h3>
              <p className="text-[var(--color-ink-secondary)] text-sm italic">{user.email}</p>
              <div className="mt-2 inline-block bg-[var(--color-paper-base)] px-3 py-1 rounded-full border border-[var(--color-border-sepia)] text-xs font-medium text-[var(--color-maroon-main)]">
                सदस्य
              </div>
            </div>
          </div>

          {/* Admin Section - Only visible to admin users */}
          {user.role === 'admin' && (
            <div className="bg-[var(--color-paper-base)] p-5 rounded-lg border-2 border-[var(--color-gold-accent)] shadow-sm">
              <h3 className="font-bold text-[var(--color-maroon-main)] mb-2 flex items-center text-lg">
                <ShieldCheck size={24} className="mr-2" />
                ॲडमिन क्षेत्र
              </h3>
              <p className="text-sm text-[var(--color-ink-secondary)] mb-4">येथून आपण नवीन भजन किंवा कार्यक्रम जोडू शकता.</p>
              <Link to="/admin" className="block w-full bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] text-center py-3 rounded-lg hover:bg-[var(--color-maroon-light)] font-bold shadow-md transition-colors border border-[var(--color-border-sepia)]">
                ॲडमिन पॅनेल उघडा
              </Link>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-[var(--color-paper-card)] text-[var(--color-ink-primary)] py-3 rounded-lg border border-[var(--color-border-sepia)] hover:bg-[var(--color-paper-base)] transition shadow-sm"
          >
            <LogOut size={20} />
            <span>बाहेर पडा (Logout)</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-[var(--color-paper-card)] rounded-lg shadow-sm border border-[var(--color-border-sepia)] text-center">
          <div className="w-20 h-20 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center mb-4 border border-[var(--color-border-sepia)]">
            <ShieldCheck size={40} className="text-[var(--color-maroon-main)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-ink-primary)] mb-2">स्वागत आहे!</h3>
          <p className="text-[var(--color-ink-secondary)] mb-6 px-6">ॲडमिन पॅनेल ॲक्सेस करण्यासाठी कृपया लॉगिन करा.</p>
          <button
            onClick={handleLogin}
            className="bg-white border border-[var(--color-border-sepia)] text-gray-700 py-3 px-8 rounded-full flex items-center space-x-3 hover:bg-gray-50 transition shadow-md"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Google द्वारे लॉगिन करा</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
