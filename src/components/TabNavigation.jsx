import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="mb-6">
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-4 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 border-2 ${activeTab === tab.id
                            ? 'bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] border-[var(--color-maroon-main)] shadow-md'
                            : 'bg-[var(--color-paper-card)] text-[var(--color-ink-secondary)] border-[var(--color-border-sepia)] hover:border-[var(--color-maroon-main)] hover:text-[var(--color-maroon-main)]'
                            }`}
                    >
                        {tab.icon && <span>{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabNavigation;
