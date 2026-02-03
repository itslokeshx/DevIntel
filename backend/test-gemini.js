#!/usr/bin/env node

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to test
const modelsToTest = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-pro',
    'models/gemini-2.0-flash-exp',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
    'models/gemini-pro'
];

async function testModel(modelName) {
    try {
        console.log(`\n🧪 Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = "Say 'Hello from DevIntel!' in one sentence.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`✅ SUCCESS: ${modelName}`);
        console.log(`   Response: ${text.trim()}`);
        return { model: modelName, success: true, response: text.trim() };
    } catch (error) {
        console.log(`❌ FAILED: ${modelName}`);
        console.log(`   Error: ${error.message}`);
        return { model: modelName, success: false, error: error.message };
    }
}

async function findWorkingModel() {
    console.log('🔍 Testing Gemini API Models...\n');
    console.log('API Key:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing');
    console.log('='.repeat(60));

    const results = [];

    for (const modelName of modelsToTest) {
        const result = await testModel(modelName);
        results.push(result);

        // If we find a working model, we can stop
        if (result.success) {
            console.log('\n' + '='.repeat(60));
            console.log('🎉 FOUND WORKING MODEL!');
            console.log('='.repeat(60));
            console.log(`Model Name: ${result.model}`);
            console.log(`Response: ${result.response}`);
            console.log('\n✨ Update your code to use this model name!');
            return result.model;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('❌ No working models found');
    console.log('='.repeat(60));
    console.log('\nTried models:');
    results.forEach(r => {
        console.log(`  ${r.success ? '✅' : '❌'} ${r.model}`);
    });

    return null;
}

findWorkingModel()
    .then(workingModel => {
        if (workingModel) {
            process.exit(0);
        } else {
            console.log('\n💡 Suggestions:');
            console.log('  1. Check your API key is valid');
            console.log('  2. Visit https://ai.google.dev/models to see available models');
            console.log('  3. Try the Gemini API Explorer: https://aistudio.google.com/');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
