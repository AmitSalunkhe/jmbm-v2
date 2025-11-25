import React from 'react';

const Header = () => {
    return (
        <header className="bg-saffron-500 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {/* Placeholder for Logo if needed */}
                    <div className="w-10 h-10 bg-saffron-900 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xl font-bold">ज</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-tight">जननी माता</h1>
                        <p className="text-xs text-saffron-100">भजन मंडळ मोरावळे</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
