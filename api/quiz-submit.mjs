import { createRateLimiter, checkRateLimit } from './lib/rateLimit.mjs';

const rateLimiter = createRateLimiter(10, '1 m');

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const { success } = await checkRateLimit(rateLimiter, `quiz:${ip}`);
    if (!success) {
        res.status(429).json({ error: 'Too many requests' });
        return;
    }

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
        res.status(400).json({ error: 'Invalid JSON' });
        return;
    }

    const { email, name, phone, agency, city, answerLabels, result, offer } = body;

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Valid email is required' });
        return;
    }

    const webhookUrl = process.env.QUIZ_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
        res.status(200).json({ ok: true, saved: false });
        return;
    }

    try {
        const a = answerLabels || {};

        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                name: name || '',
                email,
                phone: phone || '',
                business: agency || '',
                city: city || '',
                q1Discovery: a.discovery || '',
                q2Confidence: a.confidence || '',
                q3Platform: a.platform || '',
                q4LastUpdate: a.lastUpdate || '',
                q5Seo: a.seo || '',
                result: result || '',
                offer: offer || '',
                status: 'new',
            }),
        });

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Quiz submit error:', err);
        res.status(500).json({ error: 'Failed to save' });
    }
}
