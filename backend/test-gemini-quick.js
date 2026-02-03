#!/usr/bin/env node

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini25Flash() {
    try {
        console.log('🧪 Testing Gemini 2.5 Flash...\n');

        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

        const prompt = "You are DevIntel AI. Say 'Hello from Gemini 2.5 Flash! I'm ready to generate developer insights.' in one friendly sentence.";

        console.log('📤 Sending prompt...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS!\n');
        console.log('Response:', text.trim());
        console.log('\n🎉 Gemini 2.5 Flash is working perfectly!');
        console.log('✨ Model name to use: models/gemini-2.5-flash');

        return true;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

testGemini25Flash();
