import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import Seo from '../components/Seo';

export default function NotFound() {
    const containerRef = useRef(null);
    const strikeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.nf-number', { opacity: 1, y: 0 });
                gsap.set('.nf-broke', { opacity: 1, y: 0 });
                gsap.set(strikeRef.current, { scaleX: 1 });
                gsap.set('.nf-broke-text', { color: '#D2D2D7' });
                gsap.set('.nf-kidding', { opacity: 1, y: 0 });
                gsap.set('.nf-desc', { opacity: 1, y: 0 });
                gsap.set('.nf-links', { opacity: 1, y: 0 });
                return;
            }

            const tl = gsap.timeline({ delay: 0.3 });

            tl.fromTo('.nf-number',
                { y: -40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
            );

            tl.fromTo('.nf-broke',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                '+=0.2'
            );

            tl.fromTo(strikeRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.5, ease: 'power2.inOut' },
                '+=0.8'
            );

            tl.to('.nf-broke-text', { color: '#D2D2D7', duration: 0.3 }, '<+=0.2');

            tl.fromTo('.nf-kidding',
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                '+=0.1'
            );

            tl.fromTo('.nf-desc',
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                '+=0.3'
            );

            tl.fromTo('.nf-links',
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                '-=0.2'
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-surface flex items-center justify-center px-6">
            <Seo title="Page Not Found | RSL/A" description="This page does not exist." noIndex />

            <section className="w-full max-w-lg mx-auto">
                {/* 404 */}
                <p className="nf-number opacity-0 font-sans font-bold text-[8rem] md:text-[10rem] leading-none tracking-tighter text-frost select-none">
                    404
                </p>

                {/* You broke something (with strikethrough) */}
                <div className="mt-2 mb-2 relative inline-block">
                    <h1 className="nf-broke opacity-0 font-sans font-bold text-3xl md:text-5xl tracking-tight">
                        <span className="nf-broke-text text-text">You broke something.</span>
                    </h1>
                    <div
                        ref={strikeRef}
                        className="absolute top-1/2 left-0 w-full h-[2px] bg-accent/60 origin-left"
                        style={{ transform: 'scaleX(0)' }}
                    />
                </div>

                {/* Just kidding */}
                <h2 className="nf-kidding opacity-0 font-sans font-bold text-2xl md:text-4xl tracking-tight text-text mt-1">
                    Just kidding. This page doesn't exist.
                </h2>

                {/* Description */}
                <p className="nf-desc opacity-0 font-sans text-lg text-text leading-relaxed mt-6 mb-10">
                    Whatever you were looking for isn't here. But here's where the good stuff actually lives.
                </p>

                {/* Links */}
                <div className="nf-links opacity-0">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-2.5 rounded-button font-sans font-medium text-sm text-text border border-hairline hover:border-accent/30 hover:bg-accent-light transition-colors"
                    >
                        Back to home
                    </Link>
                </div>
            </section>
        </main>
    );
}
