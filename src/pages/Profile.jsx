import React from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';

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
    <div className="p-4">
      <h2 className="text-2xl font-bold text-saffron-900 mb-6">प्रोफाइल</h2>

      {user ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-saffron-500" />
            ) : (
              <div className="w-16 h-16 bg-saffron-200 rounded-full flex items-center justify-center text-saffron-700 font-bold text-2xl">
                {user.displayName ? user.displayName[0] : 'U'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-800">{user.displayName}</h3>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Admin Section - Only visible to admin users */}
          {user.role === 'admin' && (
            <div className="bg-saffron-50 p-4 rounded-lg border border-saffron-200">
              <h3 className="font-bold text-saffron-900 mb-2 flex items-center">
                <ShieldCheck size={20} className="mr-2" />
                ॲडमिन क्षेत्र
              </h3>
              <p className="text-sm text-gray-600 mb-3">येथून आपण नवीन भजन किंवा कार्यक्रम जोडू शकता.</p>
              <Link to="/admin" className="block w-full bg-saffron-600 text-white text-center py-2 rounded hover:bg-saffron-700 font-bold">
                ॲडमिन पॅनेल उघडा
              </Link>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded hover:bg-gray-200 transition"
          >
            <LogOut size={20} />
            <span>बाहेर पडा (Logout)</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-saffron-100 rounded-full flex items-center justify-center mb-4 text-saffron-600">
            <ShieldCheck size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">स्वागत आहे!</h3>
          <p className="text-gray-500 mb-6">ॲडमिन पॅनेल ॲक्सेस करण्यासाठी कृपया लॉगिन करा.</p>
          <button
            onClick={handleLogin}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-full flex items-center space-x-2 hover:bg-gray-50 transition shadow-sm"
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
