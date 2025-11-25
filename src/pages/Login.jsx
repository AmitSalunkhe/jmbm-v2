import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

import InstallButton from '../components/InstallButton';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            if (!auth.app) {
                alert("Firebase Auth not configured. Please check your .env file.");
                return;
            }
            setLoading(true);

            try {
                // Try popup first (preferred for SPAs)
                await signInWithPopup(auth, googleProvider);
            } catch (popupError) {
                console.warn("Popup failed, trying redirect...", popupError);
                // Fallback to redirect if popup is blocked or fails
                if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
                    await signInWithRedirect(auth, googleProvider);
                } else {
                    throw popupError;
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("लॉगिन अयशस्वी: " + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-saffron-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-saffron-500 to-saffron-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-4xl text-white">🙏</span>
                    </div>
                    <h1 className="text-3xl font-bold text-saffron-900 mb-2">
                        जननी माता भजन मंडळ
                    </h1>
                    <p className="text-saffron-700">मोरावळे</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        स्वागत आहे!
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        भजन, अभंग आणि संतांच्या वाणीचा अनुभव घ्या
                    </p>

                    <InstallButton />

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 hover:border-saffron-500 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>लॉगिन होत आहे...</span>
                            </>
                        ) : (
                            <>
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-6 h-6"
                                />
                                <span className="font-medium">Google द्वारे लॉगिन करा</span>
                            </>
                        )}
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center">
                            विठ्ठल विठ्ठल विठोबा हरी ॐ
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    वारकरी संप्रदाय • भक्ती आणि आध्यात्म
                </p>
            </div>
        </div>
    );
};

export default Login;
