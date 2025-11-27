import React, { useEffect, useState } from 'react';
import { getBhajans } from '../services/firestoreService';
import { Search, Heart, Share2, Music } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import InlineSearch from '../components/InlineSearch';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite, checkIsFavorite, getFavorites } from '../services/firestoreService';

const Bhajans = () => {
  const [bhajans, setBhajans] = useState([]);
  const [filteredBhajans, setFilteredBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // Store IDs for quick lookup
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchBhajans();
  }, []);

  // Load favorites whenever user changes
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (user) {
      const favs = await getFavorites(user.uid);
      setFavorites(favs.map(f => f.id));
    } else {
      const stored = localStorage.getItem('favoriteBhajans');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed.map(b => b.id));
      } else {
        setFavorites([]);
      }
    }
  };

  const fetchBhajans = async () => {
    setLoading(true);
    const data = await getBhajans();
    setBhajans(data);
    setFilteredBhajans(data);
    setLoading(false);
  };

  const handleFavorite = async (e, bhajan) => {
    e.stopPropagation();

    if (user) {
      try {
        const isAdded = await toggleFavorite(user.uid, bhajan);
        if (isAdded) {
          setFavorites(prev => [...prev, bhajan.id]);
          showToast('भजन आवडीत जोडले', 'success');
        } else {
          setFavorites(prev => prev.filter(id => id !== bhajan.id));
          showToast('भजन आवडीतून काढले', 'success');
        }
      } catch (error) {
        showToast('त्रुटी आली', 'error');
      }
    } else {
      // LocalStorage Logic
      let currentFavorites = [];
      const stored = localStorage.getItem('favoriteBhajans');
      if (stored) currentFavorites = JSON.parse(stored);

      const exists = currentFavorites.find(b => b.id === bhajan.id);

      if (exists) {
        const updated = currentFavorites.filter(b => b.id !== bhajan.id);
        localStorage.setItem('favoriteBhajans', JSON.stringify(updated));
        setFavorites(prev => prev.filter(id => id !== bhajan.id));
        showToast('भजन आवडीतून काढले', 'success');
      } else {
        const updated = [...currentFavorites, bhajan];
        localStorage.setItem('favoriteBhajans', JSON.stringify(updated));
        setFavorites(prev => [...prev, bhajan.id]);
        showToast('भजन आवडीत जोडले (स्थानिक)', 'success');
      }
    }
  };

  const handleShare = async (e, bhajan) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: bhajan.title,
          text: `${bhajan.title}\n\n${bhajan.lyrics}\n\n- जननी माता भजन मंडळ App वरून सामायिक`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      showToast('शेअर करणे समर्थित नाही', 'error');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center gap-3 border-b-2 border-[var(--color-gold-accent)] pb-2 mb-4">
        <Music className="text-[var(--color-maroon-main)]" size={28} />
        <h2 className="text-2xl font-bold text-[var(--color-maroon-main)]">अभंग सूची</h2>
      </div>

      <InlineSearch data={bhajans} onFilter={setFilteredBhajans} placeholder="अभंग शोधा..." />

      {loading ? (
        <div className="text-center py-8 text-[var(--color-ink-secondary)] italic">लोड होत आहे...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredBhajans.map((bhajan, index) => (
            <div
              key={bhajan.id}
              onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
              className="bg-[var(--color-paper-card)] p-5 rounded-lg shadow-sm border-l-4 border-[var(--color-maroon-main)] relative cursor-pointer hover:shadow-md transition-all border-y border-r border-[var(--color-border-sepia)] flex flex-col justify-between min-h-[150px]"
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-gold-accent)] rounded-tr-lg opacity-50"></div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[var(--color-ink-primary)] pr-8 line-clamp-2 leading-tight group-hover:text-[var(--color-maroon-main)] transition-colors">
                    {bhajan.title}
                  </h3>
                </div>

                <div className="text-sm space-y-1 mb-3 border-b border-[var(--color-border-sepia)] border-dotted pb-2">
                  <p className="text-[var(--color-maroon-main)] font-medium text-xs uppercase tracking-wide">
                    {bhajan.category}
                  </p>
                  {bhajan.sant && (
                    <p className="text-[var(--color-ink-secondary)] italic text-xs">
                      संत: {bhajan.sant}
                    </p>
                  )}
                </div>

                <p className="text-[var(--color-ink-secondary)] whitespace-pre-line line-clamp-2 text-sm italic opacity-80 mb-4">
                  {bhajan.lyrics}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-[var(--color-border-sepia)] border-opacity-30">
                <button
                  onClick={(e) => handleFavorite(e, bhajan)}
                  className={`p-2 rounded-full transition-colors ${favorites.includes(bhajan.id)
                    ? 'text-red-500 bg-red-50'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-paper-base)] hover:text-[var(--color-maroon-main)]'
                    }`}
                >
                  <Heart size={20} fill={favorites.includes(bhajan.id) ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={(e) => handleShare(e, bhajan)}
                  className="p-2 text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)] hover:bg-[var(--color-paper-base)] rounded-full transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {filteredBhajans.length === 0 && (
            <div className="col-span-full text-center py-8 text-[var(--color-ink-secondary)]">
              कोणतेही भजन सापडले नाही
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bhajans;
