const axios = require('axios');

// OpenRouter API Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OR_API;

// Model Tier List (Quality -> Speed -> Fallback)
const MODELS = [
    'mistralai/mixtral-8x7b-instruct',      // Primary: Best quality free model
    'mistralai/mistral-7b-instruct',        // Secondary: Faster, reliable
    'nousresearch/nous-hermes-2-mixtral-8x7b-dpo' // Fallback: Good alternative
];

/**
 * Generate AI content using OpenRouter with tiered fallback
 */
async function generateContent(prompt, modelIndex = 0) {
    // If we've exhausted all models, return null
    if (modelIndex >= MODELS.length) {
        console.error('All AI models failed to respond.');
        return null;
    }

    const currentModel = MODELS[modelIndex];

    try {
        console.log(`Attempting AI generation with model: ${currentModel}`);

        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: currentModel,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert developer intelligence analyst. Provide concise, professional, and accurate insights based on GitHub data.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2500
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': 'https://devintel.app', // Required by OpenRouter
                    'X-Title': 'DevIntel',
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            }
        );

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content.trim();
        }

        throw new Error('Invalid response format from OpenRouter');

    } catch (error) {
        console.error(`Error with model ${currentModel}:`, error.message);

        // Setup retry/fallback
        // If it's a rate limit or server error, try next model immediately
        console.log(`Falling back to next model...`);
        return generateContent(prompt, modelIndex + 1);
    }
}

/**
 * Generate AI content in batch (multiple prompts)
 * Wraps generateContent for consistency with existing interface
 */
async function generateBatch(prompts) {
    const results = [];

    for (const prompt of prompts) {
        const content = await generateContent(prompt);
        results.push(content || 'Insight unavailable');

        // Small delay to be polite to the API
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
}

module.exports = {
    generateContent,
    generateBatch
};
