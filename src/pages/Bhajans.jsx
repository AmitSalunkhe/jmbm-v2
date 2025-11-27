import React, { useEffect, useState } from 'react';
import { getBhajans } from '../services/firestoreService';
import { Search, Heart, Share2 } from 'lucide-react';
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
      <h2 className="text-2xl font-bold text-[var(--color-maroon-main)] mb-4 text-center border-b-2 border-[var(--color-gold-accent)] pb-2 inline-block w-full">
        अभंग सूची
      </h2>

      <InlineSearch data={bhajans} onFilter={setFilteredBhajans} placeholder="अभंग शोधा..." />

      {loading ? (
        <div className="text-center py-8 text-[var(--color-ink-secondary)] italic">लोड होत आहे...</div>
      ) : (
        <div className="space-y-3">
          {filteredBhajans.map((bhajan, index) => (
            <div
              key={bhajan.id}
              onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
              className="bg-[var(--color-paper-card)] p-4 rounded-lg shadow-sm border border-[var(--color-border-sepia)] hover:border-[var(--color-maroon-main)] transition-all cursor-pointer flex justify-between items-start group relative overflow-hidden"
            >
              {/* Decorative Index Number */}
              <div className="absolute -left-2 -top-2 w-8 h-8 bg-[var(--color-paper-base)] rounded-full border border-[var(--color-border-sepia)] flex items-center justify-center text-[10px] text-[var(--color-ink-secondary)] font-bold opacity-50">
                {index + 1}
              </div>

              <div className="flex-1 pr-4 pl-2">
                <h3 className="font-bold text-lg text-[var(--color-ink-primary)] mb-1 group-hover:text-[var(--color-maroon-main)] transition-colors">
                  {bhajan.title}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-[var(--color-paper-base)] text-[var(--color-maroon-main)] px-2 py-0.5 rounded border border-[var(--color-border-sepia)] font-medium">
                    {bhajan.category}
                  </span>
                  {bhajan.sant && (
                    <span className="text-[var(--color-ink-secondary)] italic flex items-center">
                      - {bhajan.sant}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => handleFavorite(e, bhajan)}
                  className={`p-2 rounded-full transition-colors ${favorites.includes(bhajan.id)
                      ? 'text-red-500 bg-red-50'
                      : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-paper-base)]'
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
            <div className="text-center py-8 text-[var(--color-ink-secondary)]">
              कोणतेही भजन सापडले नाही
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bhajans;
