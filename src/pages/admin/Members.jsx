import React, { useState, useEffect } from 'react';
import { getMembers, addMember, updateMember, deleteMember } from '../../services/firestoreService';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import InlineSearch from '../../components/InlineSearch';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        skill: '',
        position: '',
        photoUrl: '',
        order: 1
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
        setFilteredMembers(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                await updateMember(editingMember.id, formData);
            } else {
                await addMember(formData);
            }
            await fetchMembers();
            resetForm();
        } catch (error) {
            alert('Error saving member: ' + error.message);
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            skill: member.skill,
            position: member.position,
            photoUrl: member.photoUrl || '',
            order: member.order || 1
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('या सदस्याला delete करायचे आहे का?')) {
            try {
                await deleteMember(id);
                await fetchMembers();
            } catch (error) {
                alert('Error deleting member: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            skill: '',
            position: '',
            photoUrl: '',
            order: 1
        });
        setEditingMember(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="p-6 text-center">लोड होत आहे...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">सभासद</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-saffron-600 text-white px-4 py-2 rounded-lg hover:bg-saffron-700"
                >
                    <Plus size={20} />
                    नवीन सदस्य
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        {editingMember ? 'सदस्य Edit करा' : 'नवीन सदस्य Add करा'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">नाव *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">कला (Skill) *</label>
                                <input
                                    type="text"
                                    value={formData.skill}
                                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                                    required
                                    placeholder="उदा. गायक, वादक"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">पद (Position) *</label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    required
                                    placeholder="उदा. अध्यक्ष, सचिव"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Photo URL</label>
                            <input
                                type="url"
                                value={formData.photoUrl}
                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Display Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                min="1"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-saffron-600 text-white px-6 py-2 rounded-lg hover:bg-saffron-700"
                            >
                                {editingMember ? 'Update करा' : 'Add करा'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <InlineSearch
                data={members}
                onFilter={setFilteredMembers}
                placeholder="सदस्य शोधा..."
            />

            {/* Members List */}
            {filteredMembers.length === 0 ? (
                <p className="text-gray-600 text-center py-8">कोणतेही सदस्य नाहीत.</p>
            ) : (
                <div className="grid gap-4">
                    {filteredMembers.map(member => (
                        <div key={member.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-saffron-500">
                            <div className="flex items-start gap-4">
                                {member.photoUrl ? (
                                    <img
                                        src={member.photoUrl}
                                        alt={member.name}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User size={32} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                    <p className="text-saffron-600 font-medium">{member.skill}</p>
                                    <p className="text-gray-600">{member.position}</p>
                                    <p className="text-sm text-gray-500 mt-1">Order: {member.order}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Members;
