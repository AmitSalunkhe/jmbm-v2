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
    const [fontSize, setFontSize] = useState(18); // Default font size in px

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
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 14));

    if (loading) return <div className="p-8 text-center text-gray-500">लोड होत आहे...</div>;
    if (!bhajan) return null;

    return (
        <div className="max-w-3xl mx-auto bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b shadow-sm px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-saffron-600">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-gray-800 truncate px-4">{bhajan.title}</h1>
                <div className="w-6"></div> {/* Spacer for centering */}
            </div>

            <div className="p-6 pb-32">
                {/* Lyrics */}
                <div
                    className="whitespace-pre-line text-gray-800 leading-relaxed font-medium mb-8"
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {bhajan.lyrics}
                </div>

                {/* Metadata Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                    {bhajan.sant && (
                        <div className="bg-saffron-50 p-3 rounded-lg border border-saffron-100">
                            <span className="text-gray-500 block text-xs mb-1">संत</span>
                            <span className="font-semibold text-saffron-800">{bhajan.sant}</span>
                        </div>
                    )}
                    <div className="bg-saffron-50 p-3 rounded-lg border border-saffron-100">
                        <span className="text-gray-500 block text-xs mb-1">प्रकार</span>
                        <span className="font-semibold text-saffron-800">{bhajan.category}</span>
                    </div>
                    {bhajan.subcategory && (
                        <div className="bg-saffron-50 p-3 rounded-lg border border-saffron-100 col-span-2">
                            <span className="text-gray-500 block text-xs mb-1">श्रेणी</span>
                            <span className="font-semibold text-saffron-800">
                                {Array.isArray(bhajan.subcategory) ? bhajan.subcategory.join(', ') : bhajan.subcategory}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Toolbar - Fixed Bottom above Nav */}
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 shadow-lg max-w-3xl mx-auto z-40">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                    <div className="flex items-center gap-4">
                        <button onClick={decreaseFontSize} className="p-2 bg-white rounded shadow-sm hover:bg-gray-100 text-gray-600">
                            <Minus size={18} />
                        </button>
                        <span className="text-sm font-medium text-gray-600">A</span>
                        <button onClick={increaseFontSize} className="p-2 bg-white rounded shadow-sm hover:bg-gray-100 text-gray-600">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={toggleFavorite} className="p-2 bg-white rounded shadow-sm hover:bg-gray-100">
                            <Heart size={20} className={isFav ? "fill-red-500 text-red-500" : "text-gray-400"} />
                        </button>
                        <button onClick={handleShare} className="p-2 bg-white rounded shadow-sm hover:bg-gray-100 text-blue-600">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BhajanDetail;
