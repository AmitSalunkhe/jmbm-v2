const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export const testConnection = async () => {
    try {
        if (!GEMINI_API_KEY) return { success: false, error: 'API Key Missing' };

        // List models to verify key and connectivity
        const response = await fetch(`${BASE_URL}/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error?.message || `HTTP ${response.status}` };
        }

        return { success: true, models: data.models?.map(m => m.name) || [] };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Helper to find a working model if default fails
const getWorkingModel = async () => {
    try {
        const response = await fetch(`${BASE_URL}/models?key=${GEMINI_API_KEY}`);
        if (!response.ok) return 'gemini-2.0-flash';
        const data = await response.json();

        const priorities = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
        const available = data.models
            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));

        for (const model of priorities) {
            if (available.includes(model)) return model;
        }
        return available[0] || 'gemini-2.0-flash';
    } catch (e) {
        console.warn("Failed to fetch models, defaulting to flash", e);
        return 'gemini-2.0-flash';
    }
};

const fetchContent = async (modelId, prompt) => {
    const response = await fetch(`${BASE_URL}/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || response.statusText);
    }

    return response.json();
};

export const generateDailyContent = async () => {
    // Fallback Data
    const fallbackData = {
        gregorianDate: new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        tithi: 'मार्गशीर्ष शुद्ध पंचमी',
        abhang: 'विठ्ठल विठ्ठल विठोबा विठ्ठल\nपांडुरंगा पांडुरंगा विठोबा विठ्ठल\nतुका म्हणे माझा स्वामी पांडुरंग\nविठ्ठल विठ्ठल विठोबा विठ्ठल',
        meaning: 'या अभंगात संत तुकाराम महाराज विठ्ठलाचे नाम घेत आहेत. पांडुरंग म्हणजे विठ्ठल. संत तुकारामांनी विठ्ठलाला आपला स्वामी म्हणून स्वीकारले आहे. या अभंगातून भक्तीची तीव्रता दिसून येते.',
        sant: 'संत तुकाराम महाराज',
        isFallback: true
    };

    try {
        if (!GEMINI_API_KEY) throw new Error('API Key Missing');

        const prompt = `
आज च्या दिवसासाठी खालील माहिती मराठी मध्ये द्या. कृपया संपूर्ण आणि तपशीलवार माहिती द्या.
आजची तारीख: ${new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

कृपया खालील माहिती JSON format मध्ये द्या:
1. **gregorianDate**: आजची तारीख मराठी मध्ये
2. **tithi**: आजची अचूक मराठी पंचांग तिथी
3. **abhang**: वारकरी संप्रदायातील एक **संपूर्ण** अभंग (कमीत कमी ४-६ ओळी).
4. **meaning**: त्या अभंगाचा **संपूर्ण** अर्थ मराठी मध्ये.
5. **sant**: कोणत्या संताने हे अभंग लिहिले

JSON format:
{
  "gregorianDate": "...",
  "tithi": "...",
  "abhang": "...",
  "meaning": "...",
  "sant": "..."
}`;

        let modelId = 'gemini-2.0-flash';
        let data;

        try {
            data = await fetchContent(modelId, prompt);
        } catch (firstError) {
            console.warn(`First attempt with ${modelId} failed:`, firstError);
            // If first attempt fails, try to find a valid model and retry
            modelId = await getWorkingModel();
            console.log(`Retrying with model: ${modelId}`);
            data = await fetchContent(modelId, prompt);
        }

        if (!data.candidates?.[0]?.content) {
            throw new Error('Invalid API Response');
        }

        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid JSON format');

        const content = JSON.parse(jsonMatch[0]);
        return { success: true, data: content };

    } catch (error) {
        console.error('Error generating daily content (Using Fallback):', error);
        // Return success: true so the UI doesn't show an error box
        return {
            success: true,
            data: fallbackData,
            error: error.message // Optional: pass error for debug logs if needed
        };
    }
};
