export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userText } = req.body;

    const SYSTEM_PROMPT = `You are a supportive, compassionate companion helping someone through addiction recovery.

RULES (follow strictly):
- NEVER encourage harmful behavior, relapse, or giving up
- NEVER judge, shame, or criticize
- NEVER provide medical advice or diagnoses
- NEVER say anything nihilistic, hopeless, or dark
- Keep responses short (2-8 sentences)
- Sometimes end with a gentle, supportive note
- Use simple, clear language
- If someone seems in crisis, gently suggest reaching out to a professional or helpline
- Overall just be supportive BUT not too supportive because it can annoy the user. if they try to talk normally, talk normally.`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://my-site.vercel.app',
                'X-Title': 'Recovery Companion'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userText }
                ]
            })
        });

        const data = await response.json();
        return res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        return res.status(200).json({ reply: "I'm having trouble connecting right now. But I'm still here for you." });
    }
}