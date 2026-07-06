const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let useMockAI = true;

const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    useMockAI = false;
    console.log('[AI Configuration] Gemini API service initialized successfully.');
  } catch (err) {
    console.error(`[AI Configuration] Error initializing Gemini API: ${err.message}`);
    console.log('[AI Configuration] Falling back to Mock AI parsing mode.');
  }
} else {
  console.log('[AI Configuration] GEMINI_API_KEY not configured or empty. Using Mock AI parsing mode.');
}

const getAIClient = () => {
  return {
    genAI,
    useMockAI,
    modelName: 'gemini-1.5-flash'
  };
};

module.exports = { getAIClient };
