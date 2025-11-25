import React, { useState, useEffect } from 'react';
import {
    getBhajans, addBhajan, updateBhajan, deleteBhajan,
    getSaints, addSant, updateSant, deleteSant,
    getBhajanTypes, addBhajanType, updateBhajanType, deleteBhajanType,
    getCategories, addCategory, updateCategory, deleteCategory,
    getLabels, addLabel, updateLabel, deleteLabel,
    getUsers, updateUserRole,
    getAppSettings, updateAppSettings,
    getAllEvents, addEvent, updateEvent, deleteEvent,
    getMembers, addMember, updateMember, deleteMember
} from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, X, BookOpen, User, FolderOpen, Tag, Users, Settings, Calendar } from 'lucide-react';
import TabNavigation from '../components/TabNavigation';
import ConfirmDialog from '../components/ConfirmDialog';
import Events from './admin/Events';
import Members from './admin/Members';

const AdminPanel = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('bhajans');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null, type: '' });

    // Data states
    const [bhajans, setBhajans] = useState([]);
    const [saints, setSaints] = useState([]);
    const [bhajanTypes, setBhajanTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [labels, setLabels] = useState([]);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [members, setMembers] = useState([]);
    const [appSettings, setAppSettings] = useState(null);

    // Form data
    const [formData, setFormData] = useState({});

    const tabs = [
        { id: 'bhajans', label: 'भजने', icon: <BookOpen size={18} /> },
        { id: 'events', label: 'कार्यक्रम', icon: <Calendar size={18} /> },
        { id: 'members', label: 'सभासद', icon: <Users size={18} /> },
        { id: 'saints', label: 'संत', icon: <User size={18} /> },
        { id: 'bhajanTypes', label: 'भजनाचे प्रकार', icon: <FolderOpen size={18} /> },
        { id: 'categories', label: 'श्रेणी', icon: <FolderOpen size={18} /> },
        { id: 'labels', label: 'लेबल्स', icon: <Tag size={18} /> },
        { id: 'users', label: 'वापरकर्ते', icon: <Users size={18} /> },
        { id: 'settings', label: 'सेटिंग्ज', icon: <Settings size={18} /> }
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'bhajans':
                    setBhajans(await getBhajans());
                    setBhajanTypes(await getBhajanTypes());
                    setCategories(await getCategories());
                    setSaints(await getSaints());
                    setLabels(await getLabels());
                    break;
                case 'events':
                    setEvents(await getAllEvents());
                    break;
                case 'saints':
                    setSaints(await getSaints());
                    break;
                case 'bhajanTypes':
                    setBhajanTypes(await getBhajanTypes());
                    break;
                case 'categories':
                    setCategories(await getCategories());
                    setBhajanTypes(await getBhajanTypes());
                    break;
                case 'labels':
                    setLabels(await getLabels());
                    break;
                case 'users':
                    setUsers(await getUsers());
                    break;
                case 'settings':
                    setAppSettings(await getAppSettings());
                    break;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateItem();
            } else {
                await addItem();
            }
            resetForm();
            fetchData();
        } catch (error) {
            showToast('त्रुटी: ' + error.message, 'error');
        }
    };

    const addItem = async () => {
        switch (activeTab) {
            case 'bhajans':
                await addBhajan({ ...formData, tags: formData.tags?.split(',').map(t => t.trim()).filter(t => t) || [] });
                break;
            case 'saints':
                await addSant(formData);
                break;
            case 'bhajanTypes':
                await addBhajanType(formData);
                break;
            case 'categories':
                await addCategory(formData);
                break;
            case 'labels':
                await addLabel(formData);
                break;
        }
        showToast('यशस्वीरित्या जोडले!', 'success');
    };

    const updateItem = async () => {
        const data = activeTab === 'bhajans'
            ? { ...formData, tags: formData.tags?.split(',').map(t => t.trim()).filter(t => t) || [] }
            : formData;

        switch (activeTab) {
            case 'bhajans':
                await updateBhajan(editingItem.id, data);
                break;
            case 'saints':
                await updateSant(editingItem.id, data);
                break;
            case 'bhajanTypes':
                await updateBhajanType(editingItem.id, data);
                break;
            case 'categories':
                await updateCategory(editingItem.id, data);
                break;
            case 'labels':
                await updateLabel(editingItem.id, data);
                break;
            case 'settings':
                await updateAppSettings(data);
                break;
        }
        showToast('यशस्वीरित्या अपडेट केले!', 'success');
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'bhajans') {
            setFormData({
                title: item.title || '',
                category: item.category || '',
                subcategory: Array.isArray(item.subcategory) ? item.subcategory : (item.subcategory ? [item.subcategory] : []),
                lyrics: item.lyrics || '',
                sant: item.sant || '',
                tags: item.tags?.join(', ') || ''
            });
        } else if (activeTab === 'saints') {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                birthPlace: item.birthPlace || '',
                era: item.era || ''
            });
        } else if (activeTab === 'bhajanTypes' || activeTab === 'labels') {
            setFormData({
                name: item.name || '',
                description: item.description || ''
            });
        } else if (activeTab === 'categories') {
            setFormData({
                name: item.name || '',
                bhajanTypeId: item.bhajanTypeId || '',
                description: item.description || ''
            });
        } else if (activeTab === 'settings') {
            setFormData(item);
        }
        setShowForm(true);
    };

    const handleDeleteClick = (item) => {
        setDeleteDialog({ isOpen: true, item, type: activeTab });
    };

    const handleDeleteConfirm = async () => {
        try {
            const { item, type } = deleteDialog;
            switch (type) {
                case 'bhajans':
                    await deleteBhajan(item.id);
                    break;
                case 'saints':
                    await deleteSant(item.id);
                    break;
                case 'bhajanTypes':
                    await deleteBhajanType(item.id);
                    break;
                case 'categories':
                    await deleteCategory(item.id);
                    break;
                case 'labels':
                    await deleteLabel(item.id);
                    break;
            }
            showToast('यशस्वीरित्या हटवले!', 'success');
            setDeleteDialog({ isOpen: false, item: null, type: '' });
            fetchData();
        } catch (error) {
            showToast('त्रुटी: ' + error.message, 'error');
        }
    };

    const handleUserRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            showToast('वापरकर्ता भूमिका अपडेट केली!', 'success');
            fetchData();
        } catch (error) {
            showToast('त्रुटी: ' + error.message, 'error');
        }
    };

    const resetForm = () => {
        setFormData({});
        setEditingItem(null);
        setShowForm(false);
    };

    const renderForm = () => {
        if (activeTab === 'users') return null;

        return (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {editingItem ? 'संपादित करा' : 'नवीन जोडा'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'bhajans' && (
                        <>
                            <input type="text" placeholder="शीर्षक *" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-3 py-2 border rounded" />

                            {/* Bhajan Type (Bhajanache Prakar) */}
                            <select
                                value={formData.category || ''}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                                required
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="">भजनाचा प्रकार निवडा *</option>
                                {bhajanTypes.map(type => (
                                    <option key={type.id} value={type.name}>{type.name}</option>
                                ))}
                            </select>

                            {/* Category (Shreni) - Multi-select */}
                            <div className="space-y-1">
                                <label className="text-sm text-gray-600">श्रेणी (Shreni)</label>
                                <div className="flex flex-wrap gap-2 mb-2 min-h-[30px] p-2 border rounded bg-gray-50">
                                    {(!formData.subcategory || formData.subcategory.length === 0) && (
                                        <span className="text-gray-400 text-sm">श्रेणी निवडलेली नाही</span>
                                    )}
                                    {(formData.subcategory || []).map((sub, index) => (
                                        <span key={index} className="bg-saffron-100 text-saffron-800 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                            {sub}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newSubs = formData.subcategory.filter(s => s !== sub);
                                                    setFormData({ ...formData, subcategory: newSubs });
                                                }}
                                                className="hover:text-red-600 rounded-full p-0.5"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val && !formData.subcategory?.includes(val)) {
                                            setFormData({
                                                ...formData,
                                                subcategory: [...(formData.subcategory || []), val]
                                            });
                                        }
                                    }}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">श्रेणी निवडा (Add Category)</option>
                                    {categories
                                        .filter(cat => !formData.category || bhajanTypes.find(bt => bt.name === formData.category)?.id === cat.bhajanTypeId)
                                        .map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Sant */}
                            <select
                                value={formData.sant || ''}
                                onChange={(e) => setFormData({ ...formData, sant: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="">संत निवडा</option>
                                {saints.map(sant => (
                                    <option key={sant.id} value={sant.name}>{sant.name}</option>
                                ))}
                            </select>

                            <textarea placeholder="ओळी *" value={formData.lyrics || ''} onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })} required rows="6" className="w-full px-3 py-2 border rounded" />

                            {/* Labels (Tags) */}
                            <select
                                value={formData.tags || ''}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="">लेबल निवडा</option>
                                {labels.map(label => (
                                    <option key={label.id} value={label.name}>{label.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">सध्या एकच लेबल निवडता येईल.</p>
                        </>
                    )}
                    {activeTab === 'saints' && (
                        <>
                            <input type="text" placeholder="नाव *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border rounded" />
                            <textarea placeholder="वर्णन" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full px-3 py-2 border rounded" />
                            <input type="text" placeholder="जन्मस्थान" value={formData.birthPlace || ''} onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} className="w-full px-3 py-2 border rounded" />
                            <input type="text" placeholder="काळ" value={formData.era || ''} onChange={(e) => setFormData({ ...formData, era: e.target.value })} className="w-full px-3 py-2 border rounded" />
                        </>
                    )}
                    {(activeTab === 'bhajanTypes' || activeTab === 'labels') && (
                        <>
                            <input type="text" placeholder="नाव *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border rounded" />
                            <textarea placeholder="वर्णन" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full px-3 py-2 border rounded" />
                        </>
                    )}
                    {activeTab === 'categories' && (
                        <>
                            <input type="text" placeholder="नाव *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border rounded" />
                            <select value={formData.bhajanTypeId || ''} onChange={(e) => setFormData({ ...formData, bhajanTypeId: e.target.value })} required className="w-full px-3 py-2 border rounded">
                                <option value="">भजनाचा प्रकार निवडा *</option>
                                {bhajanTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                            </select>
                            <textarea placeholder="वर्णन" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full px-3 py-2 border rounded" />
                        </>
                    )}
                    {activeTab === 'settings' && (
                        <>
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">अॅप सेटिंग्ज</h3>
                                <input type="text" placeholder="अॅप नाव" value={formData.appName || ''} onChange={(e) => setFormData({ ...formData, appName: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                <input type="text" placeholder="स्प्लॅश स्क्रीन मजकूर" value={formData.splashText || ''} onChange={(e) => setFormData({ ...formData, splashText: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                <textarea placeholder="लॉगिन संदेश" value={formData.loginMessage || ''} onChange={(e) => setFormData({ ...formData, loginMessage: e.target.value })} rows="2" className="w-full px-3 py-2 border rounded" />
                                <input type="color" value={formData.primaryColor || '#FF6B35'} onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })} className="w-full px-3 py-2 border rounded" />
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" checked={formData.enableRegistration || false} onChange={(e) => setFormData({ ...formData, enableRegistration: e.target.checked })} />
                                    <span>नोंदणी सक्षम करा</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" checked={formData.maintenanceMode || false} onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })} />
                                    <span>देखभाल मोड</span>
                                </label>
                            </div>

                            <div className="space-y-4 mt-6">
                                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">संपर्क पृष्ठ</h3>
                                <input
                                    type="text"
                                    placeholder="पृष्ठ शीर्षक"
                                    value={formData.aboutTitle || ''}
                                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <textarea
                                    placeholder="पृष्ठ वर्णन (मजकूर)"
                                    value={formData.aboutDescription || ''}
                                    onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                                    rows="6"
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <p className="text-xs text-gray-500">हे मजकूर "भजन मंडळाशी संपर्क साधा" पृष्ठावर दिसेल.</p>
                            </div>

                            <div className="space-y-4 mt-6">
                                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">संपर्क माहिती</h3>
                                <input
                                    type="tel"
                                    placeholder="मोबाईल नंबर"
                                    value={formData.contactPhone || ''}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="email"
                                    placeholder="ईमेल (Optional)"
                                    value={formData.contactEmail || ''}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div className="space-y-4 mt-6">
                                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">सोशल मीडिया</h3>
                                <input
                                    type="url"
                                    placeholder="Facebook URL"
                                    value={formData.facebookUrl || ''}
                                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="Instagram URL"
                                    value={formData.instagramUrl || ''}
                                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="YouTube URL"
                                    value={formData.youtubeUrl || ''}
                                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="tel"
                                    placeholder="WhatsApp Number (Optional)"
                                    value={formData.whatsappNumber || ''}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </>
                    )}
                    <div className="flex gap-3">
                        <button type="submit" className="bg-saffron-600 text-white px-6 py-2 rounded hover:bg-saffron-700">{editingItem ? 'अपडेट करा' : 'जोडा'}</button>
                        <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">रद्द करा</button>
                    </div>
                </form>
            </div>
        );
    };

    const renderTable = () => {
        let data = [];
        let columns = [];

        switch (activeTab) {
            case 'bhajans':
                data = bhajans;
                columns = ['शीर्षक', 'भजनाचा प्रकार', 'श्रेणी', 'संत', 'क्रिया'];
                break;
            case 'saints':
                data = saints;
                columns = ['नाव', 'जन्मस्थान', 'काळ', 'क्रिया'];
                break;
            case 'bhajanTypes':
                data = bhajanTypes;
                columns = ['नाव', 'वर्णन', 'क्रिया'];
                break;
            case 'categories':
                data = categories;
                columns = ['नाव', 'भजनाचा प्रकार', 'क्रिया'];
                break;
            case 'labels':
                data = labels;
                columns = ['नाव', 'वर्णन', 'क्रिया'];
                break;
            case 'users':
                data = users;
                columns = ['ईमेल', 'नाव', 'भूमिका', 'क्रिया'];
                break;
        }

        if (activeTab === 'settings') {
            return appSettings && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">अॅप सेटिंग्ज</h3>
                        <button onClick={() => handleEdit(appSettings)} className="text-blue-600 hover:text-blue-800">संपादित करा</button>
                    </div>
                    <div className="space-y-3">
                        <div><strong>अॅप नाव:</strong> {appSettings.appName}</div>
                        <div><strong>स्प्लॅश मजकूर:</strong> {appSettings.splashText}</div>
                        <div><strong>लॉगिन संदेश:</strong> {appSettings.loginMessage}</div>
                        <div><strong>प्राथमिक रंग:</strong> <span className="inline-block w-6 h-6 rounded" style={{ backgroundColor: appSettings.primaryColor }}></span> {appSettings.primaryColor}</div>
                        <div><strong>नोंदणी:</strong> {appSettings.enableRegistration ? 'सक्षम' : 'अक्षम'}</div>
                        <div><strong>देखभाल मोड:</strong> {appSettings.maintenanceMode ? 'चालू' : 'बंद'}</div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-saffron-50 border-b">
                    <h3 className="font-bold text-saffron-900">एकूण: {data.length}</h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-gray-500">लोड होत आहे...</div>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">कोणताही डेटा नाही</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((col, i) => (
                                        <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        {activeTab === 'bhajans' && (
                                            <>
                                                <td className="px-4 py-3 text-sm">{item.title}</td>
                                                <td className="px-4 py-3 text-sm">{item.category}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {Array.isArray(item.subcategory)
                                                        ? item.subcategory.join(', ')
                                                        : (item.subcategory || '-')}
                                                </td>
                                                <td className="px-4 py-3 text-sm">{item.sant || '-'}</td>
                                            </>
                                        )}
                                        {activeTab === 'saints' && (
                                            <>
                                                <td className="px-4 py-3 text-sm">{item.name}</td>
                                                <td className="px-4 py-3 text-sm">{item.birthPlace || '-'}</td>
                                                <td className="px-4 py-3 text-sm">{item.era || '-'}</td>
                                            </>
                                        )}
                                        {(activeTab === 'bhajanTypes' || activeTab === 'labels') && (
                                            <>
                                                <td className="px-4 py-3 text-sm">{item.name}</td>
                                                <td className="px-4 py-3 text-sm">{item.description || '-'}</td>
                                            </>
                                        )}
                                        {activeTab === 'categories' && (
                                            <>
                                                <td className="px-4 py-3 text-sm">{item.name}</td>
                                                <td className="px-4 py-3 text-sm">{bhajanTypes.find(t => t.id === item.bhajanTypeId)?.name || '-'}</td>
                                            </>
                                        )}
                                        {activeTab === 'users' && (
                                            <>
                                                <td className="px-4 py-3 text-sm">{item.email}</td>
                                                <td className="px-4 py-3 text-sm">{item.displayName || '-'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <select value={item.role || 'user'} onChange={(e) => handleUserRoleChange(item.id, e.target.value)} className="border rounded px-2 py-1">
                                                        <option value="user">वापरकर्ता</option>
                                                        <option value="admin">ॲडमिन</option>
                                                    </select>
                                                </td>
                                            </>
                                        )}
                                        <td className="px-4 py-3 text-sm">
                                            {activeTab !== 'users' && (
                                                <>
                                                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 size={16} className="inline" /> संपादित करा</button>
                                                    <button onClick={() => handleDeleteClick(item)} className="text-red-600 hover:text-red-800"><Trash2 size={16} className="inline" /> हटवा</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-saffron-900">ॲडमिन पॅनेल</h2>
                {activeTab !== 'users' && activeTab !== 'settings' && activeTab !== 'events' && activeTab !== 'members' && (
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-saffron-600 text-white px-4 py-2 rounded hover:bg-saffron-700">
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                        {showForm ? 'रद्द करा' : 'नवीन जोडा'}
                    </button>
                )}
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'events' ? (
                <Events />
            ) : activeTab === 'members' ? (
                <Members />
            ) : (
                <>
                    {showForm && renderForm()}
                    {renderTable()}
                </>
            )}

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, item: null, type: '' })}
                onConfirm={handleDeleteConfirm}
                title="हटवा"
                message="तुम्हाला खात्री आहे की तुम्ही हे हटवू इच्छिता? ही क्रिया पूर्ववत करता येणार नाही."
            />
        </div>
    );
};

export default AdminPanel;
