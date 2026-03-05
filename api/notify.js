export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { choice } = req.body;

    // 2. Securely pull Telegram credentials from Vercel
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        return res.status(500).json({ success: false, error: 'Missing Telegram credentials in Vercel' });
    }

    const messageText = `🚨 Girlfriend Proposal Update!\nPrincess has made her choice! She clicked: ${choice}`;

    try {
        // 3. Send the message via Telegram's API
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText,
            }),
        });

        if (response.ok) {
            res.status(200).json({ success: true });
        } else {
            const errorData = await response.json();
            console.error("Telegram Error:", errorData);
            res.status(500).json({ success: false, error: 'Failed to send Telegram message' });
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}