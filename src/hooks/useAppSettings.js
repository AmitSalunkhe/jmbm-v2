import { useEffect, useState } from 'react';
import { getAppSettings } from '../services/firestoreService';

export const useAppSettings = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await getAppSettings();
                if (data) {
                    setSettings(data);

                    // Update document title
                    if (data.appTitle) {
                        document.title = data.appTitle;
                    }

                    // Update favicon
                    if (data.faviconUrl) {
                        let link = document.querySelector("link[rel~='icon']");
                        if (!link) {
                            link = document.createElement('link');
                            link.rel = 'icon';
                            document.getElementsByTagName('head')[0].appendChild(link);
                        }
                        link.href = data.faviconUrl;
                    }

                    // Update PWA Manifest
                    const manifest = {
                        name: data.appTitle || 'अभंगमाला',
                        short_name: data.appTitle || 'अभंगमाला',
                        description: data.appDescription || 'भजन, अभंग आणि संतांच्या वाणीचा अनुभव',
                        start_url: '/',
                        display: 'standalone',
                        background_color: '#ffffff',
                        theme_color: '#8B0000',
                        icons: [
                            {
                                src: data.appIcon192 || '/pwa-icon.svg',
                                sizes: '192x192',
                                type: 'image/png'
                            },
                            {
                                src: data.appIcon512 || '/pwa-icon.svg',
                                sizes: '512x512',
                                type: 'image/png'
                            }
                        ]
                    };

                    const stringManifest = JSON.stringify(manifest);
                    const blob = new Blob([stringManifest], { type: 'application/json' });
                    const manifestURL = URL.createObjectURL(blob);

                    let manifestLink = document.querySelector("link[rel='manifest']");
                    if (manifestLink) {
                        manifestLink.href = manifestURL;
                    } else {
                        manifestLink = document.createElement('link');
                        manifestLink.rel = 'manifest';
                        manifestLink.href = manifestURL;
                        document.getElementsByTagName('head')[0].appendChild(manifestLink);
                    }
                }
            } catch (error) {
                console.error("Error loading app settings:", error);
            }
        };

        loadSettings();
    }, []);

    return settings;
};
