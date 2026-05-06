import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID;

export default function Insider() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, formId: KIT_FORM_ID }),
            });

            if (!res.ok) throw new Error('Subscription failed');
            window.dataLayer?.push({ event: 'newsletter_subscribe', source: 'insider' });
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Try again?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-20 md:py-24">
            <Seo
                title="The Insider - Weekly Growth Systems | RSL/A"
                description="The Insider delivers one tested growth system every week you can apply to your business and see results."
                canonical="https://rsla.io/insider"
                noIndex
            />

            {/* Headline */}
            <h1 className="font-caveat text-slate-900 text-3xl md:text-5xl text-center max-w-xl mb-4 leading-[1.15]">
                Every Tuesday, I send one thing you can use that day to make your business more money.
            </h1>

            {/* Descriptor */}
            <p className="font-sans text-base md:text-lg text-slate-800 text-center max-w-lg mb-10 md:mb-12 leading-relaxed">
                The Insider delivers one tested growth system every week you can apply to your business and see results.
            </p>

            {/* Polaroid card */}
            <div className="w-full max-w-[400px] bg-surface border border-accent-border rounded-xl px-6 py-5 relative flex flex-col shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
                {/* Polaroid + masthead row */}
                <div className="flex items-center gap-3.5 mb-4">
                    {/* Polaroid */}
                    <div className="relative p-1.5 bg-white shrink-0 shadow-[0_4px_12px_rgba(15,23,42,0.12),0_1px_2px_rgba(15,23,42,0.08)] -rotate-[4deg]">
                        {/* Tape */}
                        <img
                            src="/images/tape.png"
                            alt=""
                            className="absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-[3deg] w-[48px] pointer-events-none"
                            style={{ filter: 'brightness(1.6) saturate(0.2) sepia(0.25)' }}
                        />
                        <img
                            src="/images/rahul.webp"
                            alt="Rahul Lalia"
                            className="w-[70px] h-[70px] object-cover"
                        />
                    </div>

                    <div className="font-caveat text-[34px] text-slate-900 leading-none tracking-tight">
                        A Weekly Note
                    </div>
                </div>

                {/* Body */}
                <p className="text-[15.5px] leading-relaxed text-slate-800 mb-2.5" style={{ textWrap: 'pretty' }}>
                    One thing you can apply to your{' '}
                    <span className="relative inline-block">
                        business
                        <svg className="absolute -bottom-0.5 left-0 w-full" height="8" viewBox="0 0 120 8" fill="none" preserveAspectRatio="none">
                            <path d="M2 5c15-4 30 2 50-2s35 4 55-1" stroke="#0070F3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </svg>
                    </span>{' '}
                    that day and see results.
                </p>

                {/* Signature */}
                <div className="font-caveat text-2xl text-accent leading-none mt-4 mb-5">
                    - Rahul
                </div>

                {submitted ? (
                    <div className="p-3 rounded-lg bg-accent-light border border-accent-border text-center">
                        <span className="font-caveat text-xl text-accent">
                            &#10003; talk Tuesday!
                        </span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="you@company.com"
                            className="h-[44px] px-4 rounded-xl border bg-background text-sm font-sans outline-none transition-colors"
                            style={{ borderColor: focused ? '#0070F3' : '#CBD5E1' }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-[44px] rounded-xl bg-accent text-white text-sm font-semibold font-sans cursor-pointer hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Subscribing...' : 'Get The Insider'}
                        </button>
                    </form>
                )}

                {error && (
                    <p className="text-sm text-coral text-center mt-1.5">{error}</p>
                )}
            </div>

            {/* Footnote */}
            <p className="mt-5 text-sm text-textMuted text-center">
                No spam, unsubscribe anytime.{' '}
                <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-text transition-colors">
                    Privacy Policy
                </Link>
            </p>
        </main>
    );
}
