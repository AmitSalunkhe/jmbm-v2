import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const InlineSearch = ({ data, onFilter, placeholder = "शोधा..." }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Minimum 2 characters required for search
        if (searchQuery.trim().length >= 2) {
            const query = searchQuery.toLowerCase();

            // Improved transliteration with consonant-vowel combinations
            const transliterate = (text) => {
                // Consonant + vowel combinations (most common patterns)
                const patterns = {
                    // Special combinations
                    'chh': 'छ', 'ch': 'च', 'kh': 'ख', 'gh': 'घ', 'jh': 'झ',
                    'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ', 'sh': 'श',
                    // Consonants with 'o'
                    'lo': 'लो', 'cho': 'चो', 'no': 'नो', 'po': 'पो', 'ro': 'रो',
                    'so': 'सो', 'to': 'तो', 'do': 'दो', 'mo': 'मो', 'ho': 'हो',
                    'ko': 'को', 'go': 'गो', 'jo': 'जो', 'bo': 'बो', 'vo': 'वो',
                    // Consonants with 'a'
                    'la': 'ला', 'cha': 'चा', 'na': 'ना', 'pa': 'पा', 'ra': 'रा',
                    'sa': 'सा', 'ta': 'ता', 'da': 'दा', 'ma': 'मा', 'ha': 'हा',
                    'ka': 'का', 'ga': 'गा', 'ja': 'जा', 'ba': 'बा', 'va': 'वा',
                    // Consonants with 'i'
                    'li': 'ली', 'chi': 'ची', 'ni': 'नी', 'pi': 'पी', 'ri': 'री',
                    'si': 'सी', 'ti': 'ती', 'di': 'दी', 'mi': 'मी', 'hi': 'ही',
                    'ki': 'की', 'gi': 'गी', 'ji': 'जी', 'bi': 'बी', 'vi': 'वी',
                    // Consonants with 'u'
                    'lu': 'लू', 'chu': 'चू', 'nu': 'नू', 'pu': 'पू', 'ru': 'रू',
                    'su': 'सू', 'tu': 'तू', 'du': 'दू', 'mu': 'मू', 'hu': 'हू',
                    'ku': 'कू', 'gu': 'गू', 'ju': 'जू', 'bu': 'बू', 'vu': 'वू',
                    // Basic consonants
                    'l': 'ल', 'c': 'च', 'n': 'न', 'p': 'प', 'r': 'र',
                    's': 'स', 't': 'त', 'd': 'द', 'm': 'म', 'h': 'ह',
                    'k': 'क', 'g': 'ग', 'j': 'ज', 'b': 'ब', 'v': 'व', 'w': 'व',
                    'y': 'य',
                    // Vowels
                    'aa': 'आ', 'ee': 'ई', 'oo': 'ऊ', 'ai': 'ऐ', 'au': 'औ',
                    'a': 'अ', 'i': 'इ', 'u': 'उ', 'e': 'ए', 'o': 'ओ'
                };

                let result = text;
                // Replace longer patterns first
                Object.keys(patterns).sort((a, b) => b.length - a.length).forEach(eng => {
                    result = result.replace(new RegExp(eng, 'g'), patterns[eng]);
                });
                return result;
            };

            // Common word mappings for perfect accuracy
            const wordMap = {
                'rup': 'रूप', 'roop': 'रूप', 'lochani': 'लोचनी',
                'pahata': 'पाहाता', 'sundar': 'सुंदर', 'sundarte': 'सुंदरते',
                'vitthala': 'विठ्ठल', 'vitthal': 'विठ्ठल', 'vithoba': 'विठोबा',
                'tukaram': 'तुकाराम', 'sant': 'संत',
                'panduranga': 'पांडुरंग', 'pandurang': 'पांडुरंग',
                'namdev': 'नामदेव', 'dnyaneshwar': 'ज्ञानेश्वर',
                'gyaneshwar': 'ज्ञानेश्वर', 'eknath': 'एकनाथ'
            };

            // Try word mapping first, then character transliteration
            const marathiQuery = wordMap[query] || transliterate(query);

            const filtered = data.filter(item => {
                const searchableText = Object.values(item).join(' ').toLowerCase();
                return searchableText.includes(query) || searchableText.includes(marathiQuery);
            });

            onFilter(filtered);
        } else {
            // Show all data if less than 2 characters
            onFilter(data);
        }
    }, [searchQuery, data, onFilter]);

    const clearSearch = () => {
        setSearchQuery('');
        onFilter(data);
    };

    return (
        <div className="mb-4 relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-saffron-500"
                />
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InlineSearch;
