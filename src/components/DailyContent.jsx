import React, { useState, useEffect } from 'react';
import { useDailyContent } from '../hooks/useDailyContent';
import { Calendar, User, BookOpen, Sparkles } from 'lucide-react';
import { testConnection } from '../services/geminiService';

const DailyContent = () => {
    const { content, loading, error } = useDailyContent();
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        if (error) {
            testConnection().then(info => setDebugInfo(info));
        }
    }, [error]);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-saffron-50 to-orange-50 rounded-xl p-6 shadow-lg border-2 border-saffron-200">
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-saffron-600" size={28} />
                    <h2 className="text-2xl font-bold text-saffron-900">आजचा दिवस</h2>
                </div>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">आजचा दिवस तयार करत आहे...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-saffron-50 to-orange-50 rounded-xl p-6 shadow-lg border-2 border-saffron-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-saffron-600" size={24} />
                <h2 className="text-xl font-bold text-saffron-900">आजचा दिवस</h2>
            </div>

            {content && (
                <>
                    {/* Date and Tithi - Inline */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-saffron-600" />
                            <span className="text-gray-600">तारीख:</span>
                            <span className="font-semibold text-gray-800">{content.gregorianDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-saffron-600" />
                            <span className="text-gray-600">तिथी:</span>
                            <span className="font-semibold text-gray-800">{content.tithi}</span>
                        </div>
                    </div>

                    {/* Abhang */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={18} className="text-saffron-600" />
                            <span className="text-sm font-semibold text-gray-700">आजचे अभंग</span>
                        </div>
                        <p className="text-base leading-relaxed whitespace-pre-line text-gray-800 font-medium bg-white p-4 rounded-lg border border-saffron-100">
                            {content.abhang}
                        </p>
                    </div>

                    {/* Sant */}
                    <div className="flex items-center gap-2 mb-4 text-sm">
                        <User size={16} className="text-saffron-600" />
                        <span className="text-gray-600">संत:</span>
                        <span className="font-semibold text-saffron-800">{content.sant}</span>
                    </div>

                    {/* Meaning */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">अर्थ</h3>
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line bg-white p-4 rounded-lg border border-saffron-100">
                            {content.meaning}
                        </p>
                    </div>
                </>
            )}

            {/* Error message if any */}
            {error && (
};

            export default DailyContent;
