import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBhajanById } from '../services/firestoreService';
import { ChevronLeft, Heart, Share2, ZoomIn, ZoomOut, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite, checkIsFavorite } from '../services/firestoreService';

const BhajanDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bhajan, setBhajan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18); // Default font size
    const [isFavorite, setIsFavorite] = useState(false);
    const { showToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        const fetchBhajan = async () => {
            const data = await getBhajanById(id);
            if (data) {
                setBhajan(data);
                checkFavoriteStatus(data.id);
            }
            setLoading(false);
        };
        fetchBhajan();
    }, [id, user]);

    const checkFavoriteStatus = async (bhajanId) => {
        if (user) {
            const status = await checkIsFavorite(user.uid, bhajanId);
            setIsFavorite(status);
        } else {
            const stored = localStorage.getItem('favoriteBhajans');
            if (stored) {
                const favorites = JSON.parse(stored);
                setIsFavorite(favorites.some(b => b.id === bhajanId));
            }
        }
    };

    const handleFavorite = async () => {
        if (!bhajan) return;

        if (user) {
            try {
                const isAdded = await toggleFavorite(user.uid, bhajan);
                setIsFavorite(isAdded);
                showToast(isAdded ? 'भजन आवडीत जोडले' : 'भजन आवडीतून काढले', 'success');
            } catch (error) {
                showToast('त्रुटी आली', 'error');
            }
        } else {
            // LocalStorage Logic
            let favorites = [];
            const stored = localStorage.getItem('favoriteBhajans');
            if (stored) favorites = JSON.parse(stored);

            if (isFavorite) {
                const updated = favorites.filter(b => b.id !== bhajan.id);
                localStorage.setItem('favoriteBhajans', JSON.stringify(updated));
                setIsFavorite(false);
                showToast('भजन आवडीतून काढले', 'success');
            } else {
                const updated = [...favorites, bhajan];
                localStorage.setItem('favoriteBhajans', JSON.stringify(updated));
                setIsFavorite(true);
                showToast('भजन आवडीत जोडले (स्थानिक)', 'success');
            }
        }
    };

    const handleShare = async () => {
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
            // Fallback to clipboard
            navigator.clipboard.writeText(`${bhajan.title}\n\n${bhajan.lyrics}\n\n${window.location.href}`);
            showToast('लिंक कॉपी केली', 'success');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${bhajan.title}\n\n${bhajan.lyrics}`);
        showToast('भजन कॉपी केले', 'success');
    };

    if (loading) return <div className="text-center py-20 text-[var(--color-ink-secondary)] italic">लोड होत आहे...</div>;
    if (!bhajan) return <div className="text-center py-20 text-[var(--color-ink-secondary)]">भजन सापडले नाही</div>;

    return (
        <div className="max-w-3xl mx-auto min-h-screen pb-20 relative">
            {/* Header - Sticky with Paper Texture */}
            <div className="sticky top-0 bg-[var(--color-paper-base)] z-20 border-b-2 border-[var(--color-gold-accent)] px-4 py-3 flex items-center justify-between shadow-md">
                <button onClick={() => navigate(-1)} className="text-[var(--color-maroon-main)] hover:text-[var(--color-saffron-muted)] transition-colors">
                    <ChevronLeft size={28} strokeWidth={2.5} />
                </button>
                <h1 className="text-xl font-bold text-[var(--color-maroon-main)] truncate px-4 drop-shadow-sm">{bhajan.title}</h1>
                <div className="w-6"></div> {/* Spacer */}
            </div>

            <div className="p-4 pb-32">
                {/* Main Content Card - The "Page" */}
                <div className="bg-[var(--color-paper-card)] rounded-lg shadow-[0_4px_20px_rgba(62,39,35,0.15)] p-6 border-2 border-[var(--color-border-sepia)] relative overflow-hidden">

                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--color-maroon-main)] rounded-tl-lg opacity-40"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[var(--color-maroon-main)] rounded-tr-lg opacity-40"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[var(--color-maroon-main)] rounded-bl-lg opacity-40"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--color-maroon-main)] rounded-br-lg opacity-40"></div>

                    {/* Metadata Header */}
                    <div className="flex justify-center gap-4 mb-8 text-sm border-b border-[var(--color-border-sepia)] border-dashed pb-4">
                        <span className="bg-[var(--color-paper-base)] px-3 py-1 rounded-full text-[var(--color-maroon-main)] font-bold border border-[var(--color-border-sepia)]">
                            {bhajan.category}
                        </span>
                        {bhajan.sant && (
                            <span className="bg-[var(--color-paper-base)] px-3 py-1 rounded-full text-[var(--color-ink-secondary)] font-medium border border-[var(--color-border-sepia)]">
                                {bhajan.sant}
                            </span>
                        )}
                    </div>

                    {/* Lyrics - The "Shlok" */}
                    <div className="relative mb-8">
                        {/* Center Line Decoration */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-maroon-main)] opacity-10 -translate-x-1/2"></div>

                        <div
                            className="whitespace-pre-line text-[var(--color-ink-primary)] leading-loose font-medium text-center relative z-10"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {bhajan.lyrics}
                        </div>
                    </div>

                    {/* Footer Decoration */}
                    <div className="flex justify-center opacity-60">
                        <span className="text-[var(--color-maroon-main)] text-xl">~ || राम कृष्ण हरी || ~</span>
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar - Floating */}
            <div className="fixed bottom-20 left-4 right-4 max-w-3xl mx-auto bg-[var(--color-paper-base)]/95 backdrop-blur-sm border border-[var(--color-border-sepia)] rounded-full shadow-lg p-2 flex justify-around items-center z-30">
                <button
                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                    className="p-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)] active:scale-95 transition-transform"
                    title="फॉन्ट कमी करा"
                >
                    <ZoomOut size={24} />
                </button>

                <div className="w-px h-8 bg-[var(--color-border-sepia)] opacity-50"></div>

                <button
                    onClick={handleFavorite}
                    className={`p-3 rounded-full transition-all active:scale-95 ${isFavorite ? 'text-red-500 bg-red-50' : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)]'
                        }`}
                    title="आवडीत जोडा"
                >
                    <Heart size={28} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <div className="w-px h-8 bg-[var(--color-border-sepia)] opacity-50"></div>

                <button
                    onClick={handleCopy}
                    className="p-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)] active:scale-95 transition-transform"
                    title="कॉपी करा"
                >
                    <Copy size={24} />
                </button>

                <div className="w-px h-8 bg-[var(--color-border-sepia)] opacity-50"></div>

                <button
                    onClick={handleShare}
                    className="p-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)] active:scale-95 transition-transform"
                    title="शेअर करा"
                >
                    <Share2 size={24} />
                </button>

                <div className="w-px h-8 bg-[var(--color-border-sepia)] opacity-50"></div>

                <button
                    onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                    className="p-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-maroon-main)] active:scale-95 transition-transform"
                    title="फॉन्ट वाढवा"
                >
                    <ZoomIn size={24} />
                </button>
            </div>
        </div>
    );
};

export default BhajanDetail;
