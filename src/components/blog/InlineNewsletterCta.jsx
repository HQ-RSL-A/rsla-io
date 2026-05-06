import { useState } from 'react';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID || '9130465';

export default function InlineNewsletterCta() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [focused, setFocused] = useState(false);

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
            <div className="my-16 p-8 rounded-xl bg-white border border-gray-200/60 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.08)]">
                <p className="font-caveat text-2xl text-accent mb-1">&#10003; talk Tuesday!</p>
                <p className="font-sans text-sm text-textMuted">Check your inbox for a confirmation.</p>
            </div>
        );
    }

    return (
        <div className="my-16 p-6 md:p-8 rounded-xl bg-white border border-gray-200/60 shadow-[0_4px_12px_rgba(0,0,0,0.06),0_20px_40px_rgba(0,0,0,0.08)]">
            {/* Branding */}
            <div className="font-caveat text-[26px] text-slate-900 leading-none mb-1">A Weekly Note</div>
            <div className="text-[10px] text-slate-400 tracking-[0.06em] uppercase font-semibold mb-5">The Insider</div>

            {/* Copy */}
            <p className="font-sans text-[15px] text-slate-800 leading-relaxed mb-4">
                Liked this? Every Tuesday I send one{' '}
                <span className="relative inline-block">
                    growth system
                    <svg className="absolute -bottom-0.5 left-0 w-full" height="6" viewBox="0 0 120 6" fill="none" preserveAspectRatio="none">
                        <path d="M2 4c15-3 30 1 50-1s35 2 55-1" stroke="#0070F3" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                </span>{' '}
                you can apply to your business that day and see results.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={status === 'submitting'}
                    required
                    className="flex-1 h-[42px] px-3.5 rounded-xl border bg-background text-sm font-sans outline-none transition-colors"
                    style={{ borderColor: focused ? '#0070F3' : '#CBD5E1' }}
                />
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="h-[42px] px-5 rounded-xl bg-accent text-white font-sans font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                    {status === 'submitting' ? '...' : 'Get The Insider'}
                </button>
            </form>
            {status === 'error' && (
                <p className="font-sans text-sm text-coral mt-2">Something went wrong. Try again.</p>
            )}
            <p className="mt-2.5 text-xs text-textMuted">
                No spam, unsubscribe anytime.
            </p>
        </div>
    );
}
