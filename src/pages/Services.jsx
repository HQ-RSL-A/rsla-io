import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';
import Seo from '../components/Seo';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { features } from '../components/ServicesV2';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.set('.services-hero-content', { opacity: 1, y: 0 });
                gsap.set('.services-bento > *', { opacity: 1, y: 0 });
                return;
            }

            gsap.fromTo('.services-hero-content',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
            );

            gsap.fromTo('.services-bento > *',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.services-bento',
                        start: 'top 80%',
                        once: true,
                    },
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

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
                <div className="services-hero-content opacity-0 max-w-4xl mx-auto text-center">
                    <h1 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tight mb-6 leading-[1.1]">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            What we build for small service businesses.
                        </TextAnimate>
                    </h1>
                    <p className="font-sans text-lg text-text leading-relaxed max-w-2xl mx-auto">
                        Automation first, because that is where the hours go. Then getting found, a website that says what you do, a CRM that catches every lead, and the tools nobody sells. Fixed price, real numbers, one call to start.
                    </p>
                </div>
            </section>

            {/* Bento grid */}
            <section className="bg-frost pb-20 md:pb-28 pt-6 md:pt-10 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <BentoGrid className="services-bento">
                        {features.map((feature) => (
                            <BentoCard key={feature.name} {...feature} />
                        ))}
                    </BentoGrid>
                </div>
            </section>

            <section className="bg-surface py-12 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-sans font-bold text-lg text-text mb-4">Based in Bakersfield, CA</h2>
                    <Link to="/bakersfield" className="font-sans text-accent hover:underline">
                        Websites, SEO, automation, and CRM for Kern County businesses
                    </Link>
                </div>
            </section>

            <section className="bg-surface py-16 md:py-24 px-6 md:px-12 border-t border-hairline">
                <div className="max-w-2xl mx-auto">
                    <h2 className="font-sans font-bold text-2xl md:text-3xl tracking-tight text-text mb-4">
                        Not sure where to start?
                    </h2>
                    <p className="font-sans text-lg text-text leading-relaxed mb-8">
                        Book a free 30-minute call and we will map out exactly what your business needs.
                    </p>
                    <Link
                        to="/contact"
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
