import React from 'react';
import { Image } from 'lucide-react';

const Gallery = () => {
    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-[var(--color-paper-card)] p-8 rounded-lg shadow-md border-2 border-[var(--color-border-sepia)] text-center max-w-md w-full relative overflow-hidden">
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--color-maroon-main)] rounded-tl-lg opacity-50"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--color-maroon-main)] rounded-tr-lg opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--color-maroon-main)] rounded-bl-lg opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--color-maroon-main)] rounded-br-lg opacity-50"></div>

                <div className="w-24 h-24 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[var(--color-gold-accent)] shadow-inner">
                    <Image size={48} className="text-[var(--color-maroon-main)] opacity-70" />
                </div>

                <h2 className="text-2xl font-bold text-[var(--color-maroon-main)] mb-3">छायाचित्र दालन</h2>
                <div className="h-px w-24 bg-[var(--color-border-sepia)] mx-auto mb-4"></div>
                <p className="text-[var(--color-ink-secondary)] font-medium italic">
                    लवकरच येत आहे...
                </p>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-4 opacity-70">
                    आम्ही लवकरच भजने आणि कार्यक्रमांचे फोटो येथे अपलोड करू.
                </p>
            </div>
        </div>
    );
};

export default Gallery;
