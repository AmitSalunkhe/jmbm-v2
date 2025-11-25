import React, { useEffect, useState } from 'react';
import { getBhajanTypes, getBhajansByCategory } from '../services/firestoreService';
import { FolderOpen, ChevronRight } from 'lucide-react';

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
            <div className="p-4">
                <button
                    onClick={handleBack}
                    className="flex items-center text-saffron-600 hover:text-saffron-800 mb-4"
                >
                    <ChevronRight size={20} className="rotate-180" />
                    <span>परत जा</span>
                </button>

                <div className="bg-gradient-to-r from-saffron-500 to-saffron-700 text-white p-6 rounded-lg mb-6">
                    <h2 className="text-3xl font-bold mb-2">{selectedCategory.name}</h2>
                    {selectedCategory.description && (
                        <p className="text-saffron-50">{selectedCategory.description}</p>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    भजने ({categoryBhajans.length})
                </h3>

                {loadingBhajans ? (
                    <div className="text-center py-8 text-gray-500">लोड होत आहे...</div>
                ) : categoryBhajans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        या प्रकारची भजने अद्याप उपलब्ध नाहीत
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryBhajans.map((bhajan) => (
                            <div
                                key={bhajan.id}
                                onClick={() => window.location.href = `/bhajan/${bhajan.id}`}
                                className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-saffron-500 cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <h4 className="text-lg font-bold text-gray-800 mb-2">{bhajan.title}</h4>
                                <div className="text-sm space-y-1 mb-3">
                                    {bhajan.sant && (
                                        <p className="text-gray-600">संत: {bhajan.sant}</p>
                                    )}
                                    {bhajan.subcategory && (
                                        <p className="text-gray-500 text-xs">
                                            {Array.isArray(bhajan.subcategory) ? bhajan.subcategory.join(', ') : bhajan.subcategory}
                                        </p>
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
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-saffron-900 mb-6">भजनाचे प्रकार</h2>

            {loading ? (
                <div className="text-center py-8 text-gray-500">लोड होत आहे...</div>
            ) : bhajanTypes.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen size={40} className="text-saffron-600" />
                    </div>
                    <p className="text-gray-600 mb-4">अद्याप कोणतेही भजनाचे प्रकार जोडले नाहीत</p>
                    <p className="text-sm text-gray-500">
                        ॲडमिन पॅनेल मधून भजनाचे प्रकार जोडा
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bhajanTypes.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-saffron-500"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center">
                                        <FolderOpen size={24} className="text-saffron-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                                        {category.description && (
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BhajanTypes;
