import { useState } from 'react';

export default function InlineNewsletterCta() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || status === 'submitting') return;

        setStatus('submitting');
        let succeeded = false;
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, formId: '9130465' }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
                succeeded = true;
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
            <div className="my-16 p-8 md:p-10 rounded-2xl bg-surfaceAlt border border-accent-border text-center">
                <p className="font-sans font-bold text-2xl text-text mb-2">You're in.</p>
                <p className="font-sans text-sm text-textMuted">Check your inbox for a confirmation.</p>
            </div>
        );
    }

    return (
        <div className="my-16 p-8 md:p-10 rounded-2xl bg-surfaceAlt border border-accent-border">
            <div className="max-w-lg mx-auto text-center">
                <p className="font-sans text-accent text-sm uppercase tracking-widest mb-3">The Insider</p>
                <p className="font-sans font-bold text-2xl md:text-3xl text-text mb-2 tracking-tight">
                    Want more like this?
                </p>
                <p className="font-sans text-sm text-textMuted mb-6">
                    AI and marketing insights, weekly. No fluff.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'submitting'}
                        required
                        className="flex-1 px-4 min-h-[44px] rounded-full bg-surface border border-accent-border text-text font-sans text-sm placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-[border-color,box-shadow] duration-sm ease-out-smooth"
                    />
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="px-5 min-h-[44px] rounded-full bg-accent text-white font-sans font-bold text-sm hover:bg-accent/90 active:scale-[0.97] transition-[background-color,transform] duration-sm ease-out-smooth disabled:opacity-50 cursor-pointer"
                    >
                        {status === 'submitting' ? '...' : 'Join'}
                    </button>
                </form>
                {status === 'error' && (
                    <p className="font-sans text-sm text-coral mt-3">Something went wrong. Try again.</p>
                )}
            </div>
        </div>
    );
}
