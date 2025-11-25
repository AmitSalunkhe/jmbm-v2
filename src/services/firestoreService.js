import { db } from '../firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, setDoc } from 'firebase/firestore';

const BHAJAN_COLLECTION = 'bhajans';
const EVENTS_COLLECTION = 'events';
const SAINTS_COLLECTION = 'saints';
const BHAJAN_TYPES_COLLECTION = 'bhajan_types';
const CATEGORIES_COLLECTION = 'categories';
const LABELS_COLLECTION = 'labels';
const USERS_COLLECTION = 'users';
const MEMBERS_COLLECTION = 'members';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'app_settings';

// Simple in-memory cache
const cache = {
    bhajans: null,
    saints: null,
    bhajanTypes: null,
    categories: null,
    labels: null,
    events: null,
    users: null,
    members: null,
    settings: null
};

// Helper to clear cache
const clearCache = (key) => {
    if (key === 'all') {
        Object.keys(cache).forEach(k => cache[k] = null);
    } else {
        cache[key] = null;
    }
};

// Bhajans
export const getBhajans = async () => {
    try {
        if (cache.bhajans) return cache.bhajans;

        if (!db.type) {
            console.warn("Firestore not initialized. Check .env");
            return [];
        }
        const q = query(collection(db, BHAJAN_COLLECTION), orderBy('title'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.bhajans = data;
        return data;
    } catch (error) {
        console.error("Error fetching bhajans:", error);
        return [];
    }
};

export const getBhajanById = async (id) => {
    try {
        if (cache.bhajans) {
            const cached = cache.bhajans.find(b => b.id === id);
            if (cached) return cached;
        }

        if (!db.type) return null;
        const docRef = doc(db, BHAJAN_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching bhajan by id:", error);
        return null;
    }
};

export const addBhajan = async (bhajanData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        await addDoc(collection(db, BHAJAN_COLLECTION), {
            ...bhajanData,
            createdAt: new Date()
        });
        clearCache('bhajans');
    } catch (error) {
        console.error("Error adding bhajan:", error);
        throw error;
    }
};

export const updateBhajan = async (id, bhajanData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const bhajanRef = doc(db, BHAJAN_COLLECTION, id);
        await setDoc(bhajanRef, {
            ...bhajanData,
            updatedAt: new Date()
        }, { merge: true });
        clearCache('bhajans');
    } catch (error) {
        console.error("Error updating bhajan:", error);
        throw error;
    }
};

export const deleteBhajan = async (id) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const bhajanRef = doc(db, BHAJAN_COLLECTION, id);
        await deleteDoc(bhajanRef);
        clearCache('bhajans');
    } catch (error) {
        console.error("Error deleting bhajan:", error);
        throw error;
    }
};

export const getBhajansByCategory = async (categoryName) => {
    // Leverage cached all bhajans if available
    const allBhajans = await getBhajans();
    return allBhajans.filter(bhajan =>
        bhajan.category?.toLowerCase() === categoryName.toLowerCase()
    );
};

export const getBhajansBySant = async (santName) => {
    // Leverage cached all bhajans if available
    const allBhajans = await getBhajans();
    return allBhajans.filter(bhajan =>
        bhajan.sant?.toLowerCase() === santName.toLowerCase()
    );
};

