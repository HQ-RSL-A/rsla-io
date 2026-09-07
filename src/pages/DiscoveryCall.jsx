import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import Seo from '../components/Seo';
import InquiryForm from '@/components/InquiryForm';
import { PHONE_DISPLAY, PHONE_TEL } from '@/data/serviceConstants.mjs';

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
                title="Book a free 30 minute call | RSL/A"
                description="Book a free 30 minute call with RSL/A. Tell us what is not working and we will tell you what we would build first and what it would cost. No pitch."
                canonical="https://rsla.io/contact"
                keywords="free consultation, marketing agency call, Bakersfield, automation, CRM, SEO, websites"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    '@id': 'https://rsla.io/contact',
                    name: 'Contact RSL/A',
                    url: 'https://rsla.io/contact',
                    description: 'Book a free 30 minute call with RSL/A.',
                    isPartOf: { '@id': 'https://rsla.io/#website' },
                    about: { '@id': 'https://rsla.io/#business' },
                }}
            />
            <div className="max-w-4xl mx-auto">
                <div className="contact-reveal opacity-0 text-center mb-10">
                    <h1 className="font-sans font-bold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-4">
                        Book a free 30 minute call.
                    </h1>
                    <p className="font-sans text-lg text-text leading-relaxed max-w-2xl mb-8">
                        Tell us what is not working. We will tell you what we would build first, what it would cost, and whether it is worth it.
                    </p>
                </div>

                <div className="contact-reveal opacity-0 bg-surfaceAlt border border-hairline rounded-2xl p-3 md:p-6">
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

                <section className="mt-16 md:mt-20 max-w-2xl mx-auto" aria-labelledby="inquiry-heading">
                    <h2 id="inquiry-heading" className="font-sans font-bold text-2xl md:text-3xl tracking-tight text-text mb-3">Prefer to write?</h2>
                    <p className="font-sans text-lg text-text leading-relaxed mb-8">
                        Tell us what you need and we reply within one business day. In a hurry? Call <a href={PHONE_TEL} className="text-accent hover:underline underline-offset-4">{PHONE_DISPLAY}</a>.
                    </p>
                    <InquiryForm page="/contact" />
                </section>

                <div className="contact-reveal opacity-0 mt-8 text-center">
                    <p className="font-sans text-sm text-text">
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
