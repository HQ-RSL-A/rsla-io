/**
 * Testimonials — adapted from Tailus (via 21st.dev)
 * Masonry grid with lifted white cards. Featured card spans 2 cols/rows.
 * GSAP ScrollTrigger stagger entrance.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        name: 'Sid S.',
        role: 'Account Executive, SBC',
        body: "I recently hired Rahul to revamp our company website, and I couldn't be more thrilled with the results! Their expertise and dedication transformed my site by restructuring it, fixing critical errors, and significantly boosting its performance. Thanks to their outstanding work on on-page SEO and ongoing SEO efforts, my website has seen a remarkable increase in organic traffic and a substantial improvement in qualified inbound lead generation.",
        featured: true,
    },
    {
        name: 'Curtis H.',
        role: 'CEO/Founder, AdReviveAI',
        body: 'Working with Rahul on my GoHighLevel setup was an excellent experience. He was extremely knowledgeable, responsive, and efficient from start to finish. Rahul quickly understood what I needed and structured my GHL account properly. Pipelines, automations, workflows, integrations, and overall system flow.',
    },
    {
        name: 'Chris K.',
        role: 'CEO/Co-Founder, Fieldshare',
        body: 'Rahul redesigned our website, handled SEO optimization, and set up blogging automation. Site looks great, ranks better, and the automation saves us tons of time. Great communication and delivered on schedule. Highly recommend.',
    },
    {
        name: 'Laiz C.',
        role: 'CEO, Casagrande Salon',
        body: "I tried for months to rent my salon space and nothing worked. After Rahul and RSL/A, in just a few months both my rooms were filled. Now I don't stress about rent anymore.",
    },
    {
        name: 'Parminder S.',
        role: 'CEO/Founder, Chauffeur on Demand',
        body: 'Rahul does a stellar job on setting up GHL accounts. He is an expert and gave me immense knowledge about the platform. Would love to work with him again. Highly recommend anyone who wants an expert on Go High Level.',
    },
];

function Avatar({ name }) {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('');
    return (
        <div className="w-12 h-12 rounded-full bg-accent-medium flex items-center justify-center text-accent font-sans font-bold text-sm shrink-0">
            {initials}
        </div>
    );
}

function TestimonialCard({ name, role, body, featured = false, isHiddenOnMobile = false }) {
    return (
        <div
            className={`testimonial-card opacity-0 bg-surface rounded-2xl p-6 sm:p-8 border border-accent-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-lg transition-shadow ${featured ? 'lg:row-span-2' : ''
                } ${isHiddenOnMobile ? 'hidden sm:block' : ''}`}
        >
            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className={`font-sans leading-relaxed text-text ${featured ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
                    &ldquo;{body}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                    <Avatar name={name} />
                    <div>
                        <cite className="font-sans font-medium text-sm text-text not-italic">{name}</cite>
                        <span className="block font-sans text-sm text-textMuted">{role}</span>
                    </div>
                </div>
            </blockquote>
        </div>
    );
}

export default function Testimonials() {
    const sectionRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.testimonial-card', { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo(
                '.testimonial-card',
                { y: 40, opacity: 0 },
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

    // Recalculate ScrollTrigger positions when expanded state changes to prevent overlapping sections
    useEffect(() => {
        ScrollTrigger.refresh();
    }, [isExpanded]);

    return (
        <section ref={sectionRef} className="py-20 md:py-32 bg-surfaceAlt px-6 md:px-12">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="font-sans font-extrabold text-2xl md:text-4xl tracking-tight text-text">
                        Don&apos;t take our word for it.
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
                    {testimonials.map((t, index) => (
                        <TestimonialCard
                            key={t.name}
                            {...t}
                            isHiddenOnMobile={!isExpanded && index > 0}
                        />
                    ))}
                </div>

                {!isExpanded && (
                    <div className="flex justify-center sm:hidden mt-8">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="text-sm font-sans font-medium text-accent hover:text-accent-hover transition-colors px-6 py-2 rounded-full border border-accent-border bg-surface shadow-sm"
                        >
                            Read More Testimonials
                        </button>
                    </div>
                )}
                {isExpanded && (
                    <div className="flex justify-center sm:hidden mt-8">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-sm font-sans font-medium text-accent hover:text-accent-hover transition-colors px-6 py-2 rounded-full border border-accent-border bg-surface shadow-sm"
                        >
                            Show Less
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