// Events
export const getUpcomingEvents = async () => {
    try {
        if (cache.events) return cache.events;

        if (!db.type) return [];
        const q = query(collection(db, EVENTS_COLLECTION), orderBy('date'), limit(3));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.events = data;
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

export const getAllEvents = async () => {
    try {
        if (!db.type) return [];
        const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching all events:", error);
        return [];
    }
};

export const getEventById = async (id) => {
    try {
        if (!db.type) return null;
        const docRef = doc(db, EVENTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching event by id:", error);
        return null;
    }
};

export const addEvent = async (eventData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const eventsRef = collection(db, EVENTS_COLLECTION);
        const docRef = await addDoc(eventsRef, {
            ...eventData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        clearCache('events');
        return docRef.id;
    } catch (error) {
        console.error("Error adding event:", error);
        throw error;
    }
};

export const updateEvent = async (id, eventData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const eventRef = doc(db, EVENTS_COLLECTION, id);
        await updateDoc(eventRef, {
            ...eventData,
            updatedAt: new Date().toISOString()
        });
        clearCache('events');
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
};

export const deleteEvent = async (id) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const eventRef = doc(db, EVENTS_COLLECTION, id);
        await deleteDoc(eventRef);
        clearCache('events');
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
};


// Saints
export const getSaints = async () => {
    try {
        if (cache.saints) return cache.saints;

        if (!db.type) return [];
        const q = query(collection(db, SAINTS_COLLECTION), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.saints = data;
        return data;
    } catch (error) {
        console.error("Error fetching saints:", error);
        return [];
    }
};

export const addSant = async (santData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        await addDoc(collection(db, SAINTS_COLLECTION), {
            ...santData,
            createdAt: new Date()
        });
        clearCache('saints');
    } catch (error) {
        console.error("Error adding sant:", error);
        throw error;
    }
};

export const updateSant = async (id, santData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const santRef = doc(db, SAINTS_COLLECTION, id);
        await setDoc(santRef, {
            ...santData,
            updatedAt: new Date()
        }, { merge: true });
        clearCache('saints');
    } catch (error) {
        console.error("Error updating sant:", error);
        throw error;
    }
};

export const deleteSant = async (id) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const santRef = doc(db, SAINTS_COLLECTION, id);
        await deleteDoc(santRef);
        clearCache('saints');
    } catch (error) {
        console.error("Error deleting sant:", error);
        throw error;
    }
};

// Bhajan Types (Formerly Categories)
export const getBhajanTypes = async () => {
    try {
        if (cache.bhajanTypes) return cache.bhajanTypes;

        if (!db.type) return [];
        const q = query(collection(db, BHAJAN_TYPES_COLLECTION), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.bhajanTypes = data;
        return data;
    } catch (error) {
        console.error("Error fetching bhajan types:", error);
        return [];
    }
};

export const addBhajanType = async (typeData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        await addDoc(collection(db, BHAJAN_TYPES_COLLECTION), {
            ...typeData,
            createdAt: new Date()
        });
        clearCache('bhajanTypes');
    } catch (error) {
        console.error("Error adding bhajan type:", error);
        throw error;
    }
};

export const updateBhajanType = async (id, typeData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const typeRef = doc(db, BHAJAN_TYPES_COLLECTION, id);
        await setDoc(typeRef, {
            ...typeData,
            updatedAt: new Date()
        }, { merge: true });
        clearCache('bhajanTypes');
    } catch (error) {
        console.error("Error updating bhajan type:", error);
        throw error;
    }
};

export const deleteBhajanType = async (id) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const typeRef = doc(db, BHAJAN_TYPES_COLLECTION, id);
        await deleteDoc(typeRef);
        clearCache('bhajanTypes');
    } catch (error) {
        console.error("Error deleting bhajan type:", error);
        throw error;
    }
};

// Categories (Formerly Subcategories)
export const getCategories = async () => {
    try {
        if (cache.categories) return cache.categories;

        if (!db.type) return [];
        const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.categories = data;
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const addCategory = async (categoryData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        await addDoc(collection(db, CATEGORIES_COLLECTION), {
            ...categoryData,
            createdAt: new Date()
        });
        clearCache('categories');
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
        await setDoc(categoryRef, {
            ...categoryData,
            updatedAt: new Date()
        }, { merge: true });
        clearCache('categories');
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
        await deleteDoc(categoryRef);
        clearCache('categories');
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

// Labels
export const getLabels = async () => {
    try {
        if (cache.labels) return cache.labels;

        if (!db.type) return [];
        const q = query(collection(db, LABELS_COLLECTION), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.labels = data;
        return data;
    } catch (error) {
        console.error("Error fetching labels:", error);
        return [];
    }
};

export const addLabel = async (labelData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        await addDoc(collection(db, LABELS_COLLECTION), {
            ...labelData,
            createdAt: new Date()
        });
        clearCache('labels');
    } catch (error) {
        console.error("Error adding label:", error);
        throw error;
    }
};

export const updateLabel = async (id, labelData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const labelRef = doc(db, LABELS_COLLECTION, id);
        await setDoc(labelRef, {
            ...labelData,
            updatedAt: new Date()
        }, { merge: true });
        clearCache('labels');
    } catch (error) {
        console.error("Error updating label:", error);
        throw error;
    }
};

export const deleteLabel = async (id) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const labelRef = doc(db, LABELS_COLLECTION, id);
        await deleteDoc(labelRef);
        clearCache('labels');
    } catch (error) {
        console.error("Error deleting label:", error);
        throw error;
    }
};

