import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBhajanById } from '../services/firestoreService';
import { Heart, Share2, ChevronLeft, Minus, Plus, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const BhajanDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [bhajan, setBhajan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFav, setIsFav] = useState(false);
    const [fontSize, setFontSize] = useState(20); // Default font size slightly larger for reading

    useEffect(() => {
        const fetchBhajan = async () => {
            const data = await getBhajanById(id);
            if (data) {
                setBhajan(data);
                checkFavorite(data.id);
            } else {
                showToast('भजन सापडले नाही', 'error');
                navigate('/bhajans');
            }
            setLoading(false);
        };
        fetchBhajan();
    }, [id, navigate, showToast]);

    const checkFavorite = (bhajanId) => {
        const stored = localStorage.getItem('favoriteBhajans');
        if (stored) {
            const favs = JSON.parse(stored);
            setIsFav(favs.some(f => f.id === bhajanId));
        }
    };

    const toggleFavorite = () => {
        const stored = localStorage.getItem('favoriteBhajans');
        let favs = stored ? JSON.parse(stored) : [];

        if (isFav) {
            favs = favs.filter(f => f.id !== bhajan.id);
            showToast('आवडीच्या यादीतून काढले', 'info');
        } else {
            favs.push(bhajan);
            showToast('आवडीच्या यादीत जोडले', 'success');
        }

        localStorage.setItem('favoriteBhajans', JSON.stringify(favs));
        setIsFav(!isFav);
    };

    const handleShare = async () => {
        const shareData = {
            title: bhajan.title,
            text: `${bhajan.title}\n\n${bhajan.lyrics}\n\n- ${bhajan.sant || 'अज्ञात'}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
            showToast('लिंक क्लिपबोर्डवर कॉपी केली', 'success');
        }
    };

    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 16));

    if (loading) return <div className="p-8 text-center text-[var(--color-ink-secondary)] italic">पाने उलटत आहे...</div>;
    if (!bhajan) return null;

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
                        {bhajan.sant && (
                            <div className="flex items-center gap-1">
                                <span className="text-[var(--color-ink-secondary)]">संत:</span>
                                <span className="font-bold text-[var(--color-maroon-main)]">{bhajan.sant}</span>
                            </div>
                        )}
                        <div className="text-[var(--color-gold-accent)]">•</div>
                        <div className="flex items-center gap-1">
                            <span className="text-[var(--color-ink-secondary)]">प्रकार:</span>
                            <span className="font-bold text-[var(--color-maroon-main)]">{bhajan.category}</span>
                        </div>
                    </div>

                    {/* Lyrics - The "Shlok" */}
                    <div className="relative mb-8">
                        {/* Center decorative line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-maroon-main)] opacity-10 -translate-x-1/2"></div>

                        <div
                            className="whitespace-pre-line text-[var(--color-ink-primary)] leading-loose font-medium text-center relative z-10"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {bhajan.lyrics}
                        </div>
                    </div>

                    {/* Footer Decoration */}
                    <div className="flex justify-center opacity-50">
                        <span className="text-[var(--color-maroon-main)] text-xl">~ || राम कृष्ण हरी || ~</span>
                    </div>
                </div>
            </div>

            {/* Controls Toolbar - Wooden Style */}
            <div className="fixed bottom-16 left-0 right-0 bg-[var(--color-paper-card)] border-t-2 border-[var(--color-border-sepia)] p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] max-w-3xl mx-auto z-40">
                <div className="flex items-center justify-between bg-[var(--color-paper-base)] p-3 rounded-lg border border-[var(--color-border-sepia)]">
                    <div className="flex items-center gap-4">
                        <button onClick={decreaseFontSize} className="p-2 bg-[var(--color-paper-card)] rounded shadow-sm border border-[var(--color-border-sepia)] text-[var(--color-ink-primary)] hover:bg-[var(--color-paper-base)]">
                            <Minus size={18} />
                        </button>
                        <span className="text-sm font-bold text-[var(--color-ink-primary)]">A</span>
                        <button onClick={increaseFontSize} className="p-2 bg-[var(--color-paper-card)] rounded shadow-sm border border-[var(--color-border-sepia)] text-[var(--color-ink-primary)] hover:bg-[var(--color-paper-base)]">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={toggleFavorite} className="p-2 bg-[var(--color-paper-card)] rounded shadow-sm border border-[var(--color-border-sepia)] hover:bg-[var(--color-paper-base)]">
                            <Heart size={20} className={isFav ? "fill-red-500 text-red-500" : "text-[var(--color-ink-secondary)]"} />
                        </button>
                        <button onClick={handleShare} className="p-2 bg-[var(--color-paper-card)] rounded shadow-sm border border-[var(--color-border-sepia)] hover:bg-[var(--color-paper-base)] text-[var(--color-maroon-main)]">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BhajanDetail;
