import React, { useState, useEffect, useRef } from 'react';
import { getBhajans } from '../services/firestoreService';
import { Search, X } from 'lucide-react';

const SmartSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [allBhajans, setAllBhajans] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        // Load all bhajans on mount
        const loadBhajans = async () => {
            setLoading(true);
            const data = await getBhajans();
            setAllBhajans(data);
            setLoading(false);
        };
        loadBhajans();

        // Close suggestions when clicking outside
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Minimum 2 characters required for search
        if (searchQuery.trim().length >= 2) {
            const query = searchQuery.toLowerCase();

            // Common phonetic mappings for English -> Marathi (partial)
            const phoneticMap = {
                'vi': 'वि',
                'su': 'सु',
                'pa': 'पा',
                'tu': 'तु',
                'vitthala': 'विठ्ठल',
                'vitthal': 'विठ्ठल',
                'vithoba': 'विठोबा',
                'panduranga': 'पांडुरंग',
                'pandurang': 'पांडुरंग',
                'tukaram': 'तुकाराम',
                'dnyaneshwar': 'ज्ञानेश्वर',
                'gyaneshwar': 'ज्ञानेश्वर',
                'jnaneshwar': 'ज्ञानेश्वर',
                'namdev': 'नामदेव',
                'eknath': 'एकनाथ',
                'abhang': 'अभंग',
                'sant': 'संत',
                'bhajan': 'भजन',
                'hari': 'हरी',
                'rama': 'राम',
                'krishna': 'कृष्ण',
                'shiva': 'शिव',
                'ganesh': 'गणेश',
                'deva': 'देव',
                'prabhu': 'प्रभु',
                'swami': 'स्वामी',
                'maharaj': 'महाराज'
            };

            // Get Marathi equivalent if exists
            const marathiQuery = phoneticMap[query] || query;

            // Filter bhajans that match the search query (partial matching)
            const filtered = allBhajans.filter(bhajan => {
                const title = bhajan.title?.toLowerCase() || '';
                const lyrics = bhajan.lyrics?.toLowerCase() || '';
                const sant = bhajan.sant?.toLowerCase() || '';
                const category = bhajan.category?.toLowerCase() || '';
                const subcategory = Array.isArray(bhajan.subcategory)
                    ? bhajan.subcategory.join(' ').toLowerCase()
                    : (bhajan.subcategory?.toLowerCase() || '');

                // Partial/prefix matching - checks if text contains the query
                const matchesOriginal =
                    title.includes(query) ||
                    lyrics.includes(query) ||
                    sant.includes(query) ||
                    category.includes(query) ||
                    subcategory.includes(query);

                // Search in Marathi equivalent (if different from original)
                const matchesMarathi = marathiQuery !== query && (
                    title.includes(marathiQuery) ||
                    lyrics.includes(marathiQuery) ||
                    sant.includes(marathiQuery) ||
                    category.includes(marathiQuery) ||
                    subcategory.includes(marathiQuery)
                );

                return matchesOriginal || matchesMarathi;
            }).slice(0, 5); // Limit to 5 suggestions

            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, allBhajans]);

    const handleSuggestionClick = (bhajan) => {
        window.location.href = `/bhajan/${bhajan.id}`;
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-xl p-6 shadow-lg" ref={searchRef}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Search size={24} />
                अभंग शोधा
            </h2>

            <div className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder="फक्त 2 अक्षरे टाइप करा... (e.g., 'सु' or 'vi')"
                        className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
                        {suggestions.map((bhajan, index) => (
                            <div
                                key={bhajan.id}
                                onClick={() => handleSuggestionClick(bhajan)}
                                className="p-4 hover:bg-saffron-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-saffron-100 rounded-full flex items-center justify-center">
                                        <span className="text-saffron-600 font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 mb-1 truncate">{bhajan.title}</h4>
                                        <div className="flex flex-wrap gap-2 text-xs mb-1">
                                            {bhajan.sant && (
                                                <span className="text-saffron-600">संत: {bhajan.sant}</span>
                                            )}
                                            {bhajan.category && (
                                                <span className="text-gray-500">• {bhajan.category}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {bhajan.lyrics}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 text-center text-gray-500">
                        लोड होत आहे...
                    </div>
                )}

                {/* No Results */}
                {searchQuery.trim().length >= 2 && !loading && suggestions.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 text-center text-gray-500">
                        कोणतेही परिणाम सापडले नाहीत
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartSearch;
