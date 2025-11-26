const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

export const generateDailyContent = async () => {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('API Key Missing: VITE_GEMINI_API_KEY not found in environment variables');
        }
        const prompt = `
आज च्या दिवसासाठी खालील माहिती मराठी मध्ये द्या. कृपया संपूर्ण आणि तपशीलवार माहिती द्या.

आजची तारीख: ${new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

कृपया खालील माहिती JSON format मध्ये द्या:

1. **gregorianDate**: आजची तारीख मराठी मध्ये (उदा. "२५ नोव्हेंबर २०२५")
2. **tithi**: आजची अचूक मराठी पंचांग तिथी (उदा. "कार्तिक शुद्ध द्वादशी" किंवा "मार्गशीर्ष कृष्ण पंचमी")
3. **abhang**: वारकरी संप्रदायातील एक **संपूर्ण** अभंग (कमीत कमी ४-६ ओळी). संत ज्ञानेश्वर, संत तुकाराम, संत नामदेव, संत एकनाथ यांपैकी कोणाचेही प्रसिद्ध अभंग द्या.
4. **meaning**: त्या अभंगाचा **संपूर्ण आणि तपशीलवार** अर्थ मराठी मध्ये (कमीत कमी ३-४ वाक्ये). प्रत्येक ओळीचा अर्थ स्पष्ट करा.
5. **sant**: कोणत्या संताने हे अभंग लिहिले (पूर्ण नाव)

**महत्वाचे**: अभंग आणि अर्थ संपूर्ण असणे आवश्यक आहे. अर्ध्यावर थांबू नका.

JSON format (फक्त हे उत्तर द्या, इतर काही नको):
{
  "gregorianDate": "२५ नोव्हेंबर २०२५",
  "tithi": "कार्तिक शुद्ध द्वादशी",
  "abhang": "पूर्ण अभंग येथे लिहा...\\nसर्व ओळी येथे...",
  "meaning": "अभंगाचा संपूर्ण आणि तपशीलवार अर्थ येथे लिहा. प्रत्येक ओळीचा अर्थ स्पष्ट करा.",
  "sant": "संत तुकाराम महाराज"
}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // Extract JSON from response (remove markdown code blocks if present)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from API');
        }

        const content = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            data: content
        };

    } catch (error) {
        console.error('Error generating daily content:', error);
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
                meaning: 'या अभंगात संत तुकाराम महाराज विठ्ठलाचे नाम घेत आहेत. पांडुरंग म्हणजे विठ्ठल. संत तुकारामांनी विठ्ठलाला आपला स्वामी म्हणून स्वीकारले आहे. या अभंगातून भक्तीची तीव्रता दिसून येते.',
                sant: 'संत तुकाराम महाराज'
            }
        };
    }
};
