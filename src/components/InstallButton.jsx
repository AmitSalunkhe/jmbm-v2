import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const InstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone ||
            document.referrer.includes('android-app://');
        setIsStandalone(isInStandaloneMode);

        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            setDeferredPrompt(null);
        } else {
            // If no prompt available (iOS or manual android), show instructions
            setShowInstructions(true);
        }
    };

    if (isStandalone) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-saffron-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-4"
            >
                <Download size={20} />
                <span>{deferredPrompt ? 'Install App' : 'Install App (Help)'}</span>
            </button>

            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowInstructions(false)}>
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">App कसे Install करावे?</h3>

                        {isIOS ? (
                            <div className="space-y-3 text-gray-600">
                                <p>1. Safari browser मध्ये खालील <strong>Share</strong> icon वर click करा.</p>
                                <div className="flex justify-center my-2">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </div>
                                <p>2. खाली scroll करून <strong>"Add to Home Screen"</strong> निवडा.</p>
                                <p>3. <strong>Add</strong> वर click करा.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 text-gray-600">
                                <p>1. Browser च्या menu (तीन ठिपके) वर click करा.</p>
                                <p>2. <strong>"Install App"</strong> किंवा <strong>"Add to Home Screen"</strong> निवडा.</p>
                                <p>3. <strong>Install</strong> वर click करा.</p>
                            </div>
                        )}

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                        >
                            समजले
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallButton;
