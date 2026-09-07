import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '@/components/Seo';
import { ServiceCardGrid } from '@/components/services/ui/ServiceCard';
import { cardFor, NATIONAL } from '@/data/serviceCatalog';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;
            // Transform only, so the page reads correctly before the animation runs.
            gsap.from('.services-cards > *', {
                y: 24,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.services-cards', start: 'top 85%', once: true },
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const cards = [...NATIONAL.map((r) => cardFor(r)), cardFor('/bakersfield')];

    return (
        <div ref={pageRef}>
            <Seo
                title="What we build for small service businesses | RSL/A"
                description="AI automation, CRM systems, search visibility, websites, and custom builds for solopreneurs and small service businesses. Fixed price, real numbers, one call to start."
                canonical="https://rsla.io/services"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@id': 'https://rsla.io/#business',
                    hasOfferCatalog: {
                        '@type': 'OfferCatalog',
                        name: 'Services',
                        itemListElement: [
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI automations', url: 'https://rsla.io/services/automations', description: 'Lead response, follow up, intake, and admin automated around the tools you already use.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CRM systems', url: 'https://rsla.io/services/crm', description: 'GoHighLevel setup with pipelines, automatic follow up, booking, and a phone app.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Search visibility', url: 'https://rsla.io/services/seo', description: 'SEO, local SEO, and the structure that gets a business cited by AI assistants.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Websites', url: 'https://rsla.io/services/websites', description: 'New builds and rebuilds with the search structure built in.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom builds', url: 'https://rsla.io/services/custom-builds', description: 'Internal tools built around how a small business works.' } },
                        ],
                    },
                }}
            />

            {/* Hero */}
            <section className="bg-surface pt-36 pb-12 md:pb-16 px-6 md:px-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="font-sans font-bold text-4xl md:text-6xl text-text tracking-tight mb-6 leading-[1.05] [text-wrap:balance]">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            What we build for small service businesses.
                        </TextAnimate>
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-text leading-relaxed max-w-2xl mx-auto">
                        Automation first, because that is where the hours go. Then getting found, a website that says what you do, a CRM that catches every lead, and the tools nobody sells. Fixed price, real numbers, one call to start.
                    </p>
                </div>
            </section>

            {/* Service cards */}
            <section className="bg-surfaceAlt border-t border-hairline py-14 md:py-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto services-cards">
                    <ServiceCardGrid items={cards} onClick={(to) => window.dataLayer?.push({ event: 'cta_click', cta_location: `services_index_${to}` })} />
                </div>
            </section>

            <section className="bg-surface py-16 md:py-24 px-6 md:px-12 border-t border-hairline">
                <div className="max-w-2xl mx-auto">
                    <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight text-text mb-4 [text-wrap:balance]">
                        Not sure where to start?
                    </h2>
                    <p className="font-sans text-lg text-text leading-relaxed mb-8">
                        Book a free 30 minute call. We will tell you what to build first and what it would cost.
                    </p>
                    <Link
                        to="/contact"
                        onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_location: 'services_index_final' })}
                        className="inline-flex items-center gap-2 rounded-button bg-accent px-8 py-3 font-sans font-medium text-base text-white shadow-sm transition-colors hover:bg-accentDeep"
                    >
                        Book a free call
                        <ArrowRight size={16} strokeWidth={2} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
