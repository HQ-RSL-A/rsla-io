import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '@/components/Seo';
import RelatedCaseStudies from '@/components/services/RelatedCaseStudies';
import ServiceFaq, { generateFaqSchema } from '@/components/services/ServiceFaq';

export default function ServiceLayout({ service, children, ctaOverride }) {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.service-hero-content', { opacity: 1, y: 0 });
                return;
            }

            gsap.fromTo(
                '.service-hero-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.metaDescription,
        provider: {
            '@type': 'Organization',
            name: 'RSL/A',
            url: 'https://rsla.io',
        },
        url: service.canonical,
        areaServed: {
            '@type': 'Country',
            name: 'US',
        },
    };

    const faqSchema = generateFaqSchema(service.faqs);
    const jsonLd = faqSchema ? [serviceSchema, faqSchema] : serviceSchema;

    return (
        <main ref={pageRef} className="min-h-screen">
            <Seo
                title={service.metaTitle}
                description={service.metaDescription}
                keywords={service.keywords}
                canonical={service.canonical}
                jsonLd={jsonLd}
            />

            <section className="bg-surface pt-36 pb-12 px-6 md:px-12">
                <div className="service-hero-content opacity-0 max-w-4xl mx-auto">
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 font-sans text-sm text-textMuted hover:text-accent transition-colors mb-10"
                    >
                        All Services
                    </Link>
                    <h1 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.1] text-text mb-6">
                        <TextAnimate animation="blurInUp" by="word" delay={0.06} startOnView={false} as="span">
                            {service.headline}
                        </TextAnimate>
                    </h1>
                    <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl">
                        {service.description}
                    </p>
                </div>
            </section>

            {children}

            <RelatedCaseStudies caseStudies={service.caseStudies} />

            <ServiceFaq faqs={service.faqs} serviceName={service.title} />

            {ctaOverride || (
                <section className="bg-accent-light border-t border-accent-border py-20 md:py-28 px-6 md:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-sans font-extrabold text-text text-2xl md:text-4xl tracking-tight leading-[1.1] mb-4">
                            Ready to get started?
                        </h2>
                        <p className="font-sans text-lg text-textMuted leading-relaxed mb-8">
                            Book a free strategy call. No pitch, no pressure. We will look at your situation and tell you exactly what we would do.
                        </p>
                        <Link
                            to="/contact"
                            onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'service_detail_bottom' })}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
                        >
                            Book a call
                        </Link>
                    </div>
                </section>
            )}
        </main>
    );
}
