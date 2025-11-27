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
                    <Calendar className="text-[var(--color-maroon-main)]" size={24} />
                    <h2 className="text-xl font-bold text-[var(--color-maroon-main)]">आगामी कार्यक्रम</h2>
                </div>
                {events.length === 0 ? (
                    <div className="bg-[var(--color-paper-card)] rounded-lg shadow-sm p-4 border border-[var(--color-border-sepia)] text-[var(--color-ink-secondary)] text-center italic">
                        सध्या कोणतेही कार्यक्रम नाहीत.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.map(event => (
                            <div key={event.id} className="bg-[var(--color-paper-card)] rounded-lg shadow-sm p-4 border-l-4 border-[var(--color-maroon-main)] border-y border-r border-[var(--color-border-sepia)] hover:shadow-md transition-shadow relative overflow-hidden">
                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--color-gold-accent)] rounded-tr-lg opacity-50"></div>

                                <div className="flex items-start space-x-4 relative z-10">
                                    <div className="bg-[var(--color-paper-base)] text-[var(--color-maroon-main)] rounded-lg p-2 text-center min-w-[60px] border border-[var(--color-border-sepia)] shadow-sm">
                                        <span className="block text-xl font-bold">{new Date(event.date).getDate()}</span>
                                        <span className="text-xs font-medium uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-[var(--color-ink-primary)]">{event.title}</h3>
                                        <p className="text-[var(--color-ink-secondary)] text-sm mb-1">{event.time}, {event.location}</p>
                                        {event.description && (
                                            <p className="text-[var(--color-ink-secondary)] text-sm mt-2 italic border-t border-[var(--color-border-sepia)] border-dotted pt-2 opacity-90">{event.description}</p>
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
                <Link to="/bhajans" className="bg-[var(--color-maroon-main)] rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow border-2 border-[var(--color-gold-accent)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
                    <div className="flex flex-col items-center justify-center h-full relative z-10">
                        <Music size={32} className="mb-2 text-[var(--color-gold-accent)]" />
                        <span className="text-xl font-bold mb-1">भजन संग्रह</span>
                        <span className="text-sm opacity-90 text-[var(--color-paper-base)]">सर्व अभंग पहा</span>
                    </div>
                </Link>
                <Link to="/favorites" className="bg-[var(--color-paper-card)] rounded-lg p-6 text-[var(--color-maroon-main)] shadow-md border-2 border-[var(--color-border-sepia)] hover:border-[var(--color-maroon-main)] transition-colors">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Heart size={32} className="mb-2 text-[var(--color-maroon-light)]" />
                        <span className="text-xl font-bold mb-1">तुमचे आवडते</span>
                        <span className="text-sm text-[var(--color-ink-secondary)]">आवडीचे अभंग</span>
                    </div>
                </Link>
            </div>

            {/* Contact Button */}
            <Link to="/about" className="block bg-[var(--color-paper-card)] rounded-lg p-5 text-[var(--color-ink-primary)] shadow-md border-2 border-[var(--color-border-sepia)] hover:bg-[var(--color-paper-base)] transition-colors">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-lg font-bold text-[var(--color-maroon-main)]">भजन मंडळाशी संपर्क साधा</span>
                    <svg className="w-5 h-5 text-[var(--color-maroon-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Link>
        </div>
    );
};

export default Home;
