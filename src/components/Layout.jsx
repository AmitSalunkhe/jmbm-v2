import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import { Home, Music, Users, Grid, Heart, User } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-saffron-100 font-marathi">
            <Header />

            <main className="flex-grow container mx-auto p-4 pb-24">
                <Outlet />
            </main>

            {/* Bottom Navigation for Mobile Feel - 6 Items */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-saffron-200 z-50">
                <div className="grid grid-cols-6 h-16">
                    <Link to="/home" className={`flex flex-col items-center justify-center ${isActive('/home') ? 'text-saffron-600' : 'text-gray-500'}`}>
                        <Home size={20} />
                        <span className="text-[10px] mt-1">मुख्य</span>
                    </Link>
                    <Link to="/bhajans" className={`flex flex-col items-center justify-center ${isActive('/bhajans') ? 'text-saffron-600' : 'text-gray-500'}`}>
                        <Music size={20} />
                        <span className="text-[10px] mt-1">अभंग</span>
                    </Link>
                    <Link to="/saints" className={`flex flex-col items-center justify-center ${isActive('/saints') ? 'text-saffron-600' : 'text-gray-500'}`}>
                        <Users size={20} />
                        <span className="text-[10px] mt-1">संत</span>
                    </Link>
                    <Link to="/bhajan-types" className={`flex flex-col items-center justify-center ${isActive('/bhajan-types') ? 'text-saffron-600' : 'text-gray-500'}`}>
                        <Grid size={20} />
                        <span className="text-[10px] mt-1">भजनाचे प्रकार</span>
                    </Link>
                    <Link to="/favorites" className={`flex flex-col items-center justify-center ${isActive('/favorites') ? 'text-saffron-600' : 'text-gray-500'}`}>
                        <Heart size={20} />
                        <span className="text-[10px] mt-1">आवडते</span>
                    </Link>
                    <Link to="/profile" className={`flex flex-col items-center justify-center ${isActive('/profile') ? 'text-saffron-600' : 'text-gray-500'}`}>
                        <User size={20} />
                        <span className="text-[10px] mt-1">प्रोफाइल</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
