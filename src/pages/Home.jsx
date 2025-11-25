import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingEvents } from '../services/firestoreService';
import DailyContent from '../components/DailyContent';
import SmartSearch from '../components/SmartSearch';
import { Music, Heart, Calendar } from 'lucide-react';

const Home = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getUpcomingEvents();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-6">
            {/* 1. Smart Search with Auto-suggestions */}
            <SmartSearch />

            {/* 2. Upcoming Events (Admin Managed) */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Calendar className="text-saffron-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">आगामी कार्यक्रम</h2>
                </div>
                {events.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-gray-500 text-center">
                        सध्या कोणतेही कार्यक्रम नाहीत.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.map(event => (
                            <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-saffron-100 text-saffron-900 rounded-lg p-2 text-center min-w-[60px]">
                                        <span className="block text-xl font-bold">{new Date(event.date).getDate()}</span>
                                        <span className="text-xs font-medium">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                                        <p className="text-gray-600 text-sm">{event.time}, {event.location}</p>
                                        {event.description && (
                                            <p className="text-gray-500 text-sm mt-2">{event.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Daily Content - AI Generated */}
            <DailyContent />

            {/* 4. Bhajan Sangrah, 5. Tumche Avadte Abhang, 6. Contact */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/bhajans" className="bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Music size={32} className="mb-2" />
                        <span className="text-xl font-bold mb-1">भजन संग्रह</span>
                        <span className="text-sm opacity-90">सर्व अभंग पहा</span>
                    </div>
                </Link>
                <Link to="/favorites" className="bg-white rounded-xl p-6 text-saffron-900 shadow-md border-2 border-saffron-200 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Heart size={32} className="mb-2 text-red-500" />
                        <span className="text-xl font-bold mb-1">तुमचे आवडते</span>
                        <span className="text-sm text-gray-600">आवडीचे अभंग</span>
                    </div>
                </Link>
            </div>

            {/* Contact Button */}
            <Link to="/about" className="block bg-gradient-to-r from-orange-500 to-saffron-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-lg font-bold">भजन मंडळाशी संपर्क साधा</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Link>
        </div>
    );
};

export default Home;
