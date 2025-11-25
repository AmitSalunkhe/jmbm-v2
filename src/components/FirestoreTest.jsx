import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const FirestoreTest = () => {
    const [status, setStatus] = useState('idle'); // idle, testing, success, error
    const [message, setMessage] = useState('');

    const testConnection = async () => {
        setStatus('testing');
        setMessage('Testing connection...');
        try {
            if (!db.type) {
                throw new Error("Firestore SDK not initialized");
            }

            const docRef = await addDoc(collection(db, 'test_connection'), {
                timestamp: new Date(),
                test: 'Hello Firebase'
            });

            setStatus('success');
            setMessage(`Success! Document written with ID: ${docRef.id}`);
        } catch (error) {
            console.error("Firestore Test Error:", error);
            setStatus('error');
            setMessage(`Error: ${error.message}`);

            if (error.message.includes('permission-denied')) {
                alert("⚠️ Permission Denied! \n\nPlease check your Firestore Security Rules in Firebase Console.\nThey might be set to 'allow read, write: if false;'");
            }
        }
    };

    return (
        <div className="mt-4 p-4 border rounded bg-gray-50 text-center">
            <h3 className="font-bold mb-2">Database Connection Test</h3>
            <button
                onClick={testConnection}
                disabled={status === 'testing'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {status === 'testing' ? 'Testing...' : 'Test Write to Firestore'}
            </button>
            {message && (
                <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default FirestoreTest;
