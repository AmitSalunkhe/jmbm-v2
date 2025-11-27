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
        <div className="min-h-screen bg-[var(--color-paper-base)] flex items-center justify-center p-4 relative">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 border-[16px] border-[var(--color-paper-card)] pointer-events-none opacity-50"></div>
            <div className="absolute inset-4 border-2 border-[var(--color-border-sepia)] pointer-events-none opacity-30"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[var(--color-maroon-main)] rounded-full opacity-10"></div>
                        <div className="w-20 h-20 border-2 border-[var(--color-maroon-main)] rounded-full flex items-center justify-center bg-[var(--color-paper-card)] shadow-md">
                            <span className="text-4xl">🙏</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-maroon-main)] mb-2 drop-shadow-sm">
                        जननी माता भजन मंडळ
                    </h1>
                    <p className="text-[var(--color-ink-secondary)] font-medium border-b border-[var(--color-gold-accent)] inline-block pb-1">
                        मोरावळे
                    </p>
                </div>

                {/* Login Card - Book Page Style */}
                <div className="bg-[var(--color-paper-card)] rounded-lg shadow-[0_4px_20px_-2px_rgba(62,39,35,0.15)] p-8 border-t-4 border-[var(--color-maroon-main)] relative overflow-hidden">
                    {/* Corner Ornament */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[var(--color-gold-accent)] to-transparent opacity-20"></div>

                    <h2 className="text-2xl font-bold text-[var(--color-ink-primary)] mb-2 text-center">
                        स्वागत आहे!
                    </h2>
                    <p className="text-[var(--color-ink-secondary)] text-center mb-8 text-sm">
                        भजन, अभंग आणि संतांच्या वाणीचा अनुभव घ्या
                    </p>

                    <InstallButton />

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border-2 border-[var(--color-border-sepia)] text-[var(--color-ink-primary)] py-3 px-6 rounded-lg flex items-center justify-center space-x-3 hover:bg-[var(--color-paper-base)] hover:border-[var(--color-maroon-main)] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
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
                                    className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all"
                                />
                                <span className="font-medium">Google द्वारे लॉगिन करा</span>
                            </>
                        )}
                    </button>

                    <div className="mt-8 pt-6 border-t border-[var(--color-border-sepia)] opacity-50">
                        <p className="text-sm text-[var(--color-ink-primary)] text-center font-semibold">
                            || रामकृष्णहरी माऊली ||
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-[var(--color-ink-secondary)] mt-6 opacity-80">
                    वारकरी संप्रदाय • भक्ती आणि आध्यात्म
                </p>
            </div>
        </div>
    );
};

export default Login;
