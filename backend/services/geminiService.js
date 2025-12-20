require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getSuggestions(userInput) {
  try {
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash-latest",
});


    const prompt = `
User mood/input: "${userInput}"

Give 2 short, practical, comforting suggestions.
Respond ONLY in English.
Be a little informal and friendly.
Return strictly a bullet point list.
Also suggest:
- one related music
- one related article I might like to read.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini API failed:", error.message);

    // 🛡️ Fallback so app never crashes
    return `
- Take a few slow deep breaths and give yourself a short break.
- Write down what you're feeling to clear your mind.
- 🎵 Music: Try listening to a calm lo-fi or acoustic playlist.
- 📖 Article: Read a short article on simple mindfulness tips.
`;
  }
}

module.exports = { getSuggestions };
