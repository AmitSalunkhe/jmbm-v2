import React, { useState, useEffect } from 'react';
import {
    getBhajans, addBhajan, updateBhajan, deleteBhajan,
    getSaints, addSant, updateSant, deleteSant,
    getBhajanTypes, addBhajanType, updateBhajanType, deleteBhajanType,
    getCategories, addCategory, updateCategory, deleteCategory,
    getLabels, addLabel, updateLabel, deleteLabel,
    getUsers, updateUserRole,

    getAllEvents, addEvent, updateEvent, deleteEvent,
    getMembers, addMember, updateMember, deleteMember
} from '../services/firestoreService';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, X, BookOpen, User, FolderOpen, Tag, Users, Settings, Calendar, Loader, Image, Upload } from 'lucide-react';
import TabNavigation from '../components/TabNavigation';
import ConfirmDialog from '../components/ConfirmDialog';
import Events from './admin/Events';
import Members from './admin/Members';
import AppSettings from './admin/AppSettings';
import { uploadImage } from '../services/storageService';

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



    // Form data
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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
                let santData = { ...formData };
                if (imageFile) {
                    setUploading(true);
                    try {
                        const imageUrl = await uploadImage(imageFile, `saints/${Date.now()}_${imageFile.name}`);
                        santData.imageUrl = imageUrl;
                    } catch (error) {
                        console.error("Image upload failed:", error);
                        showToast('Image upload failed', 'error');
                        setUploading(false);
                        return;
                    }
                    setUploading(false);
                }
                await addSant(santData);
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
                let updateData = { ...data };
                if (imageFile) {
                    setUploading(true);
                    try {
                        const imageUrl = await uploadImage(imageFile, `saints/${Date.now()}_${imageFile.name}`);
                        updateData.imageUrl = imageUrl;
                    } catch (error) {
                        console.error("Image upload failed:", error);
                        showToast('Image upload failed', 'error');
                        setUploading(false);
                        return;
                    }
                    setUploading(false);
                }
                await updateSant(editingItem.id, updateData);
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
                era: item.era || '',
                imageUrl: item.imageUrl || ''
            });
            setImageFile(null);
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
            <div className="bg-[var(--color-paper-card)] p-6 rounded-lg shadow-md mb-6 border border-[var(--color-border-sepia)]">
                <h3 className="text-xl font-bold text-[var(--color-maroon-main)] mb-4">
                    {editingItem ? 'संपादित करा' : 'नवीन जोडा'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'bhajans' && (
                        <>
                            <input type="text" placeholder="शीर्षक *" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />

                            {/* Bhajan Type (Bhajanache Prakar) */}
                            <select
                                value={formData.category || ''}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                                required
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]"
                            >
                                <option value="">भजनाचा प्रकार निवडा *</option>
                                {bhajanTypes.map(type => (
                                    <option key={type.id} value={type.name}>{type.name}</option>
                                ))}
                            </select>

                            {/* Category (Shreni) - Multi-select */}
                            <div className="space-y-1">
                                <label className="text-sm text-[var(--color-ink-secondary)]">श्रेणी (Shreni)</label>
                                <div className="flex flex-wrap gap-2 mb-2 min-h-[30px] p-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]">
                                    {(!formData.subcategory || formData.subcategory.length === 0) && (
                                        <span className="text-[var(--color-ink-secondary)] text-sm opacity-50">श्रेणी निवडलेली नाही</span>
                                    )}
                                    {(formData.subcategory || []).map((sub, index) => (
                                        <span key={index} className="bg-[var(--color-paper-card)] text-[var(--color-maroon-main)] text-sm px-2 py-1 rounded-full flex items-center gap-1 border border-[var(--color-border-sepia)]">
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
                                    className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]"
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
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]"
                            >
                                <option value="">संत निवडा</option>
                                {saints.map(sant => (
                                    <option key={sant.id} value={sant.name}>{sant.name}</option>
                                ))}
                            </select>

                            <textarea placeholder="ओळी *" value={formData.lyrics || ''} onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })} required rows="6" className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />

                            {/* Labels (Tags) */}
                            <select
                                value={formData.tags || ''}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]"
                            >
                                <option value="">लेबल निवडा</option>
                                {labels.map(label => (
                                    <option key={label.id} value={label.name}>{label.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-[var(--color-ink-secondary)] mt-1">सध्या एकच लेबल निवडता येईल.</p>
                        </>
                    )}
                    {activeTab === 'saints' && (
                        <>
                            <div className="flex justify-center mb-6">
                                <div className="relative w-32 h-32 rounded-full border-4 border-[var(--color-border-sepia)] overflow-hidden bg-[var(--color-paper-base)] shadow-md group">
                                    {imageFile ? (
                                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Current" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[var(--color-paper-card)]">
                                            <User size={48} className="text-[var(--color-ink-secondary)] opacity-50" />
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center cursor-pointer transition-all">
                                        <Upload className="text-white opacity-0 group-hover:opacity-100" size={24} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[var(--color-ink-secondary)] mb-1">किंवा इमेज URL टाका (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.imageUrl || ''}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]"
                                />
                            </div>
                            <input type="text" placeholder="नाव *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                            <textarea placeholder="वर्णन" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                            <input type="text" placeholder="जन्मस्थान" value={formData.birthPlace || ''} onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                            <input type="text" placeholder="काळ" value={formData.era || ''} onChange={(e) => setFormData({ ...formData, era: e.target.value })} className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                        </>
                    )}
                    {(activeTab === 'bhajanTypes' || activeTab === 'labels') && (
                        <>
                            <input type="text" placeholder="नाव *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                            <textarea placeholder="वर्णन" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                        </>
                    )}
                    {activeTab === 'categories' && (
                        <>
                            <input type="text" placeholder="नाव *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                            <select value={formData.bhajanTypeId || ''} onChange={(e) => setFormData({ ...formData, bhajanTypeId: e.target.value })} required className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]">
                                <option value="">भजनाचा प्रकार निवडा *</option>
                                {bhajanTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                            </select>
                            <textarea placeholder="वर्णन" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]" />
                        </>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] px-6 py-2 rounded hover:bg-[var(--color-maroon-light)] font-bold disabled:opacity-50 flex items-center gap-2"
                        >
                            {uploading ? <Loader className="animate-spin" size={18} /> : null}
                            {uploading ? 'अपलोड करत आहे...' : (editingItem ? 'अपडेट करा' : 'जोडा')}
                        </button>
                        <button type="button" onClick={resetForm} className="bg-[var(--color-paper-base)] text-[var(--color-ink-primary)] px-6 py-2 rounded hover:bg-[var(--color-paper-card)] border border-[var(--color-border-sepia)]">रद्द करा</button>
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



        return (
            <div className="bg-[var(--color-paper-card)] rounded-lg shadow-md overflow-hidden border border-[var(--color-border-sepia)]">
                <div className="p-4 bg-[var(--color-paper-base)] border-b border-[var(--color-border-sepia)]">
                    <h3 className="font-bold text-[var(--color-maroon-main)]">एकूण: {data.length}</h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-[var(--color-ink-secondary)] italic">लोड होत आहे...</div>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center text-[var(--color-ink-secondary)]">कोणताही डेटा नाही</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--color-paper-base)]">
                                <tr>
                                    {columns.map((col, i) => (
                                        <th key={i} className="px-4 py-3 text-left text-sm font-bold text-[var(--color-maroon-main)] border-b border-[var(--color-border-sepia)]">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border-sepia)]">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-[var(--color-paper-base)] transition-colors">
                                        {activeTab === 'bhajans' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-primary)] font-medium">{item.title}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">{item.category}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">
                                                    {Array.isArray(item.subcategory)
                                                        ? item.subcategory.join(', ')
                                                        : (item.subcategory || '-')}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">{item.sant || '-'}</td>
                                            </>
                                        )}
                                        {activeTab === 'saints' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-primary)] font-medium">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">{item.birthPlace || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">{item.era || '-'}</td>
                                            </>
                                        )}
                                        {(activeTab === 'bhajanTypes' || activeTab === 'labels') && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-primary)] font-medium">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">{item.description || '-'}</td>
                                            </>
                                        )}
                                        {activeTab === 'categories' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-primary)] font-medium">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">{bhajanTypes.find(t => t.id === item.bhajanTypeId)?.name || '-'}</td>
                                            </>
                                        )}
                                        {activeTab === 'users' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-primary)]">{item.email}</td>
                                                <td className="px-4 py-3 text-sm text-[var(--color-ink-secondary)]">{item.displayName || '-'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <select value={item.role || 'user'} onChange={(e) => handleUserRoleChange(item.id, e.target.value)} className="border rounded px-2 py-1 bg-[var(--color-paper-base)] border-[var(--color-border-sepia)]">
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
        <div className="p-4 max-w-7xl mx-auto pb-24">
            <div className="mb-6 border-b-2 border-[var(--color-gold-accent)] pb-2">
                <h2 className="text-2xl font-bold text-[var(--color-maroon-main)]">ॲडमिन पॅनेल</h2>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab !== 'users' && activeTab !== 'settings' && activeTab !== 'events' && activeTab !== 'members' && (
                <div className="mb-4 flex justify-end">
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] px-4 py-2 rounded hover:bg-[var(--color-maroon-light)] shadow-sm font-bold">
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                        {showForm ? 'रद्द करा' : 'नवीन जोडा'}
                    </button>
                </div>
            )}

            {activeTab === 'events' ? (
                <Events />
            ) : activeTab === 'members' ? (
                <Members />
            ) : activeTab === 'settings' ? (
                <AppSettings />
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
