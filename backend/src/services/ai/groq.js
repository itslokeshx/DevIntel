const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate AI content using Groq with Llama 3.3 70B
 */
async function generateContent(prompt, retries = 3) {
    try {
        const chatCompletion = await groq.chat.completions.create({
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
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 4096,
            top_p: 1,
            stream: false
        });

        if (chatCompletion.choices && chatCompletion.choices.length > 0) {
            return chatCompletion.choices[0].message.content.trim();
        }

        throw new Error('Invalid response format from Groq');

    } catch (error) {
        console.error('Groq API error:', error.message);

        // Retry logic with exponential backoff
        if (retries > 0) {
            const waitTime = (4 - retries) * 1000; // 1s, 2s, 3s
            console.log(`Retrying... (${retries} attempts left) - waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return generateContent(prompt, retries - 1);
        }

        // Return null if all retries fail
        return null;
    }
}

/**
 * Generate AI content in batch (multiple prompts)
 */
async function generateBatch(prompts) {
    const results = [];

    for (const prompt of prompts) {
        try {
            const content = await generateContent(prompt);
            results.push(content || 'Insight unavailable');

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Error in batch generation:', error.message);
            results.push('Insight unavailable');
        }
    }

    return results;
}

/**
 * Stream AI content using Groq (for real-time responses)
 */
async function* streamContent(prompt, options = {}) {
    try {
        const stream = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: options.systemMessage || 'You are an expert developer intelligence analyst. Provide concise, professional, and accurate insights based on GitHub data.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: options.model || 'llama-3.3-70b-versatile',
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 500,
            top_p: 1,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                yield content;
            }
        }
    } catch (error) {
        console.error('Groq streaming error:', error.message);
        throw error;
    }
}

module.exports = {
    generateContent,
    generateBatch,
    streamContent
};
