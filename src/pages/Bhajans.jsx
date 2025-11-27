import React, { useEffect, useState } from 'react';
import { getBhajans } from '../services/firestoreService';
import { Heart, Book } from 'lucide-react';
import InlineSearch from '../components/InlineSearch';

const Bhajans = () => {
  const [bhajans, setBhajans] = useState([]);
  const [filteredBhajans, setFilteredBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchBhajans();
    loadFavorites();
  }, []);

  const fetchBhajans = async () => {
    const data = await getBhajans();
    setBhajans(data);
    setFilteredBhajans(data);
    setLoading(false);
  };

  const loadFavorites = () => {
    const stored = localStorage.getItem('favoriteBhajans');
    if (stored) {
      const favs = JSON.parse(stored);
      setFavorites(favs.map(f => f.id));
    }
  };

  const toggleFavorite = (bhajan) => {
    const stored = localStorage.getItem('favoriteBhajans');
    let favs = stored ? JSON.parse(stored) : [];

    const exists = favs.find(f => f.id === bhajan.id);

    if (exists) {
      favs = favs.filter(f => f.id !== bhajan.id);
      setFavorites(favorites.filter(id => id !== bhajan.id));
    } else {
      favs.push(bhajan);
      setFavorites([...favorites, bhajan.id]);
    }

    localStorage.setItem('favoriteBhajans', JSON.stringify(favs));
  };

  const isFavorite = (bhajanId) => favorites.includes(bhajanId);

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-ink-secondary)] italic">सूची लोड होत आहे...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 border-b-2 border-[var(--color-gold-accent)] pb-2">
        <Book className="text-[var(--color-maroon-main)]" size={28} />
        <h2 className="text-2xl font-bold text-[var(--color-maroon-main)]">भजन संग्रह</h2>
      </div>

      {/* Search Box */}
      <InlineSearch
        data={bhajans}
        onFilter={setFilteredBhajans}
        placeholder="अभंग शोधा... (नाव, संत, श्रेणी)"
      />

      {filteredBhajans.length === 0 ? (
        <div className="text-center py-8 bg-[var(--color-paper-card)] rounded-lg border border-[var(--color-border-sepia)] border-dashed">
          <p className="text-[var(--color-ink-secondary)] italic">कोणतेही भजन सापडले नाहीत.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBhajans.map((bhajan, index) => (
            <div
              key={bhajan.id}
              onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
              className="bg-[var(--color-paper-card)] p-5 rounded-lg shadow-sm border border-[var(--color-border-sepia)] relative cursor-pointer hover:shadow-md hover:border-[var(--color-maroon-main)] transition-all group"
            >
              {/* Index Number */}
              <div className="absolute -left-2 -top-2 w-8 h-8 bg-[var(--color-paper-base)] border border-[var(--color-border-sepia)] rounded-full flex items-center justify-center shadow-sm z-10">
                <span className="text-xs font-bold text-[var(--color-maroon-main)]">{index + 1}</span>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(bhajan);
                  }}
                  className="hover:scale-110 transition-transform"
                >
                  <Heart
                    size={22}
                    className={`transition-colors ${isFavorite(bhajan.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-[var(--color-border-sepia)] hover:text-red-500'
                      }`}
                  />
                </button>
              </div>

              <h3 className="text-lg font-bold text-[var(--color-ink-primary)] pr-8 mb-2 group-hover:text-[var(--color-maroon-main)] transition-colors">{bhajan.title}</h3>

              <div className="text-sm space-y-1 mb-3 border-b border-[var(--color-border-sepia)] border-dotted pb-2">
                <p className="text-[var(--color-maroon-main)] font-semibold">{bhajan.category}
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
    </div>
  );
};

export default Bhajans;
