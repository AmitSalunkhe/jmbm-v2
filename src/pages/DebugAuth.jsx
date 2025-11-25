import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { getRedirectResult } from 'firebase/auth';

const DebugAuth = () => {
    const { user, loading } = useAuth();
    const [redirectResult, setRedirectResult] = useState('Checking...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    setRedirectResult(`Success: ${result.user.email}`);
                } else {
                    setRedirectResult('No redirect result found');
                }
            } catch (err) {
                setRedirectResult(`Error: ${err.message}`);
                setError(err);
            }
        };
        checkRedirect();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Auth Debugger</h1>

            <div className="space-y-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-bold">Auth Context State</h2>
                    <pre className="bg-gray-800 text-white p-2 rounded mt-2">
                        {JSON.stringify({
                            loading,
                            user: user ? { email: user.email, uid: user.uid, role: user.role } : 'null'
                        }, null, 2)}
                    </pre>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-bold">Redirect Result</h2>
                    <pre className="bg-gray-800 text-white p-2 rounded mt-2">
                        {redirectResult}
                    </pre>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-bold">Firebase Config Check</h2>
                    <pre className="bg-gray-800 text-white p-2 rounded mt-2">
                        {JSON.stringify({
                            apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
                            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
                        }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default DebugAuth;
