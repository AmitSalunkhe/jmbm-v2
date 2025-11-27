import React from 'react';

const Header = () => {
    return (
        <header className="bg-[var(--color-maroon-main)] text-[var(--color-paper-base)] p-4 shadow-md sticky top-0 z-50 border-b-4 border-[var(--color-gold-accent)]">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* Logo / Icon */}
                    <div className="w-10 h-10 bg-[var(--color-paper-base)] rounded-full flex items-center justify-center border-2 border-[var(--color-gold-accent)] shadow-sm">
                        <span className="text-xl font-bold text-[var(--color-maroon-main)]">ज</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-tight drop-shadow-sm">जननी माता</h1>
                        <p className="text-xs text-[var(--color-paper-card)] opacity-90 font-medium">भजन मंडळ मोरावळे</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
