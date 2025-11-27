import React, { useEffect, useState } from 'react';
import { getBhajanTypes, getBhajansByCategory } from '../services/firestoreService';
import { FolderOpen, ChevronRight, ChevronLeft } from 'lucide-react';

const BhajanTypes = () => {
    const [bhajanTypes, setBhajanTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryBhajans, setCategoryBhajans] = useState([]);
    const [loadingBhajans, setLoadingBhajans] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const data = await getBhajanTypes();
        setBhajanTypes(data);
        setLoading(false);
    };

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setLoadingBhajans(true);
        const bhajans = await getBhajansByCategory(category.name);
        setCategoryBhajans(bhajans);
        setLoadingBhajans(false);
    };

    const handleBack = () => {
        setSelectedCategory(null);
        setCategoryBhajans([]);
    };

    if (selectedCategory) {
        return (
            <div className="p-4 space-y-6">
                <button
                    onClick={handleBack}
                    className="flex items-center text-[var(--color-maroon-main)] hover:text-[var(--color-saffron-muted)] mb-4 font-medium"
                >
                    <ChevronLeft size={20} />
                    <span>परत जा</span>
                </button>

                <div className="bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] p-6 rounded-lg mb-6 shadow-md border-2 border-[var(--color-gold-accent)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-gold-accent)] opacity-20 rounded-bl-full"></div>
                    <h2 className="text-3xl font-bold mb-2 relative z-10">{selectedCategory.name}</h2>
                    {selectedCategory.description && (
                        <p className="text-[var(--color-paper-card)] opacity-90 relative z-10">{selectedCategory.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-4 border-b border-[var(--color-border-sepia)] pb-2">
                    <FolderOpen className="text-[var(--color-maroon-main)]" size={24} />
                    <h3 className="text-xl font-bold text-[var(--color-ink-primary)]">
                        भजने ({categoryBhajans.length})
                    </h3>
                </div>

                {loadingBhajans ? (
                    <div className="text-center py-8 text-[var(--color-ink-secondary)] italic">भजने शोधत आहे...</div>
                ) : categoryBhajans.length === 0 ? (
                    <div className="text-center py-8 bg-[var(--color-paper-card)] rounded-lg border border-[var(--color-border-sepia)] border-dashed">
                        <p className="text-[var(--color-ink-secondary)]">या प्रकारची भजने अद्याप उपलब्ध नाहीत</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryBhajans.map((bhajan) => (
                            <div
                                key={bhajan.id}
                                onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
                                className="bg-[var(--color-paper-card)] p-4 rounded-lg shadow-sm border-l-4 border-[var(--color-maroon-main)] cursor-pointer hover:shadow-md transition-all border-y border-r border-[var(--color-border-sepia)]"
                            >
                                <h4 className="text-lg font-bold text-[var(--color-ink-primary)] mb-2">{bhajan.title}</h4>
                                <div className="text-sm space-y-1 mb-3">
                                    {bhajan.sant && (
                                        <p className="text-[var(--color-ink-secondary)] italic">संत: {bhajan.sant}</p>
                                    )}
                                    {bhajan.subcategory && (
                                        <p className="text-[var(--color-maroon-main)] text-xs font-medium">
                                            {Array.isArray(bhajan.subcategory) ? bhajan.subcategory.join(', ') : bhajan.subcategory}
                                        </p>
                                    )}
                                </div>
                                <p className="text-[var(--color-ink-secondary)] whitespace-pre-line line-clamp-2 text-sm bg-[var(--color-paper-base)] p-2 rounded border border-[var(--color-border-sepia)] border-opacity-50 italic">
                                    {bhajan.lyrics}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-[var(--color-gold-accent)] pb-2">
                <FolderOpen className="text-[var(--color-maroon-main)]" size={28} />
                <h2 className="text-2xl font-bold text-[var(--color-maroon-main)]">भजनाचे प्रकार</h2>
            </div>

            {loading ? (
                <div className="text-center py-8 text-[var(--color-ink-secondary)] italic">प्रकार लोड होत आहे...</div>
            ) : bhajanTypes.length === 0 ? (
                <div className="text-center py-12 bg-[var(--color-paper-card)] rounded-lg border border-[var(--color-border-sepia)] border-dashed">
                    <div className="w-20 h-20 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-sepia)]">
                        <FolderOpen size={40} className="text-[var(--color-maroon-main)]" />
                    </div>
                    <p className="text-[var(--color-ink-primary)] mb-2 font-medium">अद्याप कोणतेही भजनाचे प्रकार जोडले नाहीत</p>
                    <p className="text-sm text-[var(--color-ink-secondary)]">
                        ॲडमिन पॅनेल मधून भजनाचे प्रकार जोडा
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bhajanTypes.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="bg-[var(--color-paper-card)] p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-[var(--color-maroon-main)] border-y border-r border-[var(--color-border-sepia)] group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center border border-[var(--color-border-sepia)] shadow-sm group-hover:border-[var(--color-maroon-main)] transition-colors">
                                        <FolderOpen size={24} className="text-[var(--color-maroon-main)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[var(--color-ink-primary)] group-hover:text-[var(--color-maroon-main)] transition-colors">{category.name}</h3>
                                        {category.description && (
                                            <p className="text-sm text-[var(--color-ink-secondary)] line-clamp-1 italic">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-[var(--color-ink-secondary)] group-hover:text-[var(--color-maroon-main)]" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BhajanTypes;
