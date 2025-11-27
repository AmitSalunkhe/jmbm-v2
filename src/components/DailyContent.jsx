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
            <div className="bg-[var(--color-paper-card)] rounded-lg p-6 shadow-md border-2 border-[var(--color-border-sepia)] relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-gold-accent)] pb-2">
                    <Sparkles className="text-[var(--color-maroon-main)]" size={24} />
                    <h2 className="text-xl font-bold text-[var(--color-maroon-main)]">आजचा दिवस</h2>
                </div>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-maroon-main)] mx-auto"></div>
                    <p className="text-[var(--color-ink-secondary)] mt-4 font-medium">पान उघडत आहे...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-paper-card)] rounded-lg p-6 shadow-[0_4px_15px_rgba(62,39,35,0.1)] border-2 border-[var(--color-border-sepia)] relative">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--color-maroon-main)] rounded-tr-lg opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--color-maroon-main)] rounded-bl-lg opacity-50"></div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-gold-accent)] pb-2">
                <Sparkles className="text-[var(--color-maroon-main)]" size={24} />
                <h2 className="text-xl font-bold text-[var(--color-maroon-main)]">आजचा दिवस</h2>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-medium px-2 py-0.5 rounded border border-blue-400 ml-auto">Dev Mode</span>
            </div>

            {content && (
                <>
                    {/* Date and Tithi - Inline */}
                    <div className="flex flex-wrap gap-4 mb-6 text-sm bg-[var(--color-paper-base)] p-3 rounded border border-[var(--color-border-sepia)] border-dashed">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[var(--color-saffron-muted)]" />
                            <span className="text-[var(--color-ink-secondary)]">तारीख:</span>
                            <span className="font-bold text-[var(--color-ink-primary)]">{content.gregorianDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[var(--color-saffron-muted)]" />
                            <span className="text-[var(--color-ink-secondary)]">तिथी:</span>
                            <span className="font-bold text-[var(--color-maroon-main)]">{content.tithi}</span>
                        </div>
                    </div>

                    {/* Abhang */}
                    <div className="mb-6 relative">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={18} className="text-[var(--color-maroon-main)]" />
                            <span className="text-sm font-bold text-[var(--color-ink-secondary)] uppercase tracking-wider">आजचे अभंग</span>
                        </div>
                        <div className="relative">
                            {/* Vertical Line Decoration */}
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--color-maroon-main)] opacity-30 rounded-full"></div>

                            <p className="text-lg leading-relaxed whitespace-pre-line text-[var(--color-ink-primary)] font-medium pl-4 py-2">
                                {content.abhang}
                            </p>
                        </div>
                    </div>

                    {/* Sant */}
                    <div className="flex items-center justify-end gap-2 mb-6 text-sm italic">
                        <span className="text-[var(--color-ink-secondary)]">—</span>
                        <span className="font-bold text-[var(--color-maroon-main)] text-base">{content.sant}</span>
                        <User size={16} className="text-[var(--color-maroon-main)]" />
                    </div>

                    {/* Meaning */}
                    <div className="bg-[var(--color-paper-base)] p-4 rounded-lg border border-[var(--color-border-sepia)]">
                        <h3 className="text-sm font-bold text-[var(--color-ink-secondary)] mb-2 border-b border-[var(--color-border-sepia)] border-dotted pb-1 inline-block">अर्थ</h3>
                        <p className="text-sm leading-relaxed text-[var(--color-ink-primary)] whitespace-pre-line">
                            {content.meaning}
                        </p>
                    </div>
                </>
            )}

            {/* Error message if any */}
            {error && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800 font-semibold">
                        टीप: काही तांत्रिक अडचण आली. डिफॉल्ट सामग्री दाखवली आहे.
                    </p>
                    <div className="mt-2 p-2 bg-white rounded border border-yellow-100 text-[10px] text-gray-500 font-mono break-all">
                        <p className="font-bold text-red-500 mb-1">Error: {error}</p>
                        {debugInfo ? (
                            <div className="mt-2 border-t pt-2">
                                <p className="font-bold text-blue-600">Available Models:</p>
                                <pre className="whitespace-pre-wrap text-gray-600">
                                    {debugInfo.success
                                        ? debugInfo.models.join(', ')
                                        : `Failed to list models: ${debugInfo.error}`}
                                </pre>
                            </div>
                        ) : (
                            <div className="mt-2 border-t pt-2 text-gray-500 italic">
                                Checking available models...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyContent;
