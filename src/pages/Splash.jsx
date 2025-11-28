import React from 'react';

import { useAppSettings } from '../hooks/useAppSettings';

const Splash = () => {
    const settings = useAppSettings();

    const appTitle = settings?.appTitle || 'जननी माता भजन मंडळ, मोरावळे.';
    const appIcon = settings?.appIcon512 || null;

    return (
        <div className="min-h-screen bg-[var(--color-paper-base)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[var(--color-paper-base)] opacity-80 pointer-events-none"></div>

            {/* Decorative Corner Borders */}
            <div className="absolute top-6 left-6 w-24 h-24 border-t-4 border-l-4 border-[var(--color-maroon-main)] rounded-tl-3xl opacity-60"></div>
            <div className="absolute top-6 right-6 w-24 h-24 border-t-4 border-r-4 border-[var(--color-maroon-main)] rounded-tr-3xl opacity-60"></div>
            <div className="absolute bottom-6 left-6 w-24 h-24 border-b-4 border-l-4 border-[var(--color-maroon-main)] rounded-bl-3xl opacity-60"></div>
            <div className="absolute bottom-6 right-6 w-24 h-24 border-b-4 border-r-4 border-[var(--color-maroon-main)] rounded-br-3xl opacity-60"></div>

            {/* Inner Border Frame */}
            <div className="absolute inset-4 border border-[var(--color-border-sepia)] opacity-20 pointer-events-none rounded-lg"></div>

            <div className="text-center animate-fade-in relative z-10">
                {/* Icon Container with Glow */}
                <div className="w-40 h-40 mx-auto mb-8 flex items-center justify-center relative">
                    {/* Pulsing Glow Behind */}
                    <div className="absolute inset-0 bg-[var(--color-gold-accent)] rounded-full opacity-20 animate-glow blur-xl"></div>

                    <div className="w-32 h-32 border-4 border-[var(--color-maroon-main)] rounded-full flex items-center justify-center bg-[var(--color-paper-card)] shadow-2xl animate-float overflow-hidden relative z-10">
                        {settings?.appIcon192 ? (
                            <img src={settings.appIcon192} alt="App Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl">🙏</span>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-maroon-main)] mb-4 animate-slide-up tracking-wide drop-shadow-md font-marathi">
                    {appTitle}
                </h1>

                {/* Subtitle */}
                <div className="animate-slide-up-delay">
                    <p className="text-xl md:text-2xl text-[var(--color-ink-secondary)] font-medium border-b-2 border-[var(--color-gold-accent)] inline-block pb-2 px-6">
                        {settings?.appSubtitle || 'मोरावळे'}
                    </p>
                </div>

                {/* Footer Mantra */}
                <div className="mt-16 opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                    <p className="text-[var(--color-ink-primary)] text-lg font-bold tracking-widest uppercase opacity-80">
                        || रामकृष्णहरी माऊली ||
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Splash;
