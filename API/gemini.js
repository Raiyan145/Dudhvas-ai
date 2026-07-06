// api/gemini.js
// Vercel Serverless Function — Gemini API-কে নিরাপদে কল করার জন্য।
// API key এখানে সার্ভার সাইডে থাকে (environment variable), ব্রাউজারে কখনো যায় না।

const GEMINI_MODEL = 'gemini-2.5-flash'; // দরকার হলে Google AI Studio-তে থাকা অন্য মডেলের নাম দিয়ে বদলে নিতে পারো
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'শুধুমাত্র POST রিকোয়েস্ট সাপোর্ট করে।' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'সার্ভারে GEMINI_API_KEY সেট করা নেই। Vercel-এর Environment Variables-এ এটা যোগ করো।' });
    return;
  }

  try {
    const { prompt, level, image, mimeType } = req.body || {};

    if (!prompt && !image) {
      res.status(400).json({ error: 'কোনো লেখা বা ছবি পাওয়া যায়নি।' });
      return;
    }

    const systemInstruction = `তুমি "দুধভাস AI" — একজন অসম্ভব যত্নশীল ও ধৈর্যশীল বাংলা শিক্ষক।
তোমার কাজ হলো ব্যবহারকারীর দেওয়া লেখা, টপিক বা ছবি (অঙ্ক, ডায়াগ্রাম, নোট) এমনভাবে বুঝিয়ে দেওয়া যেন
এক পড়াতেই পুরোপুরি মাথায় ঢুকে যায় এবং কোনো ঘাটতি না থাকে।

নিয়মাবলী:
- সবসময় বাংলায়, সহজ ও আন্তরিক ভাষায় উত্তর দেবে।
- প্রথমে এক বা দুই লাইনে মূল ধারণাটা (মূলভাব) বলে দেবে।
- এরপর ধাপে ধাপে ভেঙে ব্যাখ্যা করবে, প্রয়োজনে হেডিং (##) ব্যবহার করবে।
- অন্তত একটা বাস্তব জীবনের উদাহরণ বা উপমা দেবে, যেন কল্পনা করা সহজ হয়।
- ছবি/ডায়াগ্রামের প্রশ্ন হলে, ছবিতে কী আছে সংক্ষেপে বর্ণনা করে তারপর ধাপে ধাপে সমাধান করবে।
- অঙ্ক হলে প্রতিটা ধাপ দেখাবে, শুধু উত্তর দেবে না। গাণিতিক সূত্র/রাশি লেখার সময় LaTeX ব্যবহার করবে (যেমন $x^2 + 1$ অথবা $$...$$)।
- শেষে ২-৩ লাইনের একটা ছোট "মনে রাখার কৌশল" বা সারসংক্ষেপ দেবে।
- ব্যাখ্যার স্তর: ${level || 'সহজ ভাষায়, বাস্তব উদাহরণসহ'}
- উত্তর markdown ফরম্যাটে দেবে (হেডিং, বুলেট পয়েন্ট, বোল্ড ব্যবহার করতে পারো)।`;

    const parts = [];
    if (prompt) {
      parts.push({ text: prompt });
    }
    if (image && mimeType) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: image
        }
      });
    }

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 4096
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      const message = (data && data.error && data.error.message) || 'Gemini API থেকে উত্তর পাওয়া যায়নি।';
      res.status(response.status).json({ error: message });
      return;
    }

    const candidate = data.candidates && data.candidates[0];
    const text = candidate && candidate.content && candidate.content.parts
      ? candidate.content.parts.map(p => p.text || '').join('\n')
      : '';

    if (!text) {
      res.status(502).json({ error: 'মডেল থেকে কোনো উত্তর তৈরি হয়নি। আবার চেষ্টা করো।' });
      return;
    }

    res.status(200).json({ text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে কোনো একটা সমস্যা হয়েছে। একটু পর আবার চেষ্টা করো।' });
  }
};
