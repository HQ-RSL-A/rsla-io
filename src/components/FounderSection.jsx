import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FounderSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.founder-text', { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo('.founder-text',
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 65%',
                        once: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-surface pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 md:gap-16 items-start">
                {/* Photo */}
                <div className="md:sticky md:top-32 w-full md:w-2/5 flex-shrink-0">
                    <div className="w-full aspect-[3/4] rounded-3xl bg-accent-light overflow-hidden transition-transform duration-photo-hover ease-out-smooth md:hover:scale-[1.02]">
                        <img src="/images/rahul.webp" alt="Rahul Lalia" className="w-full h-full object-cover" loading="lazy" width="600" height="800" />
                    </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                    <h2 className="founder-text opacity-0 font-sans font-extrabold text-2xl md:text-4xl text-text tracking-tight mb-6">
                        Hi. I'm Rahul.
                    </h2>
                    <div className="space-y-5 font-sans text-textMuted text-lg leading-relaxed">
                        <p className="founder-text opacity-0">
                            I have spent the better part of five years in the trenches of marketing, automation, and business infrastructure. Started in analytics. Got laid off. Built an agency from nothing. And along the way, I watched founders with real talent suffocate under work that never should have touched their hands.
                        </p>
                        <p className="founder-text opacity-0">
                            That became the only question worth answering: how do you build systems that actually run a business, not just look good in a demo?
                        </p>
                        <p className="founder-text opacity-0">
                            I put everything out there. The strategies, the tools, the exact workflows. You can learn all of it from my content. But knowing how it works and actually building it so it holds under pressure and scales without breaking? That demands precision. That is what RSL/A exists to do.
                        </p>
                    </div>

                    <div className="founder-text opacity-0 mt-10 border-t border-accent-border pt-8">
                        <p className="font-sans font-bold text-xl text-text mb-1">Rahul Lalia</p>
                        <p className="font-sans text-sm uppercase tracking-widest text-textMuted">Founder, RSL/A</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
