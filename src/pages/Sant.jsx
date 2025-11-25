import React, { useEffect, useState } from 'react';
import { getSaints, getBhajansBySant } from '../services/firestoreService';
import { User, BookOpen, ChevronRight } from 'lucide-react';

const Sant = () => {
    const [saints, setSaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSant, setSelectedSant] = useState(null);
    const [santBhajans, setSantBhajans] = useState([]);
    const [loadingBhajans, setLoadingBhajans] = useState(false);

    useEffect(() => {
        fetchSaints();
    }, []);

    const fetchSaints = async () => {
        setLoading(true);
        const data = await getSaints();
        setSaints(data);
        setLoading(false);
    };

    const handleSantClick = async (sant) => {
        setSelectedSant(sant);
        setLoadingBhajans(true);
        const bhajans = await getBhajansBySant(sant.name);
        setSantBhajans(bhajans);
        setLoadingBhajans(false);
    };

    const handleBack = () => {
        setSelectedSant(null);
        setSantBhajans([]);
    };

    if (selectedSant) {
        return (
            <div className="p-4">
                <button
                    onClick={handleBack}
                    className="flex items-center text-saffron-600 hover:text-saffron-800 mb-4"
                >
                    <ChevronRight size={20} className="rotate-180" />
                    <span>परत जा</span>
                </button>

                <div className="bg-gradient-to-r from-saffron-500 to-saffron-700 text-white p-6 rounded-lg mb-6">
                    <h2 className="text-3xl font-bold mb-2">{selectedSant.name}</h2>
                    {selectedSant.description && (
                        <p className="text-saffron-50">{selectedSant.description}</p>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    भजने ({santBhajans.length})
                </h3>

                {loadingBhajans ? (
                    <div className="text-center py-8 text-gray-500">लोड होत आहे...</div>
                ) : santBhajans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        या संताची भजने अद्याप उपलब्ध नाहीत
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {santBhajans.map((bhajan) => (
                            <div
                                key={bhajan.id}
                                onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
                                className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-saffron-500 cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <h4 className="text-lg font-bold text-gray-800 mb-2">{bhajan.title}</h4>
                                <div className="text-sm space-y-1 mb-3">
                                    <p className="text-saffron-700 font-medium">{bhajan.category}
                                        {bhajan.subcategory && <span className="text-gray-500"> • {Array.isArray(bhajan.subcategory) ? bhajan.subcategory.join(', ') : bhajan.subcategory}</span>}
                                    </p>
                                </div>
                                <p className="text-gray-600 whitespace-pre-line line-clamp-2 text-sm bg-gray-50 p-2 rounded">
                                    {bhajan.lyrics}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-saffron-900 mb-6">संत</h2>

            {loading ? (
                <div className="text-center py-8 text-gray-500">लोड होत आहे...</div>
            ) : saints.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={40} className="text-saffron-600" />
                    </div>
                    <p className="text-gray-600 mb-4">अद्याप कोणतेही संत जोडलेले नाहीत</p>
                    <p className="text-sm text-gray-500">
                        ॲडमिन पॅनेल मधून संत जोडा
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {saints.map((sant) => (
                        <div
                            key={sant.id}
                            onClick={() => handleSantClick(sant)}
                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-saffron-500"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                                        <User size={24} className="text-saffron-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{sant.name}</h3>
                                        {sant.description && (
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {sant.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sant;
