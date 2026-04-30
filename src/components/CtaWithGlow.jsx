/**
 * CTA Section — Dark background with FlickeringGrid and InteractiveHoverButton.
 * Creates visual contrast before the dark footer.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function CtaWithGlow({
    title = 'Book a free 30-minute growth mapping call.',
    subtitle = "We'll audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle.",
    buttonText = "Let's Talk",
    buttonTo = '/contact',
    className,
}) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.cta-glow-content > *', { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo(
                '.cta-glow-content > *',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        once: true,
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={cn(
                'relative overflow-hidden py-24 sm:py-32 bg-[#121212]',
                'border-b border-white/10',
                'before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-24 before:bg-gradient-to-b before:from-transparent before:to-black/40 before:z-[2]',
                className
            )}
        >
            {/* FlickeringGrid background */}
            <FlickeringGrid
                className="absolute inset-0 z-0"
                squareSize={4}
                gridGap={6}
                color="#0070F3"
                maxOpacity={0.15}
                flickerChance={0.08}
            />

            {/* Subtle radial glow behind content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
                <div className="w-[600px] h-[400px] rounded-full bg-accent/8 blur-[120px]" />
            </div>

            <div className="cta-glow-content [&>*]:opacity-0 relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center px-6 sm:gap-8">
                <h2 className="font-sans font-extrabold text-2xl md:text-4xl tracking-tight text-white">
                    {title}
                </h2>
                <p className="font-sans text-lg text-white/60 max-w-xl">
                    {subtitle}
                </p>
                <Link to={buttonTo}>
                    <InteractiveHoverButton className="text-base px-8 py-3">
                        {buttonText}
                    </InteractiveHoverButton>
                </Link>
            </div>
        </section>
    );
}
