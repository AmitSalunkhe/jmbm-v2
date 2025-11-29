import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_PANCHANG_API_KEY;

console.log("--- Panchang API Diagnostic ---");

if (!API_KEY) {
    console.error("❌ ERROR: VITE_PANCHANG_API_KEY is missing.");
    process.exit(1);
}

console.log("✅ API Key found (length: " + API_KEY.length + ")");

const today = new Date();

const testConfigs = [
    {
        name: "freeastrologyapi.com with x-api-key",
        url: 'https://json.freeastrologyapi.com/v1/basic_panchang',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    },
    {
        name: "astrologyapi.com with x-api-key",
        url: 'https://json.astrologyapi.com/v1/basic_panchang',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    },
    {
        name: "astrologyapi.com with Authorization Bearer",
        url: 'https://json.astrologyapi.com/v1/basic_panchang',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        }
    }
];

const requestBody = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    hours: today.getHours(),
    minutes: today.getMinutes(),
    latitude: 19.2056,
    longitude: 72.8347,
    timezone: 5.5
};

async function testAPI() {
    for (const config of testConfigs) {
        console.log(`\n\n=== Testing: ${config.name} ===`);
        console.log(`URL: ${config.url}`);
        console.log(`Headers:`, config.headers);
        console.log(`Body:`, requestBody);

        try {
            const response = await fetch(config.url, {
                method: 'POST',
                headers: config.headers,
                body: JSON.stringify(requestBody)
            });

            console.log(`\nStatus: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ FAILED`);
                console.error(`Response: ${errorText}`);
                continue;
            }

            const data = await response.json();
            console.log("✅ SUCCESS!");
            console.log("Tithi:", data.tithi);
            console.log("Full Response:", JSON.stringify(data, null, 2));
            break; // Stop after first success

        } catch (error) {
            console.error(`❌ ERROR: ${error.message}`);
        }
    }
}

testAPI();
