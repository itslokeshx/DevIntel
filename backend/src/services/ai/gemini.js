const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI content using Gemini
 */
async function generateContent(prompt, retries = 0) {
    // Temporarily disabled - return fallback immediately
    return 'AI insights temporarily disabled - focusing on core metrics';

    /* Commented out until we fix the model name
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error('Gemini API error:', error.message);

        // Retry logic
        if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            return generateContent(prompt, retries - 1);
        }

        // Return fallback message if all retries fail
        return 'AI insight generation temporarily unavailable';
    }
    */
}

/**
 * Generate AI content in batch (multiple prompts)
 */
async function generateBatch(prompts) {
    const results = [];

    for (const prompt of prompts) {
        try {
            const content = await generateContent(prompt);
            results.push(content);

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error in batch generation:', error.message);
            results.push('Insight unavailable');
        }
    }

    return results;
}

module.exports = {
    generateContent,
    generateBatch
};
