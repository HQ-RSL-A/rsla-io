/**
 * HeroV2 — Aurora Background + static headline + InteractiveHoverButton CTAs.
 * Entire hero content (headline + CTAs) fades in as one unit. No per-word stagger.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import AuroraBackground from './AuroraBackground';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function HeroV2() {
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set(contentRef.current, { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo(
                contentRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
            );
        }, contentRef);
        return () => ctx.revert();
    }, []);

    return (
        <AuroraBackground>
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start justify-end h-[100dvh] pt-24 pb-24 lg:pb-28">
                <div ref={contentRef} className="opacity-0">
                    {/* Headline */}
                    <h1 className="font-sans font-bold text-text text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] max-w-5xl mb-6">
                        Only you know what your time is worth. We put AI to work to{' '}
                        <span className="font-sans font-bold text-accent">get it back.</span>
                    </h1>
                    <p className="font-sans font-bold text-text text-lg md:text-[21px] leading-[1.45] max-w-2xl mb-10">
                        Automation, CRM, search, and websites for{' '}
                        <span className="text-accent">small service businesses</span>. Fixed price, and the numbers on a dashboard.
                    </p>

                    {/* CTAs: the goal is the call, and "Book a call" is the label the whole site uses */}
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <Link to="/contact" onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'hero' })}>
                            <InteractiveHoverButton className="font-sans text-base px-8 py-3">
                                Book a call
                            </InteractiveHoverButton>
                        </Link>
                        <Link
                            to="/work"
                            className="inline-flex items-center px-8 py-3 rounded-button font-sans font-medium text-base text-text border border-hairline hover:border-accent/30 hover:bg-accent-light transition-colors"
                        >
                            See the work
                        </Link>
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
}
