import React, { useState, useEffect } from 'react';
import { getAppSettings, getMembers } from '../services/firestoreService';
import { Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, User } from 'lucide-react';

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
            <div className="p-4 text-center text-gray-500">
                लोड होत आहे...
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            {/* Organization Info */}
            <div>
                <h2 className="text-2xl font-bold text-saffron-900 mb-4">
                    {settings?.aboutTitle || 'मंडळाविषयी'}
                </h2>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {settings?.aboutDescription || 'जननी माता भजन मंडळ, मोरावळे.\n\nआमचे उद्दिष्ट वारकरी संप्रदायाचा प्रसार करणे आणि गावात भक्तीमय वातावरण निर्माण करणे हे आहे.'}
                    </p>
                </div>
            </div>

            {/* Members Section */}
            {members.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-saffron-900 mb-4">सभासद</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map(member => (
                            <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm text-center">
                                {member.photoUrl ? (
                                    <img
                                        src={member.photoUrl}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                )}
                                <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
                                <p className="text-saffron-600 font-medium">{member.skill}</p>
                                <p className="text-gray-600 text-sm">{member.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Info */}
            {(settings?.contactPhone || settings?.contactEmail) && (
                <div>
                    <h2 className="text-2xl font-bold text-saffron-900 mb-4">संपर्क माहिती</h2>
                    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                        {settings?.contactPhone && (
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-saffron-600" />
                                <a href={`tel:${settings.contactPhone}`} className="text-gray-700 hover:text-saffron-600">
                                    {settings.contactPhone}
                                </a>
                            </div>
                        )}
                        {settings?.contactEmail && (
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-saffron-600" />
                                <a href={`mailto:${settings.contactEmail}`} className="text-gray-700 hover:text-saffron-600">
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
                    <h2 className="text-2xl font-bold text-saffron-900 mb-4">सोशल मीडिया</h2>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex gap-4 justify-center">
                            {settings?.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                    <Facebook size={36} />
                                </a>
                            )}
                            {settings?.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                                    <Instagram size={36} />
                                </a>
                            )}
                            {settings?.youtubeUrl && (
                                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                                    <Youtube size={36} />
                                </a>
                            )}
                            {settings?.whatsappNumber && (
                                <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                                    <MessageCircle size={36} />
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
