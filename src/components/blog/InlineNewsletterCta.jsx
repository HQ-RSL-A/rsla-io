import { useState } from 'react';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID || '9130465';

export default function InlineNewsletterCta() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || status === 'submitting') return;

        setStatus('submitting');
        let succeeded = false;
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, formId: KIT_FORM_ID }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
                succeeded = true;
                window.dataLayer?.push({ event: 'newsletter_subscribe', source: 'blog_inline' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
        if (!succeeded) setTimeout(() => setStatus('idle'), 4000);
    };

    if (status === 'success') {
        return (
            <div className="my-16 p-8 rounded-callout bg-frost border border-hairline">
                <p className="font-sans font-bold text-lg text-text mb-1">Talk Tuesday.</p>
                <p className="font-sans text-sm text-text">Check your inbox for a confirmation.</p>
            </div>
        );
    }

    return (
        <div className="my-16 p-6 md:p-8 rounded-callout bg-frost border border-hairline">
            {/* Branding */}
            <h4 className="font-sans font-bold text-xl text-text leading-tight mb-3">The Insider</h4>

            {/* Copy */}
            <p className="font-sans text-[15px] text-text leading-relaxed mb-4">
                Liked this? Every Tuesday I send one{' '}
                <span className="font-bold">growth system</span>{' '}
                you can apply to your business that day and see results.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'submitting'}
                    required
                    className="flex-1 h-[44px] px-3.5 rounded-button border border-hairline bg-surface text-base font-sans text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-[border-color,box-shadow] duration-150 ease-out"
                />
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="h-[44px] px-5 rounded-button bg-accent text-white font-sans font-medium text-base hover:bg-accentDeep active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                    {status === 'submitting' ? '...' : 'Get The Insider'}
                </button>
            </form>
            {status === 'error' && (
                <p className="font-sans text-sm text-error mt-2">Something went wrong. Try again.</p>
            )}
            <p className="mt-2.5 text-[13px] font-sans text-text">
                No spam, unsubscribe anytime.
            </p>
        </div>
    );
}
