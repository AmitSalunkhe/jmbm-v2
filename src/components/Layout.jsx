import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import { Home, Music, Users, Grid, Heart, User } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-paper-base)] font-marathi relative">
            {/* Global Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

            <Header />

            <main className="flex-grow container mx-auto p-4 pb-24 relative z-10">
                <Outlet />
            </main>

            {/* Bottom Navigation - Wooden/Sepia Style */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-paper-card)] shadow-[0_-4px_20px_rgba(62,39,35,0.15)] border-t-2 border-[var(--color-border-sepia)] z-50">
                <div className="grid grid-cols-6 h-16">
                    <Link to="/home" className={`flex flex-col items-center justify-center transition-colors ${isActive('/home') ? 'text-[var(--color-maroon-main)]' : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]'}`}>
                        <Home size={20} strokeWidth={isActive('/home') ? 2.5 : 2} />
                        <span className={`text-[10px] mt-1 font-medium ${isActive('/home') ? 'font-bold' : ''}`}>मुख्य</span>
                    </Link>
                    <Link to="/bhajans" className={`flex flex-col items-center justify-center transition-colors ${isActive('/bhajans') ? 'text-[var(--color-maroon-main)]' : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]'}`}>
                        <Music size={20} strokeWidth={isActive('/bhajans') ? 2.5 : 2} />
                        <span className={`text-[10px] mt-1 font-medium ${isActive('/bhajans') ? 'font-bold' : ''}`}>अभंग</span>
                    </Link>
                    <Link to="/saints" className={`flex flex-col items-center justify-center transition-colors ${isActive('/saints') ? 'text-[var(--color-maroon-main)]' : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]'}`}>
                        <Users size={20} strokeWidth={isActive('/saints') ? 2.5 : 2} />
                        <span className={`text-[10px] mt-1 font-medium ${isActive('/saints') ? 'font-bold' : ''}`}>संत</span>
                    </Link>
                    <Link to="/bhajan-types" className={`flex flex-col items-center justify-center transition-colors ${isActive('/bhajan-types') ? 'text-[var(--color-maroon-main)]' : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]'}`}>
                        <Grid size={20} strokeWidth={isActive('/bhajan-types') ? 2.5 : 2} />
                        <span className={`text-[10px] mt-1 font-medium ${isActive('/bhajan-types') ? 'font-bold' : ''}`}>प्रकार</span>
                    </Link>
                    <Link to="/favorites" className={`flex flex-col items-center justify-center transition-colors ${isActive('/favorites') ? 'text-[var(--color-maroon-main)]' : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]'}`}>
                        <Heart size={20} strokeWidth={isActive('/favorites') ? 2.5 : 2} />
                        <span className={`text-[10px] mt-1 font-medium ${isActive('/favorites') ? 'font-bold' : ''}`}>आवडते</span>
                    </Link>
                    <Link to="/profile" className={`flex flex-col items-center justify-center transition-colors ${isActive('/profile') ? 'text-[var(--color-maroon-main)]' : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]'}`}>
                        <User size={20} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                        <span className={`text-[10px] mt-1 font-medium ${isActive('/profile') ? 'font-bold' : ''}`}>प्रोफाइल</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
