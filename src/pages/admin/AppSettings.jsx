import React, { useState, useEffect } from 'react';
import { getAppSettings, updateAppSettings } from '../../services/firestoreService';
import { uploadImage } from '../../services/storageService';
import { Save, Upload, Image as ImageIcon, Loader } from 'lucide-react';

const AppSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        appTitle: '',
        appDescription: '',
        faviconUrl: '',
        appIcon192: '',
        appIcon512: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const data = await getAppSettings();
        if (data) {
            setSettings(prev => ({
                ...prev,
                ...data
            }));
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setSaving(true);
            const path = `branding/${Date.now()}_${file.name}`;
            const url = await uploadImage(file, path);
            setSettings(prev => ({
                ...prev,
                [fieldName]: url
            }));
            setSaving(false);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("प्रतिमा अपलोड करताना त्रुटी आली.");
            setSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAppSettings(settings);
            alert("सेटिंग्ज यशस्वीरित्या अपडेट केल्या!");
            // Force reload to apply changes immediately (especially for manifest)
            // window.location.reload(); 
            // Actually, let's not reload, just let the hook handle title/favicon
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("सेटिंग्ज सेव्ह करताना त्रुटी आली.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">लोड होत आहे...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-[var(--color-maroon-main)] mb-6 border-b border-[var(--color-border-sepia)] pb-2">
                ॲप सेटिंग्ज (App Settings)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <div className="bg-[var(--color-paper-card)] p-6 rounded-lg shadow-md border border-[var(--color-border-sepia)]">
                    <h3 className="text-lg font-semibold text-[var(--color-maroon-main)] mb-4">सामान्य माहिती</h3>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-ink-primary)] mb-1">
                                ॲपचे नाव (App Title)
                            </label>
                            <input
                                type="text"
                                name="appTitle"
                                value={settings.appTitle}
                                onChange={handleChange}
                                className="w-full p-2 border border-[var(--color-border-sepia)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon-main)] bg-[var(--color-paper-base)]"
                                placeholder="उदा. जननी माता भजन मंडळ"
                            />
                            <p className="text-xs text-[var(--color-ink-secondary)] mt-1">हे ब्राउझर टॅबवर आणि होम स्क्रीनवर दिसेल.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-ink-primary)] mb-1">
                                वर्णन (Description)
                            </label>
                            <textarea
                                name="appDescription"
                                value={settings.appDescription}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-2 border border-[var(--color-border-sepia)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon-main)] bg-[var(--color-paper-base)]"
                                placeholder="ॲपबद्दल थोडक्यात माहिती..."
                            />
                        </div>
                    </div>
                </div>

                {/* Branding Settings */}
                <div className="bg-[var(--color-paper-card)] p-6 rounded-lg shadow-md border border-[var(--color-border-sepia)]">
                    <h3 className="text-lg font-semibold text-[var(--color-maroon-main)] mb-4">ब्रँडिंग (Branding)</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Favicon */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[var(--color-ink-primary)]">
                                फॅव्हिकॉन (Favicon) - Browser Icon
                            </label>
                            <div className="flex items-center gap-4 p-4 border border-dashed border-[var(--color-border-sepia)] rounded bg-[var(--color-paper-base)]">
                                {settings.faviconUrl ? (
                                    <img src={settings.faviconUrl} alt="Favicon" className="w-12 h-12 object-contain" />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                        <ImageIcon size={24} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="faviconUrl"
                                        value={settings.faviconUrl}
                                        onChange={handleChange}
                                        className="w-full p-1.5 text-sm border border-[var(--color-border-sepia)] rounded mb-2"
                                        placeholder="Image URL"
                                    />
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-paper-card)] border border-[var(--color-maroon-main)] text-[var(--color-maroon-main)] rounded text-sm hover:bg-[var(--color-maroon-light)] transition-colors">
                                        <Upload size={14} />
                                        <span>अपलोड करा</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'faviconUrl')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* App Icon 192 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[var(--color-ink-primary)]">
                                ॲप आयकॉन (192x192) - Mobile Icon
                            </label>
                            <div className="flex items-center gap-4 p-4 border border-dashed border-[var(--color-border-sepia)] rounded bg-[var(--color-paper-base)]">
                                {settings.appIcon192 ? (
                                    <img src={settings.appIcon192} alt="App Icon 192" className="w-12 h-12 object-contain rounded-xl" />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                                        <ImageIcon size={24} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="appIcon192"
                                        value={settings.appIcon192}
                                        onChange={handleChange}
                                        className="w-full p-1.5 text-sm border border-[var(--color-border-sepia)] rounded mb-2"
                                        placeholder="Image URL"
                                    />
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-paper-card)] border border-[var(--color-maroon-main)] text-[var(--color-maroon-main)] rounded text-sm hover:bg-[var(--color-maroon-light)] transition-colors">
                                        <Upload size={14} />
                                        <span>अपलोड करा</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'appIcon192')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* App Icon 512 */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-[var(--color-ink-primary)]">
                                ॲप आयकॉन (512x512) - Splash Screen Icon
                            </label>
                            <div className="flex items-center gap-4 p-4 border border-dashed border-[var(--color-border-sepia)] rounded bg-[var(--color-paper-base)]">
                                {settings.appIcon512 ? (
                                    <img src={settings.appIcon512} alt="App Icon 512" className="w-16 h-16 object-contain rounded-xl" />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                        <ImageIcon size={32} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="appIcon512"
                                        value={settings.appIcon512}
                                        onChange={handleChange}
                                        className="w-full p-1.5 text-sm border border-[var(--color-border-sepia)] rounded mb-2"
                                        placeholder="Image URL"
                                    />
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-paper-card)] border border-[var(--color-maroon-main)] text-[var(--color-maroon-main)] rounded text-sm hover:bg-[var(--color-maroon-light)] transition-colors">
                                        <Upload size={14} />
                                        <span>अपलोड करा</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'appIcon512')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--color-maroon-main)] text-white rounded-lg hover:bg-[var(--color-maroon-dark)] disabled:opacity-50 transition-colors shadow-md"
                    >
                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>सेव्ह करा (Save Settings)</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppSettings;
