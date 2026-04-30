import { useEffect } from 'react';
import Seo from '../components/Seo';
import { ShineBorder } from '../components/ui/shine-border';
import { TextAnimate } from '@/components/ui/text-animate';

export default function BookCall() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://link.msgsndr.com/js/form_embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <main className="min-h-screen bg-surface pt-36 pb-20 px-6 md:px-12">
            <Seo
                title="Book a Call | RSL/A"
                description="Schedule a call with RSL/A. Existing clients can book onboarding, strategy, and support sessions."
                canonical="https://rsla.io/book-a-call"
                noIndex
            />
            <div className="max-w-4xl mx-auto bg-surfaceAlt border border-accent-border rounded-2xl md:rounded-3xl p-6 md:p-16 text-center shadow-sm relative overflow-hidden">
                <ShineBorder shineColor={['#0070F3', '#00C2FF']} borderWidth={1} duration={12} />

                <h1 className="text-3xl md:text-5xl font-sans font-bold mb-4 tracking-tight text-text leading-[1.1]">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        Book your session.
                    </TextAnimate>
                </h1>
                <p className="font-sans text-textMuted mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                    Pick a time that works for you. Whether it's onboarding, a strategy check-in, or a support call, we'll make sure you're covered.
                </p>

                <div className="rounded-2xl">
                    <iframe
                        src="https://api.leadconnectorhq.com/widget/booking/GHDT7fcZ1a6Yj4t3FCx7"
                        style={{ width: '100%', border: 'none', overflow: 'hidden' }}
                        scrolling="no"
                        id="client-booking-calendar"
                        title="Client Booking Calendar"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        referrerPolicy="no-referrer"
                        className="rounded-xl h-[750px] md:h-[1100px]"
                    />
                </div>
            </div>
        </main>
    );
}
