import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-saffron-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-saffron-700">लोड होत आहे...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is admin
    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-saffron-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🚫</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">प्रवेश नाकारला</h2>
                    <p className="text-gray-600 mb-6">
                        तुम्हाला ॲडमिन पॅनेल ॲक्सेस करण्याची परवानगी नाही.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-saffron-600 text-white px-6 py-2 rounded hover:bg-saffron-700"
                    >
                        परत जा
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
