const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateDailyContent = async () => {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error('API Key Missing: VITE_OPENAI_API_KEY not found in environment variables');
        }

        const today = new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        const prompt = `
आजची तारीख: ${today}

तुम्ही वारकरी संप्रदायाचे गाढे अभ्यासक आहात. आजच्या दिवसासाठी खालील माहिती मराठी मध्ये द्या.

1. **gregorianDate**: आजची तारीख मराठी मध्ये (उदा. "२६ नोव्हेंबर २०२५")
2. **tithi**: आजची अचूक मराठी पंचांग तिथी (उदा. "कार्तिक शुद्ध द्वादशी")
3. **abhang**: वारकरी संप्रदायातील एक **संपूर्ण** अभंग (कमीत कमी ४-६ ओळी). संत ज्ञानेश्वर, संत तुकाराम, संत नामदेव, संत एकनाथ यांपैकी कोणाचेही प्रसिद्ध अभंग द्या.
4. **meaning**: त्या अभंगाचा **संपूर्ण आणि तपशीलवार** अर्थ मराठी मध्ये (कमीत कमी ३-४ वाक्ये). सोप्या भाषेत सांगा.
5. **sant**: कोणत्या संताने हे अभंग लिहिले (पूर्ण नाव)

फक्त खालील JSON format मध्ये उत्तर द्या (इतर काहीही लिहू नका):
{
  "gregorianDate": "...",
  "tithi": "...",
  "abhang": "...",
  "meaning": "...",
  "sant": "..."
}`;

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Cost effective and fast
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant knowledgeable about Warkari Sampraday and Marathi culture. You always respond in valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.status}`);
        }

        const data = await response.json();
        const contentStr = data.choices[0].message.content;

        // Clean up markdown code blocks if present
        const jsonStr = contentStr.replace(/```json\n?|\n?```/g, '').trim();

        const content = JSON.parse(jsonStr);

        return {
            success: true,
            data: content
        };

    } catch (error) {
        console.error('Error generating daily content (OpenAI):', error);
        return {
            success: false,
            error: error.message,
            // Fallback content
            data: {
                gregorianDate: new Date().toLocaleDateString('mr-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                tithi: 'मार्गशीर्ष शुद्ध पंचमी',
                abhang: 'विठ्ठल विठ्ठल विठोबा विठ्ठल\nपांडुरंगा पांडुरंगा विठोबा विठ्ठल\nतुका म्हणे माझा स्वामी पांडुरंग\nविठ्ठल विठ्ठल विठोबा विठ्ठल',
                meaning: 'या अभंगात संत तुकाराम महाराज विठ्ठलाचे नाम घेत आहेत. पांडुरंग म्हणजे विठ्ठल. संत तुकारामांनी विठ्ठलाला आपला स्वामी म्हणून स्वीकारले आहे.',
                sant: 'संत तुकाराम महाराज'
            }
        };
    }
};