// Users
export const getUsers = async () => {
    try {
        if (cache.users) return cache.users;

        if (!db.type) return [];
        const q = query(collection(db, USERS_COLLECTION), orderBy('email'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.users = data;
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const userRef = doc(db, USERS_COLLECTION, userId);
        await setDoc(userRef, {
            role,
            updatedAt: new Date()
        }, { merge: true });
        clearCache('users');
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
};

// App Settings
export const getAppSettings = async () => {
    try {
        if (cache.settings) return cache.settings;

        if (!db.type) return {
            appName: 'जननी माता भजन मंडळ मोरावळे',
            splashText: 'विठ्ठल विठ्ठल विठोबा हरी ॐ',
            loginMessage: 'भजन, अभंग आणि संतांच्या वाणीचा अनुभव घ्या',
            primaryColor: '#FF6B35',
            enableRegistration: true,
            maintenanceMode: false,
            aboutTitle: 'मंडळाविषयी',
            aboutDescription: 'जननी माता भजन मंडळ, मोरावळे.\n\nआमचे उद्दिष्ट वारकरी संप्रदायाचा प्रसार करणे आणि गावात भक्तीमय वातावरण निर्माण करणे हे आहे.',
            contactPhone: '',
            contactEmail: '',
            facebookUrl: '',
            instagramUrl: '',
            youtubeUrl: '',
            twitterUrl: '',
            whatsappNumber: ''
        };
        const snapshot = await getDocs(collection(db, SETTINGS_COLLECTION));
        let data;
        if (snapshot.empty) {
            data = {
                appName: 'जननी माता भजन मंडळ मोरावळे',
                splashText: 'विठ्ठल विठ्ठल विठोबा हरी ॐ',
                loginMessage: 'भजन, अभंग आणि संतांच्या वाणीचा अनुभव घ्या',
                primaryColor: '#FF6B35',
                enableRegistration: true,
                maintenanceMode: false,
                aboutTitle: 'मंडळाविषयी',
                aboutDescription: 'जननी माता भजन मंडळ, मोरावळे.\n\nआमचे उद्दिष्ट वारकरी संप्रदायाचा प्रसार करणे आणि गावात भक्तीमय वातावरण निर्माण करणे हे आहे.',
                contactPhone: '',
                contactEmail: '',
                facebookUrl: '',
                instagramUrl: '',
                youtubeUrl: '',
                twitterUrl: '',
                whatsappNumber: ''
            };
        } else {
            const docSnap = snapshot.docs[0];
            data = { id: docSnap.id, ...docSnap.data() };
        }
        cache.settings = data;
        return data;
    } catch (error) {
        console.error("Error fetching app settings:", error);
        return null;
    }
};

export const updateAppSettings = async (settingsData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        // Use setDoc with merge: true to create if not exists
        await setDoc(settingsRef, {
            ...settingsData,
            updatedAt: new Date()
        }, { merge: true });
        clearCache('settings');
    } catch (error) {
        console.error("Error updating app settings:", error);
        throw error;
    }
};

// Members
export const getMembers = async () => {
    try {
        if (cache.members) return cache.members;

        if (!db.type) return [];
        const q = query(collection(db, MEMBERS_COLLECTION), orderBy('order'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cache.members = data;
        return data;
    } catch (error) {
        console.error("Error fetching members:", error);
        return [];
    }
};

export const addMember = async (memberData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const membersRef = collection(db, MEMBERS_COLLECTION);
        const docRef = await addDoc(membersRef, {
            ...memberData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        clearCache('members');
        return docRef.id;
    } catch (error) {
        console.error("Error adding member:", error);
        throw error;
    }
};

export const updateMember = async (id, memberData) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const memberRef = doc(db, MEMBERS_COLLECTION, id);
        await updateDoc(memberRef, {
            ...memberData,
            updatedAt: new Date().toISOString()
        });
        clearCache('members');
    } catch (error) {
        console.error("Error updating member:", error);
        throw error;
    }
};

export const deleteMember = async (id) => {
    try {
        if (!db.type) throw new Error("Firestore not initialized");
        const memberRef = doc(db, MEMBERS_COLLECTION, id);
        await deleteDoc(memberRef);
        clearCache('members');
    } catch (error) {
        console.error("Error deleting member:", error);
        throw error;
    }
};

