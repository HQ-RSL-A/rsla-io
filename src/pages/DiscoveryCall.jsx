import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import Seo from '../components/Seo';

export default function DiscoveryCall() {
    const pageRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://link.msgsndr.com/js/form_embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.contact-reveal', { opacity: 1, y: 0 });
                return;
            }
            gsap.fromTo('.contact-reveal',
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
            );
        }, pageRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={pageRef} className="min-h-screen bg-surface pt-36 pb-20 px-6 md:px-12">
            <Seo
                title="Book a Free AI Growth Mapping Call | RSL/A"
                description="Book a free 30-minute growth mapping call. We'll audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle. No pitch, just answers."
                canonical="https://rsla.io/contact"
                keywords="free consultation, AI growth call, marketing audit, business growth mapping"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: 'Book a Growth Mapping Call',
                    url: 'https://rsla.io/contact',
                    description: 'Book a free 30-minute growth mapping call with RSL/A.',
                    mainEntity: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        url: 'https://rsla.io',
                        contactPoint: {
                            '@type': 'ContactPoint',
                            contactType: 'sales',
                            url: 'https://rsla.io/contact',
                            availableLanguage: 'English',
                        },
                    },
                }}
            />
            <div className="max-w-4xl mx-auto">
                <div className="contact-reveal opacity-0 text-center mb-10">
                    <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-4">
                        Book a free growth mapping call.
                    </h1>
                    <p className="font-sans text-lg text-textMuted leading-relaxed max-w-xl mx-auto">
                        30 minutes. We audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle. No pitch, just answers.
                    </p>
                </div>

                <div className="contact-reveal opacity-0 bg-surfaceAlt border border-accent-border rounded-2xl p-3 md:p-6">
                    <iframe
                        src="https://api.leadconnectorhq.com/widget/booking/nKrQmOaliDo1haSUwgRS"
                        style={{ width: '100%', border: 'none', overflow: 'hidden' }}
                        scrolling="no"
                        id="TVqOue0iVFx2OyOlu3bS_1776349784731"
                        title="Discovery Call Calendar"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        referrerPolicy="no-referrer"
                        className="rounded-xl h-[650px] md:h-[800px]"
                    />
                </div>

                <div className="contact-reveal opacity-0 mt-8 text-center">
                    <p className="font-sans text-sm text-textMuted">
                        Not ready for a call?{' '}
                        <Link to="/work" className="text-accent hover:underline inline-flex items-center gap-1">
                            See our case studies
                            <ArrowRight size={12} strokeWidth={2} />
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
