import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { getRedirectResult } from 'firebase/auth';

const Splash = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        // Check for redirect result from Google Sign-In
        const checkRedirectResult = async () => {
            try {
                if (!auth.app) return;
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log('Login successful via redirect:', result.user);
                    navigate('/home');
                    return;
                }
            } catch (error) {
                console.error('Redirect result error:', error);
            }
        };

        checkRedirectResult();

        // Auto-redirect after splash animation
        const timer = setTimeout(() => {
            if (!loading) {
                if (user) {
                    navigate('/home');
                } else {
                    navigate('/login');
                }
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-saffron-500 via-saffron-600 to-saffron-700 flex items-center justify-center">
            <div className="text-center animate-fade-in">
                <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl animate-scale-in">
                    <span className="text-6xl">🙏</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
                    जननी माता भजन मंडळ
                </h1>
                <p className="text-xl text-saffron-100 animate-slide-up-delay">
                    मोरावळे
                </p>
                <div className="mt-8">
                    <p className="text-white text-lg animate-pulse">
                        विठ्ठल विठ्ठल विठोबा हरी ॐ
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Splash;
