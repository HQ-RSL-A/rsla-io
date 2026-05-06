import { useState } from 'react';

const KIT_FORM_ID = import.meta.env.VITE_KIT_FORM_ID || '9130465';

const m = {
    cardBg: 'linear-gradient(160deg, #FFFFFF 0%, #F5F8FF 55%, #EFF4FF 100%)',
    border: '#E2E8F0', accent: '#0070F3', accentDark: '#005BC2',
    ink: '#0F172A', sub: '#475569', muted: '#94A3B8',
    flap: '#DBE9FF', glow: 'rgba(0,112,243,0.12)',
};

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
        <div style={{
            background: m.cardBg,
            border: `1px solid ${m.border}`,
            borderRadius: 12,
            padding: '26px 26px 20px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
        }}>
            {/* Glow */}
            <div style={{
                position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: 999,
                background: `radial-gradient(circle, ${m.glow}, transparent 70%)`, pointerEvents: 'none',
            }} />

            {/* Heading */}
            <div className="font-caveat" style={{
                position: 'relative',
                fontSize: 32,
                lineHeight: 1.05,
                color: m.ink,
                letterSpacing: '-0.01em',
                marginBottom: 12,
                textWrap: 'balance',
            }}>
                Every Tuesday,{' '}
                <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>
                    one thing
                    <svg width="100%" height="6" viewBox="0 0 90 6" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: -2, width: '100%' }}>
                        <path d="M2 4 Q 22 1, 45 3 T 88 3" stroke={m.accent} strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </svg>
                </span>{' '}
                you can use that day to make your business more money.
            </div>

            {/* Subheading */}
            <div className="font-sans" style={{
                position: 'relative',
                fontSize: 13.5,
                lineHeight: 1.5,
                color: m.sub,
                marginBottom: 10,
            }}>
                The Insider delivers one tested growth system every week you can apply to your business and see results.
            </div>

            {/* Envelope */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '4px 0 6px' }}>
                <div style={{
                    position: 'absolute', width: 300, height: 110, borderRadius: 999,
                    background: `radial-gradient(ellipse, ${m.glow}, transparent 70%)`,
                    filter: 'blur(14px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                }} />
                <div style={{ position: 'relative', transform: 'rotate(-3deg)', filter: `drop-shadow(0 10px 18px ${m.glow})` }}>
                    <svg width="200" height="144" viewBox="0 0 100 78" fill="none">
                        <rect x="2" y="12" width="96" height="64" rx="4" fill="white" stroke={m.accent} strokeWidth="1.5" />
                        <path d="M2 16 L50 50 L98 16" fill={m.flap} stroke={m.accent} strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -10%)',
                        width: 36, height: 36, borderRadius: 99,
                        background: `radial-gradient(circle at 35% 35%, ${m.accent}, ${m.accentDark} 70%)`,
                        boxShadow: `0 3px 8px ${m.glow}, inset 0 -2px 4px rgba(0,0,0,.2)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 16, fontWeight: 700,
                    }}><span className="font-caveat">RL</span></div>
                </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Signature */}
            <div className="font-caveat" style={{
                position: 'relative',
                fontSize: 22,
                color: m.accent,
                lineHeight: 1,
                marginBottom: 12,
            }}>
                - Rahul
            </div>

            {status === 'success' ? (
                <div className="font-caveat text-accent text-center" style={{
                    position: 'relative', padding: 12, borderRadius: 12,
                    background: 'rgba(0,112,243,0.05)', border: `1px solid rgba(0,112,243,0.08)`,
                    fontSize: 16, fontWeight: 500,
                }}>
                    &#10003; Talk Tuesday.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        disabled={status === 'submitting'}
                        required
                        className="h-[44px] px-4 rounded-xl border border-slate-200 bg-background text-sm font-sans outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-[border-color,box-shadow]"
                    />
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="h-[44px] rounded-xl bg-accent text-white text-sm font-semibold font-sans cursor-pointer hover:bg-accent/90 transition-colors disabled:opacity-50"
                    >
                        {status === 'submitting' ? '...' : 'Get The Insider'}
                    </button>
                </form>
            )}

            {status === 'error' && (
                <p className="font-sans text-xs text-coral text-center mt-1.5">Something went wrong. Try again.</p>
            )}

            <p className="font-sans relative mt-2.5 text-[11px] text-center" style={{ color: m.muted, lineHeight: 1 }}>
                No spam, unsubscribe anytime.
            </p>
        </div>
    );
}
