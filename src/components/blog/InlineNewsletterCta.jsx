import { useState } from 'react';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID || '9130465';

/*
 * The Insider sign-up at the end of an article. Clay-style box: flat gray,
 * square corners, underline input, dark pill button.
 */
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
            <div className="my-16 bg-blog-card p-6 md:p-8 text-blog-ink">
                <p className="font-bold text-[18px] leading-[1.4] mb-1">Talk Tuesday.</p>
                <p className="text-[15px] leading-[1.5]">Check your inbox for a confirmation.</p>
            </div>
        );
    }

    return (
        <div className="my-16 bg-blog-card p-6 md:p-8 text-blog-ink">
            <h4 className="font-bold text-[22px] leading-[1.3] tracking-[-0.01em] mb-3">The Insider</h4>
            <p className="text-[16px] leading-[1.5] mb-6">
                Liked this? Every Tuesday I send one{' '}
                <span className="font-bold">growth system</span>{' '}
                you can apply to your business that day and see results.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 sm:gap-3">
                <label htmlFor="inline-insider-email" className="sr-only">Email address</label>
                <input
                    id="inline-insider-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'submitting'}
                    required
                    className="flex-1 h-11 bg-transparent border-0 border-b border-blog-ink/30 px-0 text-[16px] text-blog-ink placeholder:text-blog-muted outline-none focus:border-blog-ink transition-[border-color] duration-sm ease-out-smooth rounded-none"
                />
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="h-11 shrink-0 rounded-full bg-blog-ink px-6 text-[15px] font-medium text-white transition-[background-color,transform] duration-md ease-out-smooth hover:bg-blog-dark active:scale-[0.97] disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                    {status === 'submitting' ? 'Sending' : 'Get The Insider'}
                </button>
            </form>
            {status === 'error' && (
                <p className="text-[14px] text-error mt-3">Something went wrong. Try again.</p>
            )}
            <p className="mt-3 text-[13px] leading-[1.4] text-blog-muted">No spam, unsubscribe anytime.</p>
        </div>
    );
}
