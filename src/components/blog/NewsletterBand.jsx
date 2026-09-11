import { useState } from 'react';
import { BLOG_CONTAINER } from './blogShared';
import { SectionHead } from './ArticlesGrid';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID || '9130465';

/*
 * The dark band between "Latest" and the category sections on /blog, where
 * Clay runs its "Design Guides" strip. Ours signs people up for The Insider.
 */
export default function NewsletterBand() {
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
                window.dataLayer?.push({ event: 'newsletter_subscribe', source: 'blog_band' });
            } else { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
        } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 4000); }
    };

    return (
        <section className="bg-blog-dark py-20 md:pt-[120px] md:pb-[100px]">
            <div className={BLOG_CONTAINER}>
                <SectionHead
                    title="The Insider"
                    blurb="Every Tuesday, one thing you can use that day to make your business more money."
                    tone="dark"
                />
                {status === 'success' ? (
                    <p className="mt-10 text-[18px] md:text-[22px] leading-[1.35] text-white">Talk Tuesday. Check your inbox for a confirmation.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-3 max-w-[640px]">
                        <label htmlFor="insider-email" className="sr-only">Email address</label>
                        <input
                            id="insider-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'submitting'}
                            placeholder="you@company.com"
                            className="flex-1 h-12 bg-transparent border-0 border-b border-white/40 px-0 text-[18px] text-white placeholder:text-white/50 outline-none focus:border-white transition-[border-color] duration-sm ease-out-smooth rounded-none"
                        />
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="h-12 shrink-0 rounded-full bg-white px-7 text-[16px] font-medium text-blog-ink transition-[background-color,transform] duration-md ease-out-smooth hover:bg-white/90 active:scale-[0.97] disabled:opacity-60 cursor-pointer"
                        >
                            {status === 'submitting' ? 'Sending' : 'Get The Insider'}
                        </button>
                    </form>
                )}
                {status === 'error' && <p className="mt-3 text-[14px] text-white/80">Something went wrong. Try again.</p>}
                {status !== 'success' && <p className="mt-4 text-[14px] leading-[1.4] text-white/60">No spam, unsubscribe anytime.</p>}
            </div>
        </section>
    );
}
