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
                title="AI Marketing & Automation Services for B2B | RSL/A"
                description="Custom websites, SEO, AI automations, CRM systems, and software development. End-to-end AI systems that generate leads, close deals, and scale operations."
                keywords="AI services, custom websites, AI automation, CRM systems, search visibility, custom development, AI lead generation, B2B AI systems"
                canonical="https://rsla.io/services"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ProfessionalService',
                    name: 'RSL/A',
                    url: 'https://rsla.io/services',
                    description: 'End-to-end AI systems that generate leads, close deals, and scale operations. Built and managed by a team that has done it across SMBs and enterprise.',
                    provider: {
                        '@type': 'Organization',
                        name: 'RSL/A',
                        url: 'https://rsla.io',
                    },
                    hasOfferCatalog: {
                        '@type': 'OfferCatalog',
                        name: 'AI Services',
                        itemListElement: [
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Websites', description: 'New builds and full rebuilds. Fast, custom-designed, SEO-ready.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Search Visibility', description: 'Rankings on Google, ChatGPT, Perplexity, and Claude.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automations', description: 'n8n, Make, and custom scripts that replace manual work.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CRM Systems', description: 'GoHighLevel pipelines, workflows, and integrations.' } },
                            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Development', description: 'SaaS products, MVPs, internal tools, APIs.' } },
                        ],
                    },
                }}
            />

            {/* Hero */}
            <section className="bg-surface pt-36 pb-12 md:pb-16 px-6 md:px-12">
                <div className="services-hero-content opacity-0 max-w-4xl mx-auto text-center">
                    <h1 className="font-sans font-bold text-3xl md:text-5xl text-text tracking-tight mb-6 leading-[1.1]">
                        <TextAnimate animation="blurInUp" by="word" delay={0.08} startOnView={false} as="span">
                            What we build for B2B companies.
                        </TextAnimate>
                    </h1>
                    <p className="font-sans text-lg text-textMuted leading-relaxed max-w-2xl mx-auto">
                        End-to-end AI systems that generate leads, close deals, and scale operations. Built and managed by a team that's done it across SMBs and enterprise.
                    </p>
                </div>
            </section>

            {/* Bento grid */}
            <section className="bg-accent-light pb-20 md:pb-28 pt-6 md:pt-10 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <BentoGrid className="services-bento">
                        {features.map((feature) => (
                            <BentoCard key={feature.name} {...feature} />
                        ))}
                    </BentoGrid>
                </div>
            </section>

            <section className="bg-surface py-16 md:py-24 px-6 md:px-12 border-t border-accent-border">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-text mb-4">
                        Not sure where to start?
                    </h2>
                    <p className="font-sans text-lg text-textMuted leading-relaxed mb-8">
                        Book a free 30-minute call and we will map out exactly what your business needs.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans font-bold text-base text-white shadow-sm transition-colors hover:bg-accent/90"
                    >
                        Book a free call
                        <ArrowRight size={16} strokeWidth={2} className="opacity-60" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
