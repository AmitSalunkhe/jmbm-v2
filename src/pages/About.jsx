import React, { useState, useEffect } from 'react';
import { getAppSettings, getMembers } from '../services/firestoreService';
import { Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, User, Info } from 'lucide-react';

const About = () => {
    const [settings, setSettings] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [settingsData, membersData] = await Promise.all([
                getAppSettings(),
                getMembers()
            ]);
            setSettings(settingsData);
            setMembers(membersData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center text-[var(--color-ink-secondary)] italic">
                माहिती लोड होत आहे...
            </div>
        );
    }

    return (
        <div className="p-4 space-y-8 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3 border-b-2 border-[var(--color-gold-accent)] pb-2">
                <Info className="text-[var(--color-maroon-main)]" size={28} />
                <h2 className="text-2xl font-bold text-[var(--color-maroon-main)]">मंडळाविषयी</h2>
            </div>

            {/* Organization Info - Scroll Style */}
            <div className="bg-[var(--color-paper-card)] p-6 rounded-lg shadow-md border-2 border-[var(--color-border-sepia)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[var(--color-paper-base)] to-transparent opacity-50"></div>
                <h3 className="text-xl font-bold text-[var(--color-ink-primary)] mb-4 border-b border-[var(--color-border-sepia)] border-dotted pb-2 inline-block">
                    {settings?.aboutTitle || 'जननी माता भजन मंडळ'}
                </h3>
                <p className="text-[var(--color-ink-primary)] leading-loose whitespace-pre-line font-medium">
                    {settings?.aboutDescription || 'जननी माता भजन मंडळ, मोरावळे.\n\nआमचे उद्दिष्ट वारकरी संप्रदायाचा प्रसार करणे आणि गावात भक्तीमय वातावरण निर्माण करणे हे आहे.'}
                </p>
                <div className="flex justify-center mt-6">
                    <span className="text-[var(--color-maroon-main)] opacity-60">~ || राम कृष्ण हरी || ~</span>
                </div>
            </div>

            {/* Members Section */}
            {members.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-[var(--color-maroon-main)] mb-4 flex items-center gap-2">
                        <User size={24} />
                        सभासद
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map(member => (
                            <div key={member.id} className="bg-[var(--color-paper-card)] p-4 rounded-lg shadow-sm border border-[var(--color-border-sepia)] text-center hover:border-[var(--color-maroon-main)] transition-colors relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-gold-accent)]"></div>
                                {member.photoUrl ? (
                                    <img
                                        src={member.photoUrl}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-[var(--color-paper-base)] shadow-sm group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-[var(--color-paper-base)] mx-auto mb-3 flex items-center justify-center border-2 border-[var(--color-border-sepia)]">
                                        <User size={40} className="text-[var(--color-maroon-main)] opacity-50" />
                                    </div>
                                )}
                                <h3 className="font-bold text-lg text-[var(--color-ink-primary)]">{member.name}</h3>
                                <p className="text-[var(--color-maroon-main)] font-medium text-sm">{member.skill}</p>
                                <p className="text-[var(--color-ink-secondary)] text-xs italic mt-1">{member.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Info */}
            {(settings?.contactPhone || settings?.contactEmail) && (
                <div>
                    <h3 className="text-xl font-bold text-[var(--color-maroon-main)] mb-4">संपर्क माहिती</h3>
                    <div className="bg-[var(--color-paper-card)] p-5 rounded-lg shadow-sm border border-[var(--color-border-sepia)] space-y-4">
                        {settings?.contactPhone && (
                            <div className="flex items-center gap-4 p-2 hover:bg-[var(--color-paper-base)] rounded transition-colors">
                                <div className="w-10 h-10 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center border border-[var(--color-border-sepia)]">
                                    <Phone size={20} className="text-[var(--color-maroon-main)]" />
                                </div>
                                <a href={`tel:${settings.contactPhone}`} className="text-[var(--color-ink-primary)] font-medium hover:text-[var(--color-maroon-main)]">
                                    {settings.contactPhone}
                                </a>
                            </div>
                        )}
                        {settings?.contactEmail && (
                            <div className="flex items-center gap-4 p-2 hover:bg-[var(--color-paper-base)] rounded transition-colors">
                                <div className="w-10 h-10 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center border border-[var(--color-border-sepia)]">
                                    <Mail size={20} className="text-[var(--color-maroon-main)]" />
                                </div>
                                <a href={`mailto:${settings.contactEmail}`} className="text-[var(--color-ink-primary)] font-medium hover:text-[var(--color-maroon-main)]">
                                    {settings.contactEmail}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Social Media */}
            {(settings?.facebookUrl || settings?.instagramUrl || settings?.youtubeUrl || settings?.whatsappNumber) && (
                <div>
                    <h3 className="text-xl font-bold text-[var(--color-maroon-main)] mb-4">सोशल मीडिया</h3>
                    <div className="bg-[var(--color-paper-card)] p-6 rounded-lg shadow-sm border border-[var(--color-border-sepia)]">
                        <div className="flex gap-6 justify-center">
                            {settings?.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                                    <Facebook size={32} />
                                </a>
                            )}
                            {settings?.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:scale-110 transition-transform">
                                    <Instagram size={32} />
                                </a>
                            )}
                            {settings?.youtubeUrl && (
                                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:scale-110 transition-transform">
                                    <Youtube size={32} />
                                </a>
                            )}
                            {settings?.whatsappNumber && (
                                <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:scale-110 transition-transform">
                                    <MessageCircle size={32} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default About;
