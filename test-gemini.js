import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_GEMINI_API_KEY;

console.log("--- Gemini API Diagnostic ---");

if (!API_KEY) {
    console.error("❌ ERROR: VITE_GEMINI_API_KEY is missing in environment variables.");
    process.exit(1);
}

console.log("✅ API Key found (length: " + API_KEY.length + ")");

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

async function test() {
    try {
        console.log("\n1. Testing Model List...");
        const listResponse = await fetch(`${BASE_URL}/models?key=${API_KEY}`);

        if (!listResponse.ok) {
            const errText = await listResponse.text();
            console.error(`❌ List Models Failed: ${listResponse.status} ${listResponse.statusText}`);
            console.error(`Response: ${errText}`);
            return;
        }

        const listData = await listResponse.json();
        console.log("✅ List Models Success!");
        const models = listData.models.map(m => m.name);
        console.log("Available Models:", models);

        console.log("\n2. Testing Generation (gemini-2.0-flash)...");
        const genResponse = await fetch(`${BASE_URL}/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, say hi." }] }]
            })
        });

        if (!genResponse.ok) {
            const errText = await genResponse.text();
            console.error(`❌ Generation Failed: ${genResponse.status} ${genResponse.statusText}`);
            console.error(`Response: ${errText}`);
            return;
        }

        const genData = await genResponse.json();
        console.log("✅ Generation Success!");
        console.log("Response:", genData.candidates[0].content.parts[0].text);

    } catch (error) {
        console.error("❌ Unexpected Error:", error);
    }
}

test();
