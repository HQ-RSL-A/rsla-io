import { createRateLimiter, checkRateLimit } from './lib/rateLimit.mjs';

/**
 * Written inquiries from rsla.io. Creates (or refreshes) the contact in
 * RSL/A's own GoHighLevel location, tags it, and files the message as a note,
 * so the follow up runs through the same CRM we sell.
 *
 * Env: GHL_API_KEY (private integration token), GHL_LOCATION_ID, optional GHL_BASE_URL.
 */
const rateLimiter = createRateLimiter(5, '10 m');
const GHL_BASE = (process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com').replace(/\/$/, '');
const INQUIRY_TAG = 'website-inquiry';

const clean = (v, max) => (typeof v === 'string' ? v.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '');
const cleanMultiline = (v, max) => (typeof v === 'string' ? v.replace(/<[^>]*>/g, '').replace(/\r\n?/g, '\n').trim().slice(0, max) : '');
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;

function normalizePhone(raw) {
    const digits = raw.replace(/[^\d]/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    if (raw.startsWith('+') && digits.length >= 10 && digits.length <= 15) return `+${digits}`;
    return '';
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const { success } = await checkRateLimit(rateLimiter, `inquiry:${ip}`);
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

    // Spam trap. The field name means nothing to autofill, so real people never
    // touch it; anything that fills it gets a quiet success and no CRM record.
    if (body.org_hp_check) {
        res.status(200).json({ success: true });
        return;
    }

    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const phone = normalizePhone(clean(body.phone, 40));
    const message = cleanMultiline(body.message, 2000);
    const pageRaw = clean(body.page, 200);
    const page = pageRaw.startsWith('/') ? pageRaw : '';

    if (name.length < 2) { res.status(400).json({ error: 'Name required' }); return; }
    if (!isEmail(email) && !phone) { res.status(400).json({ error: 'A phone number or an email is required' }); return; }
    if (message.length < 5) { res.status(400).json({ error: 'Message required' }); return; }

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    if (!apiKey || !locationId) {
        console.error('inquiry: GHL_API_KEY or GHL_LOCATION_ID is not configured');
        res.status(500).json({ error: 'Server misconfigured' });
        return;
    }

    const headers = {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');

    try {
        // Tags are deliberately left off the upsert: passing them overwrites the
        // contact's whole tag list. They are added on their own call below.
        const upsertBody = { locationId, firstName, source: 'rsla.io inquiry form' };
        if (lastName) upsertBody.lastName = lastName;
        if (isEmail(email)) upsertBody.email = email;
        if (phone) upsertBody.phone = phone;

        const upsert = await fetch(`${GHL_BASE}/contacts/upsert`, { method: 'POST', headers, body: JSON.stringify(upsertBody) });
        if (!upsert.ok) {
            console.error('inquiry: upsert returned', upsert.status, (await upsert.text().catch(() => '')).slice(0, 300));
            res.status(502).json({ error: 'Could not send' });
            return;
        }
        const contactId = (await upsert.json())?.contact?.id;
        if (!contactId) {
            console.error('inquiry: upsert returned no contact id');
            res.status(502).json({ error: 'Could not send' });
            return;
        }

        const tags = [INQUIRY_TAG];
        if (page) tags.push(`page:${page}`);
        const tagRes = await fetch(`${GHL_BASE}/contacts/${contactId}/tags`, { method: 'POST', headers, body: JSON.stringify({ tags }) });
        if (!tagRes.ok) console.error('inquiry: tag call returned', tagRes.status);

        const noteBody = [
            `Website inquiry${page ? ` from ${page}` : ''}`,
            '',
            message,
            '',
            `Name: ${name}`,
            phone ? `Phone: ${phone}` : null,
            isEmail(email) ? `Email: ${email}` : null,
        ].filter((l) => l !== null).join('\n');
        const noteRes = await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: noteBody }) });
        if (!noteRes.ok) {
            console.error('inquiry: note returned', noteRes.status, (await noteRes.text().catch(() => '')).slice(0, 300));
            res.status(502).json({ error: 'Could not send' });
            return;
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('inquiry: unexpected error', err);
        res.status(500).json({ error: 'Unexpected error' });
    }
}
