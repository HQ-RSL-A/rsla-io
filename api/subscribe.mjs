import { createRateLimiter, checkRateLimit } from './lib/rateLimit.mjs';

const rateLimiter = createRateLimiter(5, '1 m');

const ALLOWED_FORM_IDS = new Set([
    '9130465',
]);

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
    const { success } = await checkRateLimit(rateLimiter, `subscribe:${ip}`);
    if (!success) {
        res.status(429).json({ error: 'Too many requests' });
        return;
    }

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch {
        res.status(400).json({ error: 'Invalid JSON' });
        return;
    }

    const { email, firstName, tags, formId, website } = body;

    // Honeypot — a hidden "website" field that legitimate humans leave blank.
    // Bots that fill every form field get a success response without any
    // actual subscription call. No feedback so they don't probe further.
    if (website) {
        res.status(200).json({ success: true });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Valid email required' });
        return;
    }

    const targetFormId = String(formId || process.env.KIT_FORM_ID || '');
    if (!ALLOWED_FORM_IDS.has(targetFormId)) {
        res.status(400).json({ error: 'Invalid form ID' });
        return;
    }

    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
        console.error('subscribe: KIT_API_KEY env var is not configured');
        res.status(500).json({ error: 'Server misconfigured' });
        return;
    }

    const payload = {
        api_key: apiKey,
        email,
    };
    if (firstName && typeof firstName === 'string') {
        payload.first_name = firstName.replace(/<[^>]*>/g, '').slice(0, 100);
    }
    if (Array.isArray(tags) && tags.length > 0 && tags.length <= 10) {
        payload.tags = tags.filter((t) => typeof t === 'string' || typeof t === 'number');
    }

    try {
        const kitRes = await fetch(
            `https://api.convertkit.com/v3/forms/${encodeURIComponent(targetFormId)}/subscribe`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );

        if (!kitRes.ok) {
            const detail = await kitRes.text().catch(() => '');
            console.error('subscribe: Kit API returned', kitRes.status, detail.slice(0, 200));
            res.status(502).json({ error: 'Subscription failed' });
            return;
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('subscribe: unexpected error', err);
        res.status(500).json({ error: 'Unexpected error' });
    }
}
