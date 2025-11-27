import React from 'react';

const Splash = () => {
    return (
        <div className="min-h-screen bg-[var(--color-paper-base)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Corner Borders */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[var(--color-maroon-main)] rounded-tl-3xl opacity-80"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[var(--color-maroon-main)] rounded-tr-3xl opacity-80"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[var(--color-maroon-main)] rounded-bl-3xl opacity-80"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[var(--color-maroon-main)] rounded-br-3xl opacity-80"></div>

            {/* Inner Border Frame */}
            <div className="absolute inset-3 border-2 border-[var(--color-border-sepia)] opacity-30 pointer-events-none"></div>

            <div className="text-center animate-fade-in relative z-10">
                {/* Icon Container */}
                <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[var(--color-maroon-main)] rounded-full opacity-10 animate-pulse"></div>
                    <div className="w-28 h-28 border-4 border-[var(--color-maroon-main)] rounded-full flex items-center justify-center bg-[var(--color-paper-card)] shadow-xl animate-scale-in">
                        <span className="text-5xl filter drop-shadow-sm">🙏</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-[var(--color-maroon-main)] mb-3 animate-slide-up tracking-wide drop-shadow-sm">
                    जननी माता भजन मंडळ
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-[var(--color-ink-secondary)] font-medium animate-slide-up-delay border-b-2 border-[var(--color-gold-accent)] inline-block pb-1 px-4">
                    मोरावळे
                </p>

                {/* Footer Mantra */}
                <div className="mt-12">
                    <p className="text-[var(--color-ink-primary)] text-lg font-semibold animate-pulse tracking-wider">
                        || विठ्ठल विठ्ठल विठोबा हरी ॐ ||
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Splash;
