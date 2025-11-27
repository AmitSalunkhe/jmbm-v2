import React, { useState, useEffect } from 'react';
import { getAllEvents, addEvent, updateEvent, deleteEvent } from '../../services/firestoreService';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import InlineSearch from '../../components/InlineSearch';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        const data = await getAllEvents();
        setEvents(data);
        setFilteredEvents(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, formData);
            } else {
                await addEvent(formData);
            }
            await fetchEvents();
            resetForm();
        } catch (error) {
            alert('Error saving event: ' + error.message);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            description: event.description || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('या कार्यक्रमाला delete करायचे आहे का?')) {
            try {
                await deleteEvent(id);
                await fetchEvents();
            } catch (error) {
                alert('Error deleting event: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            date: '',
            time: '',
            location: '',
            description: ''
        });
        setEditingEvent(null);
        setShowForm(false);
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
                    नवीन कार्यक्रम
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-[var(--color-paper-card)] rounded-lg shadow-md p-6 mb-6 border border-[var(--color-border-sepia)]">
                    <h2 className="text-xl font-bold mb-4 text-[var(--color-maroon-main)]">
                        {editingEvent ? 'कार्यक्रम Edit करा' : 'नवीन कार्यक्रम Add करा'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">कार्यक्रमाचे नाव *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">तारीख *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">वेळ *</label>
                                <input
                                    type="text"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                    placeholder="उदा. सकाळी 10:00"
                                    className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">ठिकाण *</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--color-ink-primary)]">तपशील (Optional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border rounded bg-[var(--color-paper-base)] border-[var(--color-border-sepia)] focus:outline-none focus:border-[var(--color-maroon-main)]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] px-6 py-2 rounded hover:bg-[var(--color-maroon-light)] font-bold"
                            >
                                {editingEvent ? 'Update करा' : 'Add करा'}
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
                data={events}
                onFilter={setFilteredEvents}
                placeholder="कार्यक्रम शोधा..."
            />

            {/* Events List */}
            {filteredEvents.length === 0 ? (
                <p className="text-[var(--color-ink-secondary)] text-center py-8">कोणतेही कार्यक्रम नाहीत.</p>
            ) : (
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="bg-[var(--color-paper-card)] rounded-lg shadow-md p-4 border-l-4 border-[var(--color-maroon-main)] border-y border-r border-[var(--color-border-sepia)] relative flex flex-col">
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-1.5 text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)] hover:bg-[var(--color-paper-base)] rounded transition-colors"
                                    title="संपादित करा"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="p-1.5 text-[var(--color-ink-secondary)] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="हटवा"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="pt-6">
                                <h3 className="text-base font-bold text-[var(--color-maroon-main)] mb-3 pr-12">{event.title}</h3>
                                <div className="space-y-1.5 text-[var(--color-ink-secondary)] text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[var(--color-maroon-main)] flex-shrink-0" />
                                        <span className="line-clamp-1">{new Date(event.date).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-[var(--color-maroon-main)] flex-shrink-0" />
                                        <span className="line-clamp-1">{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-[var(--color-maroon-main)] flex-shrink-0" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                    {event.description && (
                                        <p className="mt-2 text-xs text-[var(--color-ink-primary)] line-clamp-2">{event.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
