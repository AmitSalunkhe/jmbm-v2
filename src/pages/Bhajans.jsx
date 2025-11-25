import React, { useEffect, useState } from 'react';
import { getBhajans } from '../services/firestoreService';
import { Heart } from 'lucide-react';
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
    return <div className="p-4 text-center text-gray-500">लोड होत आहे...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-saffron-900 mb-4">भजन संग्रह</h2>

      {/* Search Box */}
      <InlineSearch
        data={bhajans}
        onFilter={setFilteredBhajans}
        placeholder="अभंग शोधा... (नाव, संत, श्रेणी)"
      />

      {filteredBhajans.length === 0 ? (
        <p className="text-gray-600">कोणतेही भजन सापडले नाहीत.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBhajans.map(bhajan => (
            <div
              key={bhajan.id}
              onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
              className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-saffron-500 relative cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(bhajan);
                  }}
                >
                  <Heart
                    size={24}
                    className={`transition-colors ${isFavorite(bhajan.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                      }`}
                  />
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
    </div>
  );
};

export default Bhajans;
