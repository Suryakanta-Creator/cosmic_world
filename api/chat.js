import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are COSMIC AI, an assistant onboard the COSMICWATCH space station.
Provide accurate, concise information about asteroids, comets, Near-Earth Objects, orbital mechanics, and space science.
Maintain a calm futuristic tone. Do not invent scientific facts. If reliable information is unavailable, say telemetry is unavailable or uncertain.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'COSMIC AI is not configured. Add GEMINI_API_KEY in Vercel Environment Variables.' });

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'A message is required.' });
  if (message.length > 3000) return res.status(413).json({ error: 'Message is too long.' });

  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];
  const transcript = history
    .filter((item) => item && (item.role === 'user' || item.role === 'model') && typeof item.text === 'string')
    .map((item) => `${item.role === 'user' ? 'Explorer' : 'COSMIC AI'}: ${item.text.slice(0,2500)}`)
    .join('\n');
  const prompt = transcript ? `Recent conversation:\n${transcript}\n\nExplorer: ${message}` : message;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const session = ai.chats.create({
      model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    const result = await session.sendMessage({ message: prompt });
    const text = result?.text?.trim();
    if (!text) return res.status(502).json({ error: 'The AI service returned an empty response.' });
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini request failed:', error);
    return res.status(502).json({ error: 'Unable to reach the COSMIC AI service right now.' });
  }
}
