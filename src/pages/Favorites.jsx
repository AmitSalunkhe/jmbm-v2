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
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center mb-6 border-b-2 border-[var(--color-gold-accent)] pb-2">
                <div className="flex items-center gap-3">
                    <Heart className="text-[var(--color-maroon-main)] fill-[var(--color-maroon-main)]" size={28} />
                    <h2 className="text-2xl font-bold text-[var(--color-maroon-main)]">आवडीचे भजन</h2>
                </div>
                {favorites.length > 0 && (
                    <button
                        onClick={clearAllFavorites}
                        className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 px-3 py-1 rounded bg-red-50"
                    >
                        सर्व हटवा
                    </button>
                )}
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-12 bg-[var(--color-paper-card)] rounded-lg border border-[var(--color-border-sepia)] border-dashed">
                    <div className="w-20 h-20 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-sepia)]">
                        <Heart size={40} className="text-[var(--color-maroon-main)] opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-ink-primary)] mb-2">
                        कोणतेही आवडीचे भजन नाही
                    </h3>
                    <p className="text-[var(--color-ink-secondary)] mb-4">
                        भजनांच्या यादीतून आवडीचे भजन जोडा
                    </p>
                    <p className="text-sm text-[var(--color-ink-secondary)] italic">
                        ❤️ आयकॉनवर क्लिक करून भजन आवडीत जोडा
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((bhajan) => (
                        <div
                            key={bhajan.id}
                            onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
                            className="bg-[var(--color-paper-card)] p-5 rounded-lg shadow-sm border-l-4 border-[var(--color-maroon-main)] relative cursor-pointer hover:shadow-md transition-all border-y border-r border-[var(--color-border-sepia)]"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFavorite(bhajan.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-[var(--color-ink-primary)] pr-10 mb-2">{bhajan.title}</h3>

                            <div className="text-sm space-y-1 mb-3 border-b border-[var(--color-border-sepia)] border-dotted pb-2">
                                <p className="text-[var(--color-maroon-main)] font-medium">{bhajan.category}
                                    {bhajan.subcategory && <span className="text-[var(--color-ink-secondary)] font-normal"> • {Array.isArray(bhajan.subcategory) ? bhajan.subcategory.join(', ') : bhajan.subcategory}</span>}
                                </p>
                                {bhajan.sant && (
                                    <p className="text-[var(--color-ink-secondary)] italic">संत: {bhajan.sant}</p>
                                )}
                            </div>

                            <p className="text-[var(--color-ink-secondary)] whitespace-pre-line line-clamp-2 text-sm bg-[var(--color-paper-base)] p-3 rounded border border-[var(--color-border-sepia)] border-opacity-30 italic">
                                {bhajan.lyrics}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {favorites.length > 0 && (
                <div className="mt-6 p-4 bg-[var(--color-paper-base)] rounded-lg border border-[var(--color-border-sepia)]">
                    <p className="text-sm text-[var(--color-ink-secondary)] italic text-center">
                        <strong>टीप:</strong> आवडीचे भजन तुमच्या डिव्हाइसवर स्थानिकरित्या संग्रहित केले जातात.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Favorites;
