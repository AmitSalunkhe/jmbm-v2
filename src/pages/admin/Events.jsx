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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">आगामी कार्यक्रम</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-saffron-600 text-white px-4 py-2 rounded-lg hover:bg-saffron-700"
                >
                    <Plus size={20} />
                    नवीन कार्यक्रम
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        {editingEvent ? 'कार्यक्रम Edit करा' : 'नवीन कार्यक्रम Add करा'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">कार्यक्रमाचे नाव *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">तारीख *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">वेळ *</label>
                                <input
                                    type="text"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                    placeholder="उदा. सकाळी 10:00"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">ठिकाण *</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">तपशील (Optional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-saffron-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-saffron-600 text-white px-6 py-2 rounded-lg hover:bg-saffron-700"
                            >
                                {editingEvent ? 'Update करा' : 'Add करा'}
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
                data={events}
                onFilter={setFilteredEvents}
                placeholder="कार्यक्रम शोधा..."
            />

            {/* Events List */}
            {filteredEvents.length === 0 ? (
                <p className="text-gray-600 text-center py-8">कोणतेही कार्यक्रम नाहीत.</p>
            ) : (
                <div className="grid gap-4">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-saffron-500">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                                    <div className="space-y-2 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={18} className="text-saffron-600" />
                                            <span>{new Date(event.date).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} className="text-saffron-600" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={18} className="text-saffron-600" />
                                            <span>{event.location}</span>
                                        </div>
                                        {event.description && (
                                            <p className="mt-2 text-sm">{event.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
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

export default Events;
