/**
 * CTA Section — light band per brand rules (dark surfaces live only in the
 * footer). Mist ground, Ink text, FlickeringGrid kept as a subtle accent
 * texture; the old radial glow and dark scrim are retired with gradients.
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
    title = 'Book a free 30 minute call.',
    subtitle = "Tell us what is not working. We will tell you what we would build first, what it would cost, and whether it is worth it.",
    buttonText = "Book a call",
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
                'relative overflow-hidden py-24 sm:py-32 bg-surfaceAlt border-y border-hairline',
                className
            )}
        >
            {/* FlickeringGrid background */}
            <FlickeringGrid
                className="absolute inset-0 z-0"
                squareSize={4}
                gridGap={6}
                color="#0070F3"
                maxOpacity={0.1}
                flickerChance={0.08}
            />

            <div className="cta-glow-content [&>*]:opacity-0 relative z-10 mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 sm:gap-8 md:px-12">
                <h2 className="font-sans font-bold text-2xl md:text-4xl tracking-tight text-text">
                    {title}
                </h2>
                <p className="font-sans text-lg text-text max-w-xl">
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
