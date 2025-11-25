import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, setPersistence, browserLocalPersistence } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;

        const initializeAuth = async () => {
            if (!auth.app) {
                setLoading(false);
                return;
            }

            try {
                // Explicitly set persistence to LOCAL (survives browser restart)
                await setPersistence(auth, browserLocalPersistence);

                unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                    try {
                        if (currentUser) {
                            // Check if we have a valid DB connection
                            if (db && db.app) {
                                const userRef = doc(db, 'users', currentUser.uid);

                                try {
                                    const userDoc = await getDoc(userRef);

                                    if (!userDoc.exists()) {
                                        // Create user document with default role
                                        const userData = {
                                            uid: currentUser.uid,
                                            email: currentUser.email,
                                            displayName: currentUser.displayName,
                                            photoURL: currentUser.photoURL,
                                            role: 'user', // Default role
                                            createdAt: new Date()
                                        };
                                        await setDoc(userRef, userData);
                                        setUser({ ...currentUser, ...userData });
                                    } else {
                                        // User exists, merge Firestore data with auth data
                                        setUser({ ...currentUser, ...userDoc.data() });
                                    }
                                } catch (firestoreError) {
                                    console.error("Firestore access error:", firestoreError);
                                    // Fallback: Use auth user data if Firestore fails (e.g., offline)
                                    setUser(currentUser);
                                }
                            } else {
                                // Fallback if DB is not available
                                setUser(currentUser);
                            }
                        } else {
                            setUser(null);
                        }
                    } catch (error) {
                        console.error("Auth state change error:", error);
                        setUser(null);
                    } finally {
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error("Auth initialization error:", error);
                setLoading(false);
            }
        };

        initializeAuth();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
