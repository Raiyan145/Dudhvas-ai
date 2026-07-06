# দুধভাস AI 🥛✨

Gemini API দিয়ে তৈরি একটা স্টাডি অ্যাসিস্ট্যান্ট। লেখা পেস্ট করো বা ছবি (অঙ্ক, ডায়াগ্রাম, নোট) আপলোড করো — একদম বাচ্চাদের মতো সহজ করে, উদাহরণ ও ধাপে ধাপে বুঝিয়ে দেবে।

## ফোল্ডার স্ট্রাকচার

```
dudhvas-ai/
├── public/
│   └── index.html      ← ফ্রন্টএন্ড (ডিজাইন করা পেজ)
├── api/
│   └── gemini.js        ← Vercel সার্ভারলেস ফাংশন (Gemini API কল করে, key নিরাপদ রাখে)
├── package.json
├── vercel.json
└── .gitignore
```

**গুরুত্বপূর্ণ:** API key কখনো `index.html`-এ বসাবে না। এটা `api/gemini.js`-এ Environment Variable থেকে আসে, তাই ব্রাউজারে কেউ key দেখতে পাবে না।

---

## ধাপ ১: Gemini API Key নাও

1. যাও: https://aistudio.google.com/apikey
2. Google অ্যাকাউন্ট দিয়ে লগইন করো
3. "Create API Key" চাপো, key-টা কপি করে রাখো (এটা কাউকে শেয়ার করবে না)

## ধাপ ২: GitHub-এ রিপো বানাও

1. https://github.com এ গিয়ে নতুন একটা রিপোজিটরি বানাও (যেমন `dudhvas-ai`)
2. তোমার কম্পিউটারে এই ফোল্ডারটা নিয়ে টার্মিনালে যাও, তারপর:

```bash
cd dudhvas-ai
git init
git add .
git commit -m "দুধভাস AI - প্রথম ভার্সন"
git branch -M main
git remote add origin https://github.com/<তোমার-ইউজারনেম>/dudhvas-ai.git
git push -u origin main
```

## ধাপ ৩: Vercel-এ ডিপ্লয় করো

1. https://vercel.com এ গিয়ে GitHub দিয়ে লগইন করো
2. "Add New Project" চাপো, তোমার `dudhvas-ai` রিপোটা সিলেক্ট করো
3. **Deploy** চাপার আগে "Environment Variables" সেকশনে গিয়ে যোগ করো:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** (তোমার কপি করা Gemini key)
4. এবার **Deploy** চাপো। ১-২ মিনিটেই লাইভ হয়ে যাবে, একটা লিংক পাবে (যেমন `dudhvas-ai.vercel.app`)

> পরে যদি key বদলাতে হয় বা নতুন যোগ করতে হয়: Vercel প্রজেক্টের **Settings → Environment Variables** থেকে করা যায়। বদলানোর পর একবার **Redeploy** করতে হবে।

## লোকালি টেস্ট করতে চাইলে (ঐচ্ছিক)

```bash
npm i -g vercel
vercel dev
```

এটা চালানোর আগে প্রজেক্ট ফোল্ডারে `.env` ফাইলে লিখে রাখো:
```
GEMINI_API_KEY=তোমার_key_এখানে_বসাও
```

---

## ভবিষ্যতে যা যোগ করা যায়

- লগইন সিস্টেম দিয়ে ব্যক্তিগত হিস্ট্রি সেভ রাখা (যেমন Supabase বা Firebase দিয়ে)
- একই প্রশ্নে "আরও সহজ করে বলো" বাটন
- ভয়েসে প্রশ্ন করার সুবিধা
- অধ্যায়ভিত্তিক প্র্যাকটিস প্রশ্ন তৈরি করে দেওয়া

কোনো ধাপে আটকে গেলে বা নতুন ফিচার যোগ করতে চাইলে বোলো, একসাথে বসিয়ে দেব। 🥛
