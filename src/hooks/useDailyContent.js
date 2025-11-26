import { useState, useEffect } from 'react';
import { generateDailyContent } from '../services/geminiService';

const CACHE_KEY = 'dailyContent';

export const useDailyContent = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDailyContent = async () => {
            try {
                // Get today's date in YYYY-MM-DD format
                const today = new Date().toISOString().split('T')[0];

                // Check localStorage for cached content
                const cached = localStorage.getItem(CACHE_KEY);

                if (cached) {
                    const { date, data } = JSON.parse(cached);

                    // If cache is from today, use it
                    if (date === today) {
                        setContent(data);
                        setLoading(false);
                        return;
                    }
                }

                // Cache is stale or doesn't exist, fetch new content
                setLoading(true);
                const result = await generateDailyContent();

                if (result.success) {
                    // Store in localStorage with today's date
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        date: today,
                        data: result.data
                    }));

                    setContent(result.data);
                    setError(null);
                } else {
                    // Use fallback content but show error
                    setContent(result.data);
                    setError(result.error);
                }

            } catch (err) {
                console.error('Error loading daily content:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDailyContent();
    }, []);

    return { content, loading, error };
};
