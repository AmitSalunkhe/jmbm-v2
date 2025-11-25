import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = () => {
        const stored = localStorage.getItem('favoriteBhajans');
        if (stored) {
            setFavorites(JSON.parse(stored));
        }
    };

    const removeFavorite = (bhajanId) => {
        const updated = favorites.filter(b => b.id !== bhajanId);
        setFavorites(updated);
        localStorage.setItem('favoriteBhajans', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        if (window.confirm('तुम्हाला खात्री आहे की तुम्ही सर्व आवडीचे भजन हटवू इच्छिता?')) {
            setFavorites([]);
            localStorage.removeItem('favoriteBhajans');
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-saffron-900">आवडीचे भजन</h2>
                {favorites.length > 0 && (
                    <button
                        onClick={clearAllFavorites}
                        className="text-sm text-red-600 hover:text-red-800"
                    >
                        सर्व हटवा
                    </button>
                )}
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={40} className="text-saffron-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        कोणतेही आवडीचे भजन नाही
                    </h3>
                    <p className="text-gray-600 mb-4">
                        भजनांच्या यादीतून आवडीचे भजन जोडा
                    </p>
                    <p className="text-sm text-gray-500">
                        ❤️ आयकॉनवर क्लिक करून भजन आवडीत जोडा
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((bhajan) => (
                        <div
                            key={bhajan.id}
                            onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
                            className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-saffron-500 relative cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFavorite(bhajan.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 pr-10 mb-2">{bhajan.title}</h3>

                            <div className="text-sm space-y-1 mb-3">
                                <p className="text-saffron-700 font-medium">{bhajan.category}
                                    {bhajan.subcategory && <span className="text-gray-500"> • {Array.isArray(bhajan.subcategory) ? bhajan.subcategory.join(', ') : bhajan.subcategory}</span>}
                                </p>
                                {bhajan.sant && (
                                    <p className="text-gray-600">संत: {bhajan.sant}</p>
                                )}
                            </div>

                            <p className="text-gray-600 whitespace-pre-line line-clamp-2 text-sm bg-gray-50 p-2 rounded">
                                {bhajan.lyrics}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {favorites.length > 0 && (
                <div className="mt-6 p-4 bg-saffron-50 rounded-lg border border-saffron-200">
                    <p className="text-sm text-gray-700">
                        <strong>टीप:</strong> आवडीचे भजन तुमच्या डिव्हाइसवर स्थानिकरित्या संग्रहित केले जातात.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Favorites;
