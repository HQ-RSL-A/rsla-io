import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID;

/*
 * The Insider signup page. Brand-system treatment (the Caveat "A Weekly Note"
 * identity, polaroid, and tape are retired): Satoshi only, Paper ground,
 * one Anchor Blue key-phrase highlight in the display line.
 */
export default function Insider() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


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
                title="The Insider: one thing every Tuesday | RSL/A"
                description="One thing a week, short enough to set up the same day: an automation, a Google Business Profile fix, a follow up sequence, a tool worth paying for."
                canonical="https://rsla.io/insider"
                noIndex
            />

            {/* Headline — hero, one Anchor Blue key-phrase highlight */}
            <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-brand-tighter text-text text-center max-w-2xl mb-4 leading-[1.1]">
                Every Tuesday, I send <span className="text-accent">one thing</span> you can use that day to make your business more money.
            </h1>

            {/* Descriptor */}
            <p className="font-sans text-base md:text-lg text-text text-center max-w-lg mb-10 md:mb-12 leading-relaxed">
                One thing a week, short enough to set up the same day: an automation, a Google Business Profile fix, a follow up sequence, a tool worth paying for.
            </p>

            {/* Card */}
            <div className="w-full max-w-[400px] bg-surface border border-hairline rounded-callout px-6 py-5 relative flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                {/* Photo + masthead row */}
                <div className="flex items-center gap-3.5 mb-4">
                    <img
                        src="/images/rahul.webp"
                        alt="Rahul Lalia"
                        className="w-[70px] h-[70px] object-cover rounded-callout shrink-0"
                        width="70"
                        height="70"
                    />
                    <div className="font-sans font-bold text-[24px] text-text leading-tight tracking-brand-tight">
                        The Insider
                    </div>
                </div>

                {/* Body */}
                <p className="font-sans text-[15px] leading-relaxed text-text mb-5" style={{ textWrap: 'pretty' }}>
                    One thing a week you can set up in your <span className="font-bold">business</span> the same day.
                </p>

                {submitted ? (
                    <div className="p-3 rounded-button bg-frost border border-hairline">
                        <span className="font-sans font-bold text-base text-text">
                            Talk Tuesday.
                        </span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="h-[44px] px-4 rounded-button border border-hairline bg-surface text-base font-sans text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-[border-color,box-shadow] duration-150 ease-out"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-[44px] rounded-button bg-accent text-white text-base font-medium font-sans cursor-pointer hover:bg-accentDeep active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Subscribing...' : 'Get The Insider'}
                        </button>
                    </form>
                )}

                {error && (
                    <p className="text-sm font-sans text-error mt-1.5">{error}</p>
                )}
            </div>

            {/* Footnote */}
            <p className="mt-5 text-sm font-sans text-text text-center">
                No spam, unsubscribe anytime.{' '}
                <Link to="/privacy-policy" className="text-accent underline underline-offset-2 hover:text-accentDeep transition-colors">
                    Privacy policy
                </Link>
            </p>
        </main>
    );
}
