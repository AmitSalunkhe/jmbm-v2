import React, { useState, useEffect } from 'react';
import { getMembers, addMember, updateMember, deleteMember } from '../../services/firestoreService';
import { Plus, Edit2, Trash2, User, GripVertical } from 'lucide-react';
import InlineSearch from '../../components/InlineSearch';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
const SortableItem = ({ member, handleEdit, handleDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: member.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-[var(--color-paper-card)] rounded-lg shadow-md p-4 border-l-4 border-[var(--color-maroon-main)] border-y border-r border-[var(--color-border-sepia)] relative"
        >
            <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <GripVertical size={18} className="text-[var(--color-ink-secondary)]" />
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
                <button
                    onClick={() => handleEdit(member)}
                    className="p-1.5 text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)] hover:bg-[var(--color-paper-base)] rounded transition-colors"
                    title="संपादित करा"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1.5 text-[var(--color-ink-secondary)] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="हटवा"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            <div className="flex flex-col items-center text-center pt-6">
                {member.photoUrl ? (
                    <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-border-sepia)] mb-2"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-[var(--color-paper-base)] flex items-center justify-center border-2 border-[var(--color-border-sepia)] mb-2">
                        <User size={28} className="text-[var(--color-ink-secondary)]" />
                    </div>
                )}
                <h3 className="text-base font-bold text-[var(--color-maroon-main)] mb-1">{member.name}</h3>
                <p className="text-sm text-[var(--color-maroon-main)] font-medium">{member.skill}</p>
                <p className="text-xs text-[var(--color-ink-secondary)]">{member.position}</p>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-1">Order: {member.order}</p>
            </div>
        </div>
    );
};

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

    // Drag and drop configuration
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required to start drag
            },
        })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = filteredMembers.findIndex(m => m.id === active.id);
            const newIndex = filteredMembers.findIndex(m => m.id === over.id);

            // Reorder locally for immediate feedback
            const reorderedMembers = arrayMove(filteredMembers, oldIndex, newIndex);
            setFilteredMembers(reorderedMembers);
            setMembers(reorderedMembers);

            // Update order field for all affected members in Firestore
            try {
                const updatePromises = reorderedMembers.map((member, index) =>
                    updateMember(member.id, { ...member, order: index + 1 })
                );
                await Promise.all(updatePromises);
            } catch (error) {
                console.error('Error updating member order:', error);
                alert('त्रुटी: Order update करताना समस्या आली');
                // Revert on error
                await fetchMembers();
            }
        }
    };

    if (loading) {
        return <div className="p-6 text-center">लोड होत आहे...</div>;
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] px-4 py-2 rounded hover:bg-[var(--color-maroon-light)] shadow-sm font-bold"
                >
                    <Plus size={20} />
                    नवीन सदस्य
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-[var(--color-paper-card)] rounded-lg shadow-md p-6 mb-6 border border-[var(--color-border-sepia)]">
                    <h2 className="text-xl font-bold mb-4 text-[var(--color-maroon-main)]">
                        {editingMember ? 'सदस्य Edit करा' : 'नवीन सदस्य Add करा'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">नाव *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">कला (Skill) *</label>
                                <input
                                    type="text"
                                    value={formData.skill}
                                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                                    required
                                    placeholder="उदा. गायक, वादक"
                                    className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">पद (Position) *</label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    required
                                    placeholder="उदा. अध्यक्ष, सचिव"
                                    className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">Photo URL</label>
                            <input
                                type="url"
                                value={formData.photoUrl}
                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">Display Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                min="1"
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] px-6 py-2 rounded hover:bg-[var(--color-maroon-light)] font-bold"
                            >
                                {editingMember ? 'Update करा' : 'Add करा'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-[var(--color-paper-base)] text-[var(--color-ink-primary)] px-6 py-2 rounded hover:bg-[var(--color-paper-card)] border border-[var(--color-border-sepia)]"
                            >
                                रद्द करा
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
                <p className="text-[var(--color-ink-secondary)] text-center py-8">कोणतेही सदस्य नाहीत.</p>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredMembers.map(m => m.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {filteredMembers.map(member => (
                                <SortableItem
                                    key={member.id}
                                    member={member}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
};

export default Members;
