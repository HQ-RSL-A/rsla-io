import { useState } from 'react';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID || '9130465';

/*
 * Newsletter card in the blog grid. Brand-system treatment: Frost surface,
 * Hairline border, Satoshi only (the Caveat "A Weekly Note" identity is
 * retired), flat color, one Anchor Blue key-phrase highlight in the headline.
 */
export default function NewsletterGridCard() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || status === 'submitting') return;
        setStatus('submitting');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, formId: KIT_FORM_ID }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
                window.dataLayer?.push({ event: 'newsletter_subscribe', source: 'blog_grid' });
            } else { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
        } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
    };

    return (
        <div className="flex h-full flex-col rounded-callout border border-hairline bg-frost p-6 md:p-7">
            {/* Masthead */}
            <p className="font-sans font-bold text-sm text-text mb-3">The Insider</p>

            {/* Headline — one Anchor Blue key-phrase highlight */}
            <h3 className="font-sans font-bold text-[22px] leading-[1.25] tracking-brand-tight text-text mb-3" style={{ textWrap: 'balance' }}>
                Every Tuesday, <span className="text-accent">one thing</span> you can use that day to make your business more money.
            </h3>

            {/* Subheading */}
            <p className="font-sans text-[15px] leading-relaxed text-text mb-4">
                The Insider delivers one tested growth system every week you can apply to your business and see results.
            </p>

            <div className="flex-1" />

            {status === 'success' ? (
                <div className="rounded-button border border-hairline bg-surface p-3">
                    <p className="font-sans font-bold text-base text-text">Talk Tuesday.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        disabled={status === 'submitting'}
                        required
                        className="h-[44px] px-4 rounded-button border border-hairline bg-surface text-base font-sans text-text outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-[border-color,box-shadow]"
                    />
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="h-[44px] rounded-button bg-accent text-white text-base font-medium font-sans cursor-pointer hover:bg-accentDeep active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out disabled:opacity-50"
                    >
                        {status === 'submitting' ? '...' : 'Get The Insider'}
                    </button>
                </form>
            )}

            {status === 'error' && (
                <p className="font-sans text-[13px] text-error mt-1.5">Something went wrong. Try again.</p>
            )}

            <p className="font-sans mt-2.5 text-[13px] text-text">
                No spam, unsubscribe anytime.
            </p>
        </div>
    );
}
