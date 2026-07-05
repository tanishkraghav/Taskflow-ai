const Groq = require('groq-sdk');

// Initialize Groq client only if API key is provided
let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

/**
 * Classifies a task title and description into one of three priority levels: urgent, important, or low.
 * Falls back to 'important' gracefully if any failure occurs.
 * 
 * @param {string} title - The title of the task
 * @param {string} description - The description of the task
 * @returns {Promise<string>} 'urgent' | 'important' | 'low'
 */
const classifyTaskPriority = async (title, description) => {
  // If Groq is not initialized (e.g. key missing), default to important
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  if (!groq) {
    console.warn('Groq API Key not configured. Defaulting task priority to "important".');
    return 'important';
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that prioritizes to-do tasks. You must classify the task into exactly one of: "urgent", "important", or "low". Respond with ONLY one of those three words in lowercase, without any markdown formatting, punctuation, explanation, or extra characters.'
        },
        {
          role: 'user',
          content: `Task Title: ${title}\nDescription: ${description || 'No description'}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      max_tokens: 5,
    });

    const priority = response.choices[0]?.message?.content?.trim().toLowerCase();

    if (['urgent', 'important', 'low'].includes(priority)) {
      return priority;
    }

    console.warn(`Invalid priority response from Groq: "${priority}". Defaulting to "important".`);
    return 'important';
  } catch (error) {
    console.error('Groq API prioritization failure:', error.message);
    return 'important';
  }
};

module.exports = { classifyTaskPriority };
