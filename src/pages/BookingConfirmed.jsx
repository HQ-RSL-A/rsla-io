import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import confetti from 'canvas-confetti';
import { FlickeringGrid } from '../components/ui/flickering-grid';
import { TextAnimate } from '@/components/ui/text-animate';

export default function BookingConfirmed() {
    useEffect(() => {
        window.dataLayer?.push({ event: 'booking_confirmed' });

        const colors = ['#0070F3', '#00C2FF', '#34d399', '#818CF8', '#F59E0B'];
        const timers = [];

        const timer = setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 360,
                origin: { x: 0.5, y: 0.5 },
                colors,
                startVelocity: 45,
                gravity: 0.8,
                scalar: 1.2,
                ticks: 200,
            });

            timers.push(setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 180,
                    origin: { x: 0.5, y: 0.2 },
                    colors,
                    startVelocity: 35,
                    gravity: 1,
                    scalar: 1.1,
                    ticks: 180,
                });
            }, 300));

            timers.push(setTimeout(() => {
                confetti({
                    particleCount: 60,
                    angle: 60,
                    spread: 80,
                    origin: { x: 0, y: 0.5 },
                    colors,
                    startVelocity: 40,
                    scalar: 1.1,
                });
                confetti({
                    particleCount: 60,
                    angle: 120,
                    spread: 80,
                    origin: { x: 1, y: 0.5 },
                    colors,
                    startVelocity: 40,
                    scalar: 1.1,
                });
            }, 600));
        }, 400);

        timers.push(timer);

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <main className="min-h-screen bg-surface relative overflow-hidden flex items-center justify-center px-6">
            <Seo
                title="Booking Confirmed | RSL/A"
                description="Your call has been booked. Check your inbox for meeting details."
                noIndex
            />

            {/* Flickering grid background */}
            <FlickeringGrid
                className="absolute inset-0 z-0"
                squareSize={4}
                gridGap={6}
                color="rgb(0, 112, 243)"
                maxOpacity={0.08}
                flickerChance={0.15}
            />

            <div className="relative z-10 text-center max-w-xl">
                {/* Animated checkmark with pulse ring */}
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="relative w-20 h-20 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center shadow-lg shadow-emerald-400/20">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight mb-4 text-text">
                    <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                        You're all set.
                    </TextAnimate>
                </h1>

                <p className="font-sans text-lg text-textMuted mb-3">
                    Your call has been booked.
                </p>

                <p className="font-sans text-sm text-textMuted mb-10">
                    Check your inbox for a calendar invite with the meeting details.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent text-white px-8 py-3 font-sans font-bold text-base hover:bg-accent/90 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
