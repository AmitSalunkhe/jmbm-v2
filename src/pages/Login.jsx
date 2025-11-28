import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import InstallButton from '../components/InstallButton';

import { useAppSettings } from '../hooks/useAppSettings';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const settings = useAppSettings();

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
                await signInWithPopup(auth, googleProvider);
            } catch (popupError) {
                console.warn("Popup failed, trying redirect...", popupError);
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
        <div className="min-h-screen bg-[var(--color-paper-base)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[var(--color-paper-base)] opacity-80 pointer-events-none"></div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 border-[16px] border-[var(--color-paper-card)] pointer-events-none opacity-50"></div>
            <div className="absolute inset-4 border border-[var(--color-border-sepia)] pointer-events-none opacity-20 rounded-lg"></div>

            <div className="max-w-md w-full relative z-10 animate-fade-in">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[var(--color-gold-accent)] rounded-full opacity-20 animate-glow blur-lg"></div>
                        <div className="w-24 h-24 border-2 border-[var(--color-maroon-main)] rounded-full flex items-center justify-center bg-[var(--color-paper-card)] shadow-lg overflow-hidden relative z-10 animate-float">
                            {settings?.appIcon192 ? (
                                <img src={settings.appIcon192} alt="App Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl">🙏</span>
                            )}
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-maroon-main)] mb-2 drop-shadow-sm font-marathi tracking-wide">
                        {settings?.appTitle || 'जननी माता भजन मंडळ'}
                    </h1>
                    <p className="text-[var(--color-ink-secondary)] font-medium border-b border-[var(--color-gold-accent)] inline-block pb-1 px-4">
                        {settings?.appSubtitle || 'मोरावळे'}
                    </p>
                </div>

                {/* Login Card - Book Page Style */}
                <div className="bg-[var(--color-paper-card)] rounded-xl shadow-2xl p-8 border-t-4 border-[var(--color-maroon-main)] relative overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
                    {/* Corner Ornament */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-gold-accent)] to-transparent opacity-10"></div>

                    {/* Subtle Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none"></div>

                    <h2 className="text-2xl font-bold text-[var(--color-ink-primary)] mb-3 text-center font-marathi">
                        स्वागत आहे!
                    </h2>
                    <p className="text-[var(--color-ink-secondary)] text-center mb-8 text-sm opacity-80">
                        भजन, अभंग आणि संतांच्या वाणीचा अनुभव घ्या
                    </p>

                    <InstallButton />

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border border-[var(--color-border-sepia)] text-[var(--color-ink-primary)] py-3.5 px-6 rounded-lg flex items-center justify-center space-x-3 hover:border-[var(--color-maroon-main)] hover:shadow-md transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(128,0,0,0.05)] to-transparent translate-x-[-100%] group-hover:animate-shimmer"></div>

                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-[var(--color-maroon-main)] border-t-transparent rounded-full animate-spin"></div>
                                <span>लॉगिन होत आहे...</span>
                            </>
                        ) : (
                            <>
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                                />
                                <span className="font-medium relative z-10">Google द्वारे लॉगिन करा</span>
                            </>
                        )}
                    </button>

                    <div className="mt-8 pt-6 border-t border-[var(--color-border-sepia)] opacity-40">
                        <p className="text-sm text-[var(--color-ink-primary)] text-center font-bold tracking-widest uppercase">
                            || रामकृष्णहरी माऊली ||
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-[var(--color-ink-secondary)] mt-8 opacity-60 font-medium tracking-wider">
                    वारकरी संप्रदाय • भक्ती आणि आध्यात्म
                </p>
            </div>
        </div>
    );
};

export default Login;
