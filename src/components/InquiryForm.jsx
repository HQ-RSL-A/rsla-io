import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL } from '@/data/serviceConstants.mjs';

const field = 'w-full rounded-button border border-hairline bg-surface px-4 py-3 font-sans text-base text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent min-h-[44px]';
const label = 'block font-sans font-medium text-base text-text mb-2';
const button = 'inline-flex items-center justify-center gap-2 rounded-button bg-accent px-6 py-3 font-sans font-medium text-base text-white hover:bg-accentDeep active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out-smooth min-h-[44px] disabled:opacity-60 disabled:active:scale-100';

/**
 * Written inquiry. Posts to /api/inquiry, which files the message in the CRM.
 * Controlled submit on purpose: React 19 resets a form passed an action, and a
 * failed send must keep what the person typed.
 */
export default function InquiryForm({ page }) {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    async function onSubmit(e) {
        e.preventDefault();
        if (status === 'sending') return;
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const phone = (data.phone || '').trim();
        const email = (data.email || '').trim();
        if (!phone && !email) {
            setError('Leave a phone number or an email so we can reply.');
            return;
        }
        setError('');
        setStatus('sending');
        try {
            const res = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, page: page || window.location.pathname }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setStatus('sent');
            window.dataLayer?.push({ event: 'inquiry_submit', cta_location: page || window.location.pathname });
        } catch {
            setStatus('error');
        }
    }

    if (status === 'sent') {
        return (
            <div className="rounded-callout border border-hairline bg-frost p-6" role="status">
                <p className="font-sans font-bold text-lg text-text mb-2">Got it.</p>
                <p className="font-sans text-base text-text">
                    We reply within one business day, usually the same day. In a hurry? Call <a href={PHONE_TEL} className="text-accent hover:underline underline-offset-4">{PHONE_DISPLAY}</a>.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            <div>
                <label htmlFor="inq-name" className={label}>Your name</label>
                <input id="inq-name" name="name" type="text" required minLength={2} maxLength={100} autoComplete="name" className={field} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="inq-phone" className={label}>Phone</label>
                    <input id="inq-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} />
                </div>
                <div>
                    <label htmlFor="inq-email" className={label}>Email</label>
                    <input id="inq-email" name="email" type="email" maxLength={254} autoComplete="email" className={field} />
                </div>
            </div>
            <div>
                <label htmlFor="inq-message" className={label}>What do you need?</label>
                <p id="inq-message-hint" className="font-sans text-sm text-text mb-2">The business, the problem, and what you have tried.</p>
                <textarea id="inq-message" name="message" required minLength={5} maxLength={2000} rows={4} className={field} aria-describedby="inq-message-hint" />
            </div>
            <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="org_hp_check">Leave this field empty</label>
                <input id="org_hp_check" name="org_hp_check" type="text" tabIndex={-1} autoComplete="nope" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button type="submit" disabled={status === 'sending'} className={button}>
                    {status === 'sending' ? 'Sending' : 'Send message'}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
                <p className="font-sans text-sm text-text">No newsletter, no drip. One reply from Rahul.</p>
            </div>
            {error && <p className="font-sans text-base text-text" role="alert">{error}</p>}
            {status === 'error' && (
                <p className="font-sans text-base text-text" role="alert">
                    That did not go through. Call <a href={PHONE_TEL} className="text-accent hover:underline underline-offset-4">{PHONE_DISPLAY}</a> or email <a href="mailto:hello@rsla.io" className="text-accent hover:underline underline-offset-4">hello@rsla.io</a> and we will pick it up.
                </p>
            )}
        </form>
    );
}
