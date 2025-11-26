import React from 'react';
import { useDailyContent } from '../hooks/useDailyContent';
import { Calendar, User, BookOpen, Sparkles } from 'lucide-react';

const DailyContent = () => {
    const { content, loading, error } = useDailyContent();

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

    if (!content) return null;

    return (
        <div className="bg-gradient-to-br from-saffron-50 to-orange-50 rounded-xl p-6 shadow-lg border-2 border-saffron-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">

                export default DailyContent;
